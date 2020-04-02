/**
 *
 * author: jxn
 * date: 2020.03.27
 *
 */
class Scratch3MachineBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            machine_result: this.getVariable,
            machine_var: this.getVariable,
            machine_varis: this.getVarIs
        };
    }

    getVariable (args, util) {
        const variable = util.target.lookupOrCreateVariable(args.MACHINE.id, args.MACHINE.name);
        return variable.value;
    }

    getVarIs (args, util) {
        const variable = util.target.lookupOrCreateVariable(args.MACHINE.id, args.MACHINE.name);
        const varName = variable.name.slice(2);
        if ((window.DMACHINE.currentIndex + 1) && varName === String(window.DMACHINE.currentIndex + 1)) return true;
        return false;
    }
}

module.exports = Scratch3MachineBlocks;
