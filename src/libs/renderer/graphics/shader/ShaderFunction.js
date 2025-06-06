import ShaderNode from './ShaderNode';

export default class ShaderFunction extends ShaderNode {
    constructor(name, output, parameters, operations) {
        super();
        this.name = name;
        this.output = output;
        this.parameters = Array.isArray(parameters) ? parameters : [parameters];
        this.operations = Array.isArray(operations) ? operations : [operations];
    }
}