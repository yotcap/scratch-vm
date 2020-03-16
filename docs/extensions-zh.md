# Scratch 3.0 拓展插件
本文档介绍了与 Scratch3.0 拓展开发相关的技术，包括 Scratch3.0 的拓展规范。
有关 Scratch3.0 拓展插件相关的其他文档请移步 [this Extensions page on the wiki](https://github.com/LLK/docs/wiki/Extensions)。

## 拓展类型
有四种拓展类型可以定义从 Scratch Core 库（比如”Looks"和“Operation”之类的）到远程 URL 加载的非官方扩展的所有内容。

**Scratch 3.0 现在还不支持非官方扩展**

更多内容请参考：[this Extensions page on the wiki](https://github.com/LLK/docs/wiki/Extensions)。

|                    | Core | Team | Official | unofficial |
| ------------------ | ---- | ---- | -------- | ---------- |
| 由Scratch团队开发    | √    |√     | O        | X          |
| 由Scratch团队维护    | √    |√     | O        | X          |
| 库中所示的           | X    |√     | √        | X          |
| 沙盒                | X    |X     | √        | √          |
| 可以将项目保存到社区的 | √    |√     | √        | X          |

## JavaScript 环境
Scrach3.0 大部分是由浏览器尚不支持的特性所编写的。我们为了更好的兼容，所以在发布或部署的时候会将代码转换为 ES5。`scratch-vm`库中所包含的任何拓展都可以使用 ES6+ 的特性，并且可以使用`require`来引入`scratch-vm`中的其它代码。

非官方的拓展必须是独立的。其拓展的开发者必须保证浏览器能够兼容这些拓展，包括在有必要的时候进行转码。

## 翻译
Scratch 扩展使用[ICU message format](http://userguide.icu-project.org/formatparse/messages)处理语言的翻译。对于 **core, team, offial**扩展，方法`formatMessage`被用来包装需要导出到[Scratch Transifex](https://www.transifex.com/llk/public/)进行翻译的任何 ICU 信息。

**所有的扩展**都可以在`getInfo`中定义一个名为`translation_map`的对象，用来在扩展内提供翻译。文章下方的“带注释的示例”章节较完整地说明了如何管理拓展中的翻译。**注意！**：`translation_map`功能现在处于提案阶段，在正式发布时可能会更改。

## 向后兼容
Scratch 被设计为完全向后兼容。正因为如此，块定义和 opcodes 决不能以可能导致先前保存的项目无法加载或以意外、不一致的方式进行操作的方式进行更改。

## 定义一个拓展

Scratch 的拓展由一个 js 类所定义，它可以接受被 Scratch VM runtime 或一个 ”runtime proxy“ 引用，它在一个被定义好的 worker boundary（即沙箱）中处理与 Scratch VM 的通信。
```js
class SomeBlocks {
    constructor (runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    // ...
}
```

所有的拓展都必须定义一个叫`getInfo`的方法，该方法返回一个对象，对象包含所有的块和拓展本身所需要的信息。

```js
// Core, Team, and Official extensions can `require` VM code:
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

class SomeBlocks {
    // ...
    getInfo () {
        return {
            id: 'someBlocks',
            name: 'Some Blocks',
            blocks: [
                {
                    opcode: 'myReporter',
                    blockType: BlockType.REPORTER,
                    text: 'letter [LETTER_NUM] of [TEXT]',
                    arguments: {
                        LETTER_NUM: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'text'
                        }
                    }
                }
            ]
        };
    }
    // ...
}
```

最后拓展必须为所有的 ”opcode“ 定义相对应的方法，就像这样：

```js
class SomeBlocks {
    // ...
    myReporter (args) {
        return args.TEXT.charAt(args.LETTER_NUM);
    };
    // ...
}
```

### 块参数
除了展示文本，块还可以拥有插槽形式的参数用来插入其它的块，或者从下拉菜单选择列表中选择参数值。

下面是块参数可能的类型：
- String - 输入一个字符串，这是一个可输入的字段，也可以接受插入其它的 reporter 块。
- Number - 和 string 相似的输入框，但是输入的类型必须是数字。
- Angle - 和 number 相似的输入框，但是它有一个额外的界面，可以从圆形刻度盘中选择角度。
- Boolean - 一个 boolean 输入框（六角形），该字段不可输入。
- Color - 颜色选择板，这个字段有个界面可以通过颜色的色相、饱和度和亮度值来选择一个颜色。另外，如果插件开发人员希望在每次添加插件时显示相同的颜色，还可以选择颜色选择器的默认值。如果没有设置默认值，那么每次加载插件时会随机选择。
- Matrix - 一个5×5单元的矩阵，每个单元格都可以被填充或清除。
- Note - 可以选择音符的数字输入框，可以从界面的虚拟键盘中选择一个音符。
- Image - 在块中插入图片，这是一个特殊的参数类型，因为它不代表一个值，也不接受其它要插入的块来替代这个块。参见下方有关「添加嵌入图片」的部分。

#### 添加一张内联图像
除了指定块参数（上面的代码片段中展示的字符串参数的示例）之外，你也可以为块指定一张内联图像。你必须为图片指定一个 dataURI。如果未指定，则将为图片的 dataURI 分配一个空值并且会在 console 中打印警告⚠️。你可以设置一个可选的属性，这个属性决定了当编辑器选择了从右到左的语言作为其语言环境时，图片是否应该水平翻转。
```js
return {
    // ...
    blocks: [
        {
            //...
            arguments {
                MY_IMAGE: {
                    type: ArgumentType.IMAGE,
                    dataURI: 'myImageData',
                    alt: 'This is an image',
                    flipRTL: true
                }
            }
        }
    ]
}
```

#### 定义一个菜单
要在块参数中显示下拉菜单，请在插件定义的菜单部分中指定该参数的菜单属性和匹配项。
```js
return {
    // ...
    blocks: [
        {
            // ...
            arguments: {
                FOO: {
                    type: ArgumentType.NUMBER,
                    menu: 'fooMenu'
                }
            }
        }
    ],
    menus: {
        fooMenu: {
            items: ['a', 'b', 'c']
        }
    }
}
```

菜单中的项可以用数组定义，也可以用返回值为数组的函数定义。
```js
getInfo () {
    return {
        menus: {
            staticMenu: ['static 1', 'static 2', 'static 3'],
            dynamicMenu: 'getDynamicMenuItems'
        }
    };
}
// this member function will be called each time the menu opens
getDynamicMenuItems () {
    return ['dynamic 1', 'dynamic 2', 'dynamic 3'];
}
```

上面的例子是下面定义菜单的简写：
```js
getInfo () {
    return {
        menus: {
            staticMenu: {
                items: ['static 1', 'static 2', 'static 3']
            },
            dynamicMenu: {
                items: 'getDynamicMenuItems'
            }
        }
    };
}
// this member function will be called each time the menu opens
getDynamicMenuItems () {
    return ['dynamic 1', 'dynamic 2', 'dynamic 3'];
}
```

如果一个菜单项需要的标签和其值不匹配 -- 比如说，如果标签值需要用用户的语言显示，但是其值需要保持不变 -- 则该菜单项可以是一个对象而不是字符串。这适用于静态和动态菜单项：
```js
menus: {
    staticMenu: [
        {
            text: formatMessage(/* ... */),
            value: 42
        }
    ]
}
```

##### 接受 reporters（可下拉菜单）
默认情况下无法通过插入 reporter 块指定下拉菜单的值。虽然我们鼓励拓展程序作者在可能的情况下让菜单接受 reporter，但这样做的时候必须仔细考虑以免使用拓展的人员感到困惑和沮丧。

其中的一些考虑如下：
- 当用户更改 Scratch 的语言时，有效值不能被改变。
  - 特别是改变的语言不能破坏项目功能。
- 普通的 Scratch 用户应该能够不参考拓展文档就可以计算出输入的有效值。
  - 确保这一点的一种方法是使 item 的文本匹配或包含 item 的值。比如说，官方的 Music 拓展包含名为”（1）钢琴“，值为1的菜单项，”（8）大提琴“对应的值为8，以此类推。
- 块应该可以接受任何值做为输入，甚至是”invalid“。
  - Scratch 没有运行错误的概念！
  - 对于一个指令块，有时候最好的选择是什么也不做。
  - 对于 reporter，返回零或者空字符串有时候可能是有意义的。
- 程序块在解释一个输入的时候应该是宽容的。
  - 比如说，如果这个块期望一个字符串，但是接收了一个数字，则可以将数字解释为字符串，而不是将其当做无效值来处理。

`acceptReporters`表示用户是否可以将 reporter 放入菜单输入项中：
```js
menus: {
    staticMenu: {
        acceptReporters: true,
        items: [/*...*/]
    },
    dynamicMenu: {
        acceptReporters: true,
        items: 'getDynamicMenuItems'
    }
}
```

## 带注释的示例

```js
// Core, Team, and Official extensions can `require` VM code:s
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');

// ...or VM dependencies:
const formatMessage = require('format-message');

// Core, Team, and Official extension classes should be registered statically with the Extension Manager.
// See: scratch-vm/src/extension-support/extension-manager.js
class SomeBlocks {
    constructor (runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            // Required: the machine-readable name of this extension.
            // Will be used as the extension's namespace.
            id: 'someBlocks',

            // Core extensions only: override the default extension block colors.
            color1: '#FF8C1A',
            color2: '#DB6E00',

            // Optional: the human-readable name of this extension as string.
            // This and any other string to be displayed in the Scratch UI may either be
            // a string or a call to `formatMessage`; a plain string will not be
            // translated whereas a call to `formatMessage` will connect the string
            // to the translation map (see below). The `formatMessage` call is
            // similar to `formatMessage` from `react-intl` in form, but will actually
            // call some extension support code to do its magic. For example, we will
            // internally namespace the messages such that two extensions could have
            // messages with the same ID without colliding.
            // See also: https://github.com/yahoo/react-intl/wiki/API#formatmessage
            name: formatMessage({
                id: 'extensionName',
                defaultMessage: 'Some Blocks',
                description: 'The name of the "Some Blocks" extension'
            }),

            // Optional: URI for a block icon, to display at the edge of each block for this
            // extension. Data URI OK.
            // TODO: what file types are OK? All web images? Just PNG?
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // Optional: URI for an icon to be displayed in the blocks category menu.
            // If not present, the menu will display the block icon, if one is present.
            // Otherwise, the category menu shows its default filled circle.
            // Data URI OK.
            // TODO: what file types are OK? All web images? Just PNG?
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // Optional: Link to documentation content for this extension.
            // If not present, offer no link.
            docsURI: 'https://....',

            // Required: the list of blocks implemented by this extension,
            // in the order intended for display.
            blocks: [
                {
                    // Required: the machine-readable name of this operation.
                    // This will appear in project JSON.
                    opcode: 'myReporter', // becomes 'someBlocks.myReporter'

                    // Required: the kind of block we're defining, from a predefined list.
                    // Fully supported block types:
                    //   BlockType.BOOLEAN - same as REPORTER but returns a Boolean value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from falsy to truthy ("edge triggered")
                    //   BlockType.REPORTER - returns a value, like "direction"
                    // Block types in development or for internal use only:
                    //   BlockType.BUTTON - place a button in the block palette
                    //   BlockType.CONDITIONAL - control flow, like "if {}" or "if {} else {}"
                    //     A CONDITIONAL block may return the one-based index of a branch to
                    //     run, or it may return zero/falsy to run no branch.
                    //   BlockType.EVENT - starts a stack in response to an event (full spec TBD)
                    //   BlockType.LOOP - control flow, like "repeat {} {}" or "forever {}"
                    //     A LOOP block is like a CONDITIONAL block with two differences:
                    //     - the block is assumed to have exactly one child branch, and
                    //     - each time a child branch finishes, the loop block is called again.
                    blockType: BlockType.REPORTER,

                    // Required for CONDITIONAL blocks, ignored for others: the number of
                    // child branches this block controls. An "if" or "repeat" block would
                    // specify a branch count of 1; an "if-else" block would specify a
                    // branch count of 2.
                    // TODO: should we support dynamic branch count for "switch"-likes?
                    branchCount: 0,

                    // Optional, default false: whether or not this block ends a stack.
                    // The "forever" and "stop all" blocks would specify true here.
                    terminal: true,

                    // Optional, default false: whether or not to block all threads while
                    // this block is busy. This is for things like the "touching color"
                    // block in compatibility mode, and is only needed if the VM runs in a
                    // worker. We might even consider omitting it from extension docs...
                    blockAllThreads: false,

                    // Required: the human-readable text on this block, including argument
                    // placeholders. Argument placeholders should be in [MACRO_CASE] and
                    // must be [ENCLOSED_WITHIN_SQUARE_BRACKETS].
                    text: formatMessage({
                        id: 'myReporter',
                        defaultMessage: 'letter [LETTER_NUM] of [TEXT]',
                        description: 'Label on the "myReporter" block'
                    }),

                    // Required: describe each argument.
                    // Argument order may change during translation, so arguments are
                    // identified by their placeholder name. In those situations where
                    // arguments must be ordered or assigned an ordinal, such as interaction
                    // with Scratch Blocks, arguments are ordered as they are in the default
                    // translation (probably English).
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        LETTER_NUM: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.NUMBER,

                            // Optional: the default value of the argument
                            default: 1
                        },

                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        TEXT: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.STRING,

                                // Optional: the default value of the argument
                            default: formatMessage({
                                id: 'myReporter.TEXT_default',
                                defaultMessage: 'text',
                                description: 'Default for "TEXT" argument of "someBlocks.myReporter"'
                            })
                        }
                    },

                    // Optional: the function implementing this block.
                    // If absent, assume `func` is the same as `opcode`.
                    func: 'myReporter',

                    // Optional: list of target types for which this block should appear.
                    // If absent, assume it applies to all builtin targets -- that is:
                    // [TargetType.SPRITE, TargetType.STAGE]
                    filter: [TargetType.SPRITE]
                },
                {
                    // Another block...
                }
            ],

            // Optional: define extension-specific menus here.
            menus: {
                // Required: an identifier for this menu, unique within this extension.
                menuA: [
                    // Static menu: list items which should appear in the menu.
                    {
                        // Required: the value of the menu item when it is chosen.
                        value: 'itemId1',

                        // Optional: the human-readable label for this item.
                        // Use `value` as the text if this is absent.
                        text: formatMessage({
                            id: 'menuA_item1',
                            defaultMessage: 'Item One',
                            description: 'Label for item 1 of menu A in "Some Blocks" extension'
                        })
                    },

                    // The simplest form of a list item is a string which will be used as
                    // both value and text.
                    'itemId2'
                ],

                // Dynamic menu: returns an array as above.
                // Called each time the menu is opened.
                menuB: 'getItemsForMenuB',

                // The examples above are shorthand for setting only the `items` property in this full form:
                menuC: {
                    // This flag makes a "droppable" menu: the menu will allow dropping a reporter in for the input.
                    acceptReporters: true,

                    // The `item` property may be an array or function name as in previous menu examples.
                    items: [/*...*/] || 'getItemsForMenuC'
                }
            },

            // Optional: translations (UNSTABLE - NOT YET SUPPORTED)
            translation_map: {
                de: {
                    'extensionName': 'Einige Blöcke',
                    'myReporter': 'Buchstabe [LETTER_NUM] von [TEXT]',
                    'myReporter.TEXT_default': 'Text',
                    'menuA_item1': 'Artikel eins',

                    // Dynamic menus can be translated too
                    'menuB_example': 'Beispiel',

                    // This message contains ICU placeholders (see `myReporter()` below)
                    'myReporter.result': 'Buchstabe {LETTER_NUM} von {TEXT} ist {LETTER}.'
                },
                it: {
                    // ...
                }
            }
        };
    };

    /**
     * Implement myReporter.
     * @param {object} args - the block's arguments.
     * @property {string} MY_ARG - the string value of the argument.
     * @returns {string} a string which includes the block argument value.
     */
    myReporter (args) {
        // This message contains ICU placeholders, not Scratch placeholders
        const message = formatMessage({
            id: 'myReporter.result',
            defaultMessage: 'Letter {LETTER_NUM} of {TEXT} is {LETTER}.',
            description: 'The text template for the "myReporter" block result'
        });

        // Note: this implementation is not Unicode-clean; it's just here as an example.
        const result = args.TEXT.charAt(args.LETTER_NUM);

        return message.format({
            LETTER_NUM: args.LETTER_NUM,
            TEXT: args.TEXT,
            LETTER: result
        });
    };
}
```
