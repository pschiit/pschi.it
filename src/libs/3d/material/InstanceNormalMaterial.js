import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';

export default class InstanceNormalMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.setParameter(Material.parameters.projectionMatrix);

        const position = Parameter.vector4('position');
        const vColor = Parameter.vector3('v_' + Material.parameters.color, Parameter.qualifier.out);
        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.add(
                    Material.parameters.position,
                    Operation.toVector4(Material.parameters.instancePosition, 0))),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    position)),
            Operation.equal(
                vColor,
                Operation.add(
                    Operation.multiply(Operation.toVector3(Material.parameters.normal), 0.5),
                    0.5
                )),]);

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(vColor, 1))]);
    }

    static parameters = {
    }
}