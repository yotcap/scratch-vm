const BlockType = require('../../extension-support/block-type');

class MachineLearning {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'MACHINE',
            name: 'Machine Learning',
            custom: 'MACHINE',
            blocks: [
                {
                    func: 'MAKE_A_MODEL',
                    blockType: BlockType.BUTTON,
                    text: '生成模型'
                },
                {
                    opcode: 'getSth',
                    text: '取某些值',
                    blockType: BlockType.REPORTER
                }
            ]
        };
    }

    MAKE_A_MODEL () {
        // ... just generate a btn
    }

    getSth () {
        return 60;
    }

}

module.exports = MachineLearning;
