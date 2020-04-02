// Core, Team, and Official extensions can `require` VM code:
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPm11c2ljLWJsb2NrLWljb248L3RpdGxlPjxkZWZzPjxwYXRoIGQ9Ik0zMi4xOCAyNS44NzRDMzIuNjM2IDI4LjE1NyAzMC41MTIgMzAgMjcuNDMzIDMwYy0zLjA3IDAtNS45MjMtMS44NDMtNi4zNzItNC4xMjYtLjQ1OC0yLjI4NSAxLjY2NS00LjEzNiA0Ljc0My00LjEzNi42NDcgMCAxLjI4My4wODQgMS44OS4yMzQuMzM4LjA4Ni42MzcuMTguOTM4LjMwMi44Ny0uMDItLjEwNC0yLjI5NC0xLjgzNS0xMi4yMy0yLjEzNC0xMi4zMDIgMy4wNi0xLjg3IDguNzY4LTIuNzUyIDUuNzA4LS44ODUuMDc2IDQuODItMy42NSAzLjg0NC0zLjcyNC0uOTg3LTQuNjUtNy4xNTMuMjYzIDE0LjczOHptLTE2Ljk5OCA1Ljk5QzE1LjYzIDM0LjE0OCAxMy41MDcgMzYgMTAuNDQgMzZjLTMuMDcgMC01LjkyMi0xLjg1Mi02LjM4LTQuMTM2LS40NDgtMi4yODQgMS42NzQtNC4xMzUgNC43NS00LjEzNSAxLjAwMyAwIDEuOTc1LjE5NiAyLjg1NS41NDMuODIyLS4wNTUtLjE1LTIuMzc3LTEuODYyLTEyLjIyOC0yLjEzMy0xMi4zMDMgMy4wNi0xLjg3IDguNzY0LTIuNzUzIDUuNzA2LS44OTQuMDc2IDQuODItMy42NDggMy44MzQtMy43MjQtLjk4Ny00LjY1LTcuMTUyLjI2MiAxNC43Mzh6IiBpZD0iYSIvPjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjx1c2UgZmlsbD0iI0ZGRiIgeGxpbms6aHJlZj0iI2EiLz48cGF0aCBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZT0iIzAwMCIgZD0iTTI4LjQ1NiAyMS42NzVjLS4wMS0uMzEyLS4wODctLjgyNS0uMjU2LTEuNzAyLS4wOTYtLjQ5NS0uNjEyLTMuMDIyLS43NTMtMy43My0uMzk1LTEuOTgtLjc2LTMuOTItMS4xNDItNi4xMTMtLjczMi00LjIyMy0uNjkzLTYuMDUuMzQ0LTYuNTI3LjUtLjIzIDEuMDYtLjA4IDEuODQuMzUuNDE0LjIyNyAyLjE4MiAxLjM2NSAyLjA3IDEuMjk2IDEuOTk0IDEuMjQyIDMuNDY0IDEuNzc0IDQuOTMgMS41NDggMS41MjYtLjIzNyAyLjUwNC0uMDYgMi44NzYuNjE4LjM0OC42MzUuMDE1IDEuNDE2LS43MyAyLjE4LTEuNDcyIDEuNTE2LTMuOTc1IDIuNTE0LTUuODQ4IDIuMDIzLS44MjItLjIyLTEuMjM4LS40NjUtMi4zOC0xLjI2N2wtLjA5NS0uMDY2Yy4wNDcuNTkzLjI2NCAxLjc0LjcxNyAzLjgwMy4yOTQgMS4zMzYgMi4wOCA5LjE4NyAyLjYzNyAxMS42NzRsLjAwMi4wMTJjLjUyOCAyLjYzNy0xLjg3MyA0LjcyNC01LjIzNiA0LjcyNC0zLjI5IDAtNi4zNjMtMS45ODgtNi44NjItNC41MjgtLjUzLTIuNjQgMS44NzMtNC43MzQgNS4yMzMtNC43MzQuNjcyIDAgMS4zNDcuMDg1IDIuMDE0LjI1LjIyNy4wNTcuNDM2LjExOC42MzYuMTg3em0tMTYuOTk2IDUuOTljLS4wMS0uMzE4LS4wOS0uODM4LS4yNjYtMS43MzctLjA5LS40Ni0uNTk1LTIuOTM3LS43NTMtMy43MjctLjM5LTEuOTYtLjc1LTMuODktMS4xMy02LjA3LS43MzItNC4yMjMtLjY5Mi02LjA1LjM0NC02LjUyNi41MDItLjIzIDEuMDYtLjA4MiAxLjg0LjM1LjQxNS4yMjcgMi4xODIgMS4zNjQgMi4wNyAxLjI5NSAxLjk5MyAxLjI0MiAzLjQ2MiAxLjc3NCA0LjkyNiAxLjU0OCAxLjUyNS0uMjQgMi41MDQtLjA2NCAyLjg3Ni42MTQuMzQ4LjYzNS4wMTUgMS40MTUtLjcyOCAyLjE4LTEuNDc0IDEuNTE3LTMuOTc3IDIuNTEzLTUuODQ3IDIuMDE3LS44Mi0uMjItMS4yMzYtLjQ2NC0yLjM3OC0xLjI2N2wtLjA5NS0uMDY1Yy4wNDcuNTkzLjI2NCAxLjc0LjcxNyAzLjgwMi4yOTQgMS4zMzcgMi4wNzggOS4xOSAyLjYzNiAxMS42NzVsLjAwMy4wMTNjLjUxNyAyLjYzOC0xLjg4NCA0LjczMi01LjIzNCA0LjczMi0zLjI4NyAwLTYuMzYtMS45OTMtNi44Ny00LjU0LS41Mi0yLjY0IDEuODg0LTQuNzMgNS4yNC00LjczLjkwNSAwIDEuODAzLjE1IDIuNjUuNDM2eiIvPjwvZz48L3N2Zz4=';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2LjA5IDEyLjkzN2MuMjI4IDEuMTQxLS44MzMgMi4wNjMtMi4zNzMgMi4wNjMtMS41MzUgMC0yLjk2Mi0uOTIyLTMuMTg2LTIuMDYzLS4yMy0xLjE0Mi44MzMtMi4wNjggMi4zNzItMi4wNjguMzIzIDAgLjY0MS4wNDIuOTQ1LjExN2EzLjUgMy41IDAgMCAxIC40NjguMTUxYy40MzUtLjAxLS4wNTItMS4xNDctLjkxNy02LjExNC0xLjA2Ny02LjE1MiAxLjUzLS45MzUgNC4zODQtMS4zNzcgMi44NTQtLjQ0Mi4wMzggMi40MS0xLjgyNSAxLjkyMi0xLjg2Mi0uNDkzLTIuMzI1LTMuNTc3LjEzMiA3LjM3ek03LjQ2IDguNTYzYy0xLjg2Mi0uNDkzLTIuMzI1LTMuNTc2LjEzIDcuMzdDNy44MTYgMTcuMDczIDYuNzU0IDE4IDUuMjIgMThjLTEuNTM1IDAtMi45NjEtLjkyNi0zLjE5LTIuMDY4LS4yMjQtMS4xNDIuODM3LTIuMDY3IDIuMzc1LTIuMDY3LjUwMSAwIC45ODcuMDk4IDEuNDI3LjI3Mi40MTItLjAyOC0uMDc0LTEuMTg5LS45My02LjExNEMzLjgzNCAxLjg3IDYuNDMgNy4wODcgOS4yODIgNi42NDZjMi44NTQtLjQ0Ny4wMzggMi40MS0xLjgyMyAxLjkxN3oiIGZpbGw9IiM1NzVFNzUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==';

class HelloWorld {
    constructor (runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.HelloWorld';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'helloworld',
            name: 'hello world',
            menuIconURI,
            blockIconURI,
            blocks: [
                {
                    opcode: 'say',
                    blockType: BlockType.COMMAND,
                    text: 'say[TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'say hello'
                        }
                    }
                }
            ],
            menus: {}
        };
    }

    say (args, util) {
        const message = args.TEXT;
        this.runtime.emit('SAY', util.target, 'say', message);
    }
}

module.exports = HelloWorld;
