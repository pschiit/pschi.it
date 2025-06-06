import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';

export default class NormalMaterial extends Material {
    constructor() {
        super();

        const vColor = Parameter.vector4('v_' + Material.parameters.color, Parameter.qualifier.out);
        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Shader.parameters.output,
                Material.parameters.position),
            Operation.equal(
                vColor,
                Operation.toVector4(
                    Operation.add(
                        Operation.multiply(Operation.toVector3(Material.parameters.normal), 0.5),
                        0.5),
                    1)),]);

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(
                Shader.parameters.output,
                vColor)]);
    }
}