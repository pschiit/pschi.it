import Vector4 from '../../math/Vector4';
import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import InstanceNormalMaterial from './InstanceNormalMaterial';
import LightMaterial from './LightMaterial';

export default class InstanceLightMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;

        this.shininess = 2;

        [
            Material.parameters.cameraPosition,
            Material.parameters.projectionMatrix,
            Material.parameters.backgroundColor,
            LightMaterial.parameters.directionalShadowLightColor,
            LightMaterial.parameters.directionalShadowLightDirection,
            LightMaterial.parameters.directionalShadowLightAmbientStrength,
            LightMaterial.parameters.directionalShadowLightShadowMap,
            LightMaterial.parameters.directionalShadowLightShadowMatrix,].forEach(p => this.setParameter(p));

        this.fog = false;

        this.directionalLightsCount = 0;
    }

    createShader() {
        const position = Parameter.vector4('position');
        const vColor = Parameter.vector4('v_' + Material.parameters.color, Parameter.qualifier.out);
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);
        const vNormal = Parameter.vector3('v_' + Material.parameters.normal, Parameter.qualifier.out);

        const vPositionFromDirectionalShadowLight = Parameter.vector4('v_positionFromDirectionalShadowLight', Parameter.qualifier.out);

        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.add(
                    Material.parameters.position,
                    Operation.toVector4(Material.parameters.instancePosition, 0))),
            Operation.equal(
                position,
                Operation.multiply(
                    Material.parameters.vertexMatrix,
                    position)),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(Material.parameters.projectionMatrix, position)),
            Operation.equal(
                vNormal,
                Operation.normalize(
                    Operation.toVector3(Operation.multiply(
                        Material.parameters.normalMatrix,
                        Material.parameters.normal)))),
            Operation.equal(vPosition, Operation.toVector3(position)),
            Operation.equal(vColor, Material.parameters.instanceColor),
            Operation.equal(
                vPositionFromDirectionalShadowLight,
                Operation.multiply(LightMaterial.parameters.directionalShadowLightShadowMatrix, position))
        ]);

        const normal = Parameter.vector3('normal');
        const fragmentColor = Parameter.vector4('fragmentColor');
        const nCameraPosition = Parameter.vector3('nCameraPosition');
        const nDotL = Parameter.number('nDotL');
        const spec = Parameter.number('spec');
        const lightColor = Parameter.vector3('lightColor');

        const projection = Parameter.vector3('projection');
        const rgbaDepth = Parameter.vector4('rgbaDepth');
        const depth = Operation.dot(
            rgbaDepth,
            new Vector4(1, 1 / 256, 1 / (256 * 256), 1 / (256 * 256 * 256)));//'vec4(1.0, 1.0/ 256.0, 1.0/(256.0 * 256.0),1.0/(256.0 * 256.0 * 256.0))');

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(Operation.declare(normal), Operation.normalize(vNormal)),
            Operation.equal(Operation.declare(nCameraPosition), Operation.normalize(Operation.substract(Material.parameters.cameraPosition, vPosition))),
            Operation.equal(Operation.declare(fragmentColor), vColor),
            Operation.equal(
                Operation.declare(nDotL),
                Operation.max(
                    Operation.dot(LightMaterial.parameters.directionalShadowLightDirection, normal),
                    0
                )
            ),
            Operation.if(
                Operation.isEqual(nDotL, 0),
                Operation.multiplyTo(
                    fragmentColor,
                    Operation.toVector4(
                        Operation.multiply(
                            LightMaterial.parameters.directionalShadowLightColor,
                            LightMaterial.parameters.directionalShadowLightAmbientStrength), 1))),
            Operation.else([
                Operation.equal(
                    Operation.declare(projection),
                    Operation.add(
                        Operation.multiply(
                            Operation.divide(
                                Operation.selection(vPositionFromDirectionalShadowLight, '.xyz'),
                                Operation.selection(vPositionFromDirectionalShadowLight, '.w')),
                            0.5),
                        0.5)
                ),
                Operation.equal(
                    Operation.declare(rgbaDepth),
                    Operation.read(LightMaterial.parameters.directionalShadowLightShadowMap, Operation.selection(projection, '.xy')),
                ),
                Operation.if(
                    Operation.and(
                        Operation.notEquals(rgbaDepth, new Vector4()),
                        Operation.greater(
                            Operation.selection(projection, '.z'),
                            Operation.add(depth, 0.007),
                        )),
                    Operation.multiplyTo(
                        fragmentColor,
                        Operation.toVector4(
                            Operation.multiply(
                                LightMaterial.parameters.directionalShadowLightColor,
                                LightMaterial.parameters.directionalShadowLightAmbientStrength,
                                0.5), 1))
                ),
                Operation.else([
                    Operation.equal(
                        Operation.declare(spec),//blinn-phong
                        Operation.pow(Operation.max(Operation.dot(normal, Operation.normalize(Operation.add(LightMaterial.parameters.directionalShadowLightDirection, nCameraPosition))), 0), LightMaterial.parameters.shininess)
                    ),
                    // Operation.equal(
                    //     Operation.declare(spec),//phong
                    //     Operation.pow(Operation.max(Operation.dot(cameraPosition, Operation.substract(Operation.multiply(2, Operation.dot(normal, lightDirection), normal), lightDirection)), 0), PhongMaterial.parameters.shininess)
                    // ),
                    Operation.equal(
                        Operation.declare(lightColor), Operation.add(
                            Operation.multiply(
                                LightMaterial.parameters.directionalShadowLightColor,
                                LightMaterial.parameters.directionalShadowLightAmbientStrength),
                            Operation.multiply(LightMaterial.parameters.directionalShadowLightColor, nDotL),
                            Operation.multiply(spec, LightMaterial.parameters.directionalShadowLightColor))
                    ),
                    Operation.multiplyTo(
                        fragmentColor,
                        Operation.toVector4(lightColor, 1)),
                ]),
            ]),
            Operation.equal(Shader.parameters.output, fragmentColor),
            Material.operation.gammaCorrection]);
    }

    get directionalLightsCount() {
        return this._directionalLightsCount;
    }

    set directionalLightsCount(v) {
        if (this.directionalLightsCount != v) {
            this._directionalLightsCount = v;
            this.vertexShader = null;
            this.fragmentShader = null;
        }
    }

    get shininess() {
        return this.getParameter(LightMaterial.parameters.shininess);
    }

    set shininess(v) {
        this.setParameter(LightMaterial.parameters.shininess, v);
    }

    get compiled() {
        if (!this.vertexShader || !this.fragmentShader) {
            this.createShader();
        }
        return super.compiled;
    }

    static parameters = {
        ambientColor: Parameter.vector3('materialAmbientColor', Parameter.qualifier.const),
        diffuseColor: Parameter.vector3('materialDiffuseColor', Parameter.qualifier.const),
        specularColor: Parameter.vector3('materialSpecularColor', Parameter.qualifier.const),
        emissiveColor: Parameter.vector3('materialEmissiveColor', Parameter.qualifier.const),
        ambientTexture: Parameter.texture('materialAmbientTexture', Parameter.qualifier.const),
        diffuseTexture: Parameter.texture('materialDiffuseTexture', Parameter.qualifier.const),
        specularTexture: Parameter.texture('materialSpecularTexture', Parameter.qualifier.const),
        emissiveTexture: Parameter.texture('materialEmissiveTexture', Parameter.qualifier.const),
        shininess: Parameter.number('materialShininess', Parameter.qualifier.const),

        directionalLightColor: Parameter.vector3('directionalLightColor', Parameter.qualifier.const),
        directionalLightDirection: Parameter.vector3('directionalLightDirection', Parameter.qualifier.const),
        directionalLightAmbientStrength: Parameter.number('directionalLightAmbientStrength', Parameter.qualifier.const),

        directionalShadowLightShadowMatrix: Parameter.matrix4('directionalShadowLightShadowMatrix', Parameter.qualifier.const),
        directionalShadowLightShadowMap: Parameter.texture('directionalShadowLightShadowMap', Parameter.qualifier.const),
        directionalShadowLightColor: Parameter.vector3('directionalShadowLightColor', Parameter.qualifier.const),
        directionalShadowLightDirection: Parameter.vector3('directionalShadowLightDirection', Parameter.qualifier.const),
        directionalShadowLightAmbientStrength: Parameter.number('directionalShadowLightAmbientStrength', Parameter.qualifier.const),

        pointLightColor: Parameter.vector3('pointLightColor', Parameter.qualifier.const),
        pointLightPosition: Parameter.vector3('pointLightPosition', Parameter.qualifier.const),
        pointLightAmbientStrength: Parameter.number('pointLightAmbientStrength', Parameter.qualifier.const),
        pointLightIntensity: Parameter.number('pointLightIntensity', Parameter.qualifier.const),

        pointShadowLightShadowMatrix: Parameter.matrix4('pointShadowLightShadowMatrix', Parameter.qualifier.const),
        pointShadowLightShadowMap: Parameter.texture('pointShadowLightShadowMap', Parameter.qualifier.const),
        pointShadowLightColor: Parameter.vector3('pointShadowLightColor', Parameter.qualifier.const),
        pointShadowLightPosition: Parameter.vector3('pointShadowLightPosition', Parameter.qualifier.const),
        pointShadowLightAmbientStrength: Parameter.number('pointShadowLightAmbientStrength', Parameter.qualifier.const),
        pointShadowLightIntensity: Parameter.number('pointShadowLightIntensity', Parameter.qualifier.const),


        spotLightColor: Parameter.vector3('spotLightColor', Parameter.qualifier.const),
        spotLightPosition: Parameter.vector3('spotLightPosition', Parameter.qualifier.const),
        spotLightDirection: Parameter.vector3('spotLightDirection', Parameter.qualifier.const),
        spotLightAmbientStrength: Parameter.number('spotLightAmbientStrength', Parameter.qualifier.const),
        spotLightRadius: Parameter.number('spotLightRadius', Parameter.qualifier.const),
        spotLightInnerRadius: Parameter.number('spotLightInnerRadius', Parameter.qualifier.const),
        spotLightIntensity: Parameter.number('spotLightIntensity', Parameter.qualifier.const),

        spotShadowLightShadowMatrix: Parameter.matrix4('spotShadowLightShadowMatrix', Parameter.qualifier.const),
        spotShadowLightShadowMap: Parameter.texture('spotShadowLightShadowMap', Parameter.qualifier.const),
        spotShadowLightColor: Parameter.vector3('spotShadowLightColor', Parameter.qualifier.const),
        spotShadowLightPosition: Parameter.vector3('spotShadowLightPosition', Parameter.qualifier.const),
        spotShadowLightDirection: Parameter.vector3('spotShadowLightDirection', Parameter.qualifier.const),
        spotShadowLightAmbientStrength: Parameter.number('spotShadowLightAmbientStrength', Parameter.qualifier.const),
        spotShadowLightRadius: Parameter.number('spotShadowLightRadius', Parameter.qualifier.const),
        spotShadowLightInnerRadius: Parameter.number('spotShadowLightInnerRadius', Parameter.qualifier.const),
        spotShadowLightIntensity: Parameter.number('spotShadowLightIntensity', Parameter.qualifier.const),
    };
}

const shadowMaterial = new Material();
shadowMaterial.culling = Material.culling.front;
shadowMaterial.depth = Material.depth.less;
    shadowMaterial.setParameter(Material
        .parameters.projectionMatrix);
const position = Parameter.vector4('position');
shadowMaterial.vertexShader = Shader.vertexShader([
    Operation.equal(
        Operation.declare(position),
        Operation.add(
            Material.parameters.position,
            Operation.toVector4(Material.parameters.instancePosition, 0))),
    Operation.equal(
        Shader.parameters.output,
        Operation.multiply(
            Material.parameters.projectionMatrix,
            Material.parameters.vertexMatrix,
            position))
]);
const depth = Parameter.vector4('depth');
shadowMaterial.fragmentShader = Shader.fragmentShader([
    Operation.equal(
        Operation.declare(depth),
        Operation.fract(
            Operation.multiply(
                Operation.selection(Shader.parameters.fragmentCoordinate, '.z'),
                new Vector4(1, 256, 256 * 256, 256 * 256 * 256))
        )
    ),
    Operation.substractTo(
        depth,
        Operation.multiply(
            Operation.selection(depth, '.gbaa'),
            new Vector4(1 / 256, 1 / 256, 1 / 256, 0)
        )),
    Operation.equal(
        Shader.parameters.output,
        depth)
]);
InstanceLightMaterial.shadowMaterial = shadowMaterial;