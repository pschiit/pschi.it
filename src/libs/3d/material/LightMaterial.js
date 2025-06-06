import Color from '../../core/Color';
import Vector3 from '../../math/Vector3';
import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import ShaderFunction from '../../renderer/graphics/shader/ShaderFunction';

export default class LightMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;

        this.shininess = 32;
        this.ambientColor = Color.white();
        this.diffuseColor = Color.white();
        this.specularColor = Color.white();
        this.emissiveColor = Color.black();

        [Material.parameters.texture,
        Material.parameters.textureProjectionMatrix,
        Material.parameters.fogDistance,
        Material.parameters.cameraPosition,
        Material.parameters.projectionMatrix,
        Material.parameters.backgroundColor,
        Material.parameters.backgroundColor,
        LightMaterial.parameters.ambientTexture,
        LightMaterial.parameters.diffuseTexture,
        LightMaterial.parameters.specularTexture,
        LightMaterial.parameters.emissiveTexture,
        LightMaterial.parameters.directionalLightColor,
        LightMaterial.parameters.directionalLightDirection,
        LightMaterial.parameters.directionalLightAmbientStrength,
        LightMaterial.parameters.directionalShadowLightColor,
        LightMaterial.parameters.directionalShadowLightDirection,
        LightMaterial.parameters.directionalShadowLightAmbientStrength,
        LightMaterial.parameters.directionalShadowLightShadowMap,
        LightMaterial.parameters.directionalShadowLightShadowMatrix,
        LightMaterial.parameters.pointLightColor,
        LightMaterial.parameters.pointLightPosition,
        LightMaterial.parameters.pointLightAmbientStrength,
        LightMaterial.parameters.pointLightIntensity,
        LightMaterial.parameters.pointShadowLightColor,
        LightMaterial.parameters.pointShadowLightPosition,
        LightMaterial.parameters.pointShadowLightAmbientStrength,
        LightMaterial.parameters.pointShadowLightIntensity,
        LightMaterial.parameters.pointShadowLightShadowMap,
        LightMaterial.parameters.pointShadowLightShadowMatrix,
        LightMaterial.parameters.spotLightColor,
        LightMaterial.parameters.spotLightDirection,
        LightMaterial.parameters.spotLightPosition,
        LightMaterial.parameters.spotLightRadius,
        LightMaterial.parameters.spotLightInnerRadius,
        LightMaterial.parameters.spotLightAmbientStrength,
        LightMaterial.parameters.spotLightIntensity,
        LightMaterial.parameters.spotShadowLightColor,
        LightMaterial.parameters.spotShadowLightDirection,
        LightMaterial.parameters.spotShadowLightPosition,
        LightMaterial.parameters.spotShadowLightRadius,
        LightMaterial.parameters.spotShadowLightInnerRadius,
        LightMaterial.parameters.spotShadowLightAmbientStrength,
        LightMaterial.parameters.spotShadowLightIntensity,
        LightMaterial.parameters.spotShadowLightShadowMap,
        LightMaterial.parameters.spotShadowLightShadowMatrix,].forEach(p => this.setParameter(p));

        this.fog = true;

        this.directionalLightsCount = 0;
        this.directionalShadowLightsCount = 0;
        this.pointLightsCount = 0;
        this.pointShadowLightsCount = 0;
        this.spotLightsCount = 0;
        this.spotShadowLightsCount = 0;
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

    get directionalShadowLightsCount() {
        return this._directionalShadowLightsCount;
    }

    set directionalShadowLightsCount(v) {
        if (this.directionalShadowLightsCount != v) {
            this._directionalShadowLightsCount = v;
            this.vertexShader = null;
            this.fragmentShader = null;
        }
    }

    get pointLightsCount() {
        return this._pointLightsCount;
    }

    set pointLightsCount(v) {
        if (this.pointLightsCount != v) {
            this._pointLightsCount = v;
            this.vertexShader = null;
            this.fragmentShader = null;
        }
    }

    get pointShadowLightsCount() {
        return this._pointShadowLightsCount;
    }

    set pointShadowLightsCount(v) {
        if (this.pointShadowLightsCount != v) {
            this._pointShadowLightsCount = v;
            this.vertexShader = null;
            this.fragmentShader = null;
        }
    }

    get spotLightsCount() {
        return this._spotLightsCount;
    }

    set spotLightsCount(v) {
        if (this.spotLightsCount != v) {
            this._spotLightsCount = v;
            this.vertexShader = null;
            this.fragmentShader = null;
        }
    }

    get spotShadowLightsCount() {
        return this._spotShadowLightsCount;
    }

    set spotShadowLightsCount(v) {
        if (this.spotShadowLightsCount != v) {
            this._spotShadowLightsCount = v;
            this.vertexShader = null;
            this.fragmentShader = null;
        }
    }

    get ambientColor() {
        return this.getParameter(LightMaterial.parameters.ambientColor);
    }

    set ambientColor(v) {
        this.setParameter(LightMaterial.parameters.ambientColor, v);
    }

    get diffuseColor() {
        return this.getParameter(LightMaterial.parameters.diffuseColor);
    }

    set diffuseColor(v) {
        this.setParameter(LightMaterial.parameters.diffuseColor, v);
    }

    get specularColor() {
        return this.getParameter(LightMaterial.parameters.specularColor);
    }

    set specularColor(v) {
        this.setParameter(LightMaterial.parameters.specularColor, v);
    }

    get emissiveColor() {
        return this.getParameter(LightMaterial.parameters.emissiveColor);
    }

    set emissiveColor(v) {
        this.setParameter(LightMaterial.parameters.emissiveColor, v);
    }

    get ambientTexture() {
        return this.getParameter(LightMaterial.parameters.ambientTexture);
    }

    set ambientTexture(v) {
        this.setParameter(LightMaterial.parameters.ambientTexture, v);
    }

    get diffuseTexture() {
        return this.getParameter(LightMaterial.parameters.diffuseTexture);
    }

    set diffuseTexture(v) {
        this.setParameter(LightMaterial.parameters.diffuseTexture, v);
    }

    get specularTexture() {
        return this.getParameter(LightMaterial.parameters.specularTexture);
    }

    set specularTexture(v) {
        this.setParameter(LightMaterial.parameters.specularTexture, v);
    }

    get emissiveTexture() {
        return this.getParameter(LightMaterial.parameters.emissiveTexture);
    }

    set emissiveTexture(v) {
        this.setParameter(LightMaterial.parameters.emissiveTexture, v);
    }

    get shininess() {
        return this.getParameter(LightMaterial.parameters.shininess);
    }

    set shininess(v) {
        this.setParameter(LightMaterial.parameters.shininess, v);
    }

    get texture() {
        return this.getParameter(Material.parameters.texture);
    }

    set texture(v) {
        this.setParameter(Material.parameters.texture, v);
    }

    get compiled() {
        if (!this.vertexShader || !this.fragmentShader) {
            this.createShader();
        }
        return super.compiled;
    }

    createShader() {
        this.directionalLightsCount = this.getParameter(LightMaterial.parameters.directionalLightAmbientStrength)?.length || 0;
        this.directionalShadowLightsCount = this.getParameter(LightMaterial.parameters.directionalShadowLightAmbientStrength)?.length || 0;
        this.pointLightsCount = this.getParameter(LightMaterial.parameters.pointLightAmbientStrength)?.length || 0;
        this.pointShadowLightsCount = this.getParameter(LightMaterial.parameters.pointShadowLightAmbientStrength)?.length || 0;
        this.spotLightsCount = this.getParameter(LightMaterial.parameters.spotLightAmbientStrength)?.length || 0;
        this.spotShadowLightsCount = this.getParameter(LightMaterial.parameters.spotShadowLightAmbientStrength)?.length || 0;
        const hasLight = this.directionalLightsCount || this.directionalShadowLightsCount
            || this.pointLightsCount
            || this.spotLightsCount || this.spotShadowLightsCount;

        const position = Parameter.vector4('position');
        const vColor = Parameter.vector4('v_' + Material.parameters.color, Parameter.qualifier.out);
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);
        const vNormal = Parameter.vector3('v_' + Material.parameters.normal, Parameter.qualifier.out);
        const vUV = Parameter.vector2('v_' + Material.parameters.uv, Parameter.qualifier.out);
        const vDistance = Parameter.number('v_' + Material.parameters.fogDistance, Parameter.qualifier.out);

        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.multiply(
                    Material.parameters.vertexMatrix,
                    Material.parameters.position)),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(Material.parameters.projectionMatrix, position)),
            Operation.equal(vDistance, Operation.selection(Shader.parameters.output, '.w')),
            Operation.equal(
                vNormal,
                Operation.normalize(
                    Operation.toVector3(Operation.multiply(
                        Material.parameters.normalMatrix,
                        Material.parameters.normal)))),
            Operation.equal(vPosition, Operation.toVector3(position)),
            Operation.equal(vColor, Material.parameters.color),
            Operation.equal(vUV, Material.parameters.uv),
        ]);

        const normal = Parameter.vector3('normal');
        const fragmentColor = Parameter.vector4('fragmentColor');
        const fragmentRGB = Operation.selection(fragmentColor, '.rgb');
        const nCameraPosition = Parameter.vector3('nCameraPosition');
        const operations = [
            Operation.equal(Operation.declare(normal), Operation.normalize(vNormal)),
            Operation.equal(Operation.declare(nCameraPosition), Operation.normalize(Operation.substract(Material.parameters.cameraPosition, vPosition))),
            Operation.equal(Operation.declare(fragmentColor), vColor),];

        if (this.texture) {
            if (this.getParameter(Material.parameters.projectionMatrix)) {
                const vTextureProjection = Parameter.vector4('v_textureProjection', Parameter.qualifier.out);
                this.vertexShader.operations.push(
                    Operation.equal(
                        vTextureProjection,
                        Operation.multiply(Material.parameters.textureProjectionMatrix, position)));

                const projection = Parameter.vector3('textureCoordinate');
                const x = Operation.selection(projection, '.x');
                const y = Operation.selection(projection, '.y');
                operations.push(
                    Operation.equal(
                        Operation.declare(projection),
                        Operation.add(
                            Operation.multiply(
                                Operation.divide(
                                    Operation.selection(vTextureProjection, '.xyz'),
                                    Operation.selection(vTextureProjection, '.w')
                                ), 0.5)
                            , 0.5)
                    )
                );
                operations.push(
                    Operation.if(
                        Operation.and(
                            Operation.greaterEquals(x, 0),
                            Operation.greaterEquals(y, 0),
                            Operation.lessEquals(x, 1),
                            Operation.lessEquals(y, 1)),
                        Operation.addTo(fragmentColor, Operation.read(Material.parameters.texture, Operation.selection(projection, '.xy')))))
            } else {
                operations.push(Operation.addTo(fragmentColor, Operation.read(Material.parameters.texture, vUV)))
            }
        }
        if (hasLight) {
            const lightColor = Parameter.vector3('lightColor');
            operations.push(Operation.equal(Operation.declare(lightColor), new Vector3()))
            const calculateLight = LightMaterial.shaderFunction.calculateLight();
            const calculateVisibility = LightMaterial.shaderFunction.calculateVisibility();
            const materialAmbient = Parameter.vector3('materialAmbient');
            operations.push(Operation.equal(
                Operation.declare(materialAmbient),
                this.ambientTexture ?
                    Operation.add(
                        Operation.selection(Operation.read(LightMaterial.parameters.ambientTexture, vUV), '.stp'),
                        LightMaterial.parameters.ambientColor)
                    : LightMaterial.parameters.ambientColor));
            const materialDiffuse = Parameter.vector3('materialDiffuse');
            operations.push(Operation.equal(
                Operation.declare(materialDiffuse),
                this.diffuseTexture ?
                    Operation.add(
                        Operation.selection(Operation.read(LightMaterial.parameters.diffuseTexture, vUV), '.stp'),
                        LightMaterial.parameters.diffuseColor)
                    : LightMaterial.parameters.diffuseColor));
            const materialEmissive = Parameter.vector3('materialEmissive');
            operations.push(Operation.equal(
                Operation.declare(materialEmissive),
                this.emissiveTexture ?
                    Operation.add(
                        Operation.selection(Operation.read(LightMaterial.parameters.emissiveTexture, vUV), '.stp'),
                        LightMaterial.parameters.emissiveColor)
                    : LightMaterial.parameters.emissiveColor));
            const materialSpecular = Parameter.vector3('materialSpecular');
            operations.push(Operation.equal(
                Operation.declare(materialSpecular),
                this.specularTexture ?
                    Operation.add(
                        Operation.selection(Operation.read(LightMaterial.parameters.specularTexture, vUV), '.stp'),
                        LightMaterial.parameters.specularColor)
                    : LightMaterial.parameters.specularColor));

            if (this.directionalLightsCount) {
                LightMaterial.parameters.directionalLightColor.length = this.directionalLightsCount;
                LightMaterial.parameters.directionalLightDirection.length = this.directionalLightsCount;
                LightMaterial.parameters.directionalLightAmbientStrength.length = this.directionalLightsCount;
                operations.push(
                    Operation.for('int i = 0', 'i < ' + this.directionalLightsCount, 'i++',
                        Operation.addTo(lightColor, Operation.do(calculateLight, [
                            Operation.selection(LightMaterial.parameters.directionalLightDirection, '[i]'),
                            Operation.selection(LightMaterial.parameters.directionalLightColor, '[i]'),
                            Operation.selection(LightMaterial.parameters.directionalLightAmbientStrength, '[i]'),
                            1,
                            materialAmbient,
                            materialDiffuse,
                            materialSpecular,
                            materialEmissive,
                            nCameraPosition,
                            normal
                        ]))
                    ));
            }
            if (this.directionalShadowLightsCount) {
                const vPositionFromDirectionalShadowLight = Parameter.vector4('v_positionFromDirectionalShadowLight', Parameter.qualifier.out);

                LightMaterial.parameters.directionalShadowLightShadowMatrix.length = this.directionalShadowLightsCount;
                vPositionFromDirectionalShadowLight.length = this.directionalShadowLightsCount
                this.vertexShader.operations.push(
                    Operation.for('int i = 0', 'i < ' + this.directionalShadowLightsCount, 'i++',
                        Operation.equal(
                            Operation.selection(vPositionFromDirectionalShadowLight, '[i]'),
                            Operation.multiply(Operation.selection(LightMaterial.parameters.directionalShadowLightShadowMatrix, '[i]'), position))
                    ));

                const visibility = Parameter.number('visibility');
                LightMaterial.parameters.directionalShadowLightShadowMap.length = this.directionalShadowLightsCount;
                LightMaterial.parameters.directionalShadowLightColor.length = this.directionalShadowLightsCount;
                LightMaterial.parameters.directionalShadowLightDirection.length = this.directionalShadowLightsCount;
                LightMaterial.parameters.directionalShadowLightAmbientStrength.length = this.directionalShadowLightsCount;
                operations.push(
                    Operation.for('int i = 0', 'i < ' + this.directionalShadowLightsCount, 'i++', [
                        Operation.equal(
                            Operation.declare(visibility),
                            Operation.do(calculateVisibility, [
                                Operation.selection(vPositionFromDirectionalShadowLight, '[i]'),
                                Operation.selection(LightMaterial.parameters.directionalShadowLightShadowMap, '[i]'),
                            ])),
                        Operation.addTo(lightColor, Operation.do(calculateLight, [
                            Operation.selection(LightMaterial.parameters.directionalShadowLightDirection, '[i]'),
                            Operation.selection(LightMaterial.parameters.directionalShadowLightColor, '[i]'),
                            Operation.selection(LightMaterial.parameters.directionalShadowLightAmbientStrength, '[i]'),
                            visibility,
                            materialAmbient,
                            materialDiffuse,
                            materialSpecular,
                            materialEmissive,
                            nCameraPosition,
                            normal
                        ]))
                    ]));
            }
            if (this.pointLightsCount) {
                LightMaterial.parameters.pointLightColor.length = this.pointLightsCount;
                LightMaterial.parameters.pointLightPosition.length = this.pointLightsCount;
                LightMaterial.parameters.pointLightAmbientStrength.length = this.pointLightsCount;
                LightMaterial.parameters.pointLightIntensity.length = this.pointLightsCount;
                const lightDirection = Parameter.vector3('lightDirection');
                const lightDistance = Parameter.vector3('lightDistance');
                const attenuation = Parameter.number('attenuation');
                const intensity = Operation.selection(LightMaterial.parameters.pointLightIntensity, '[i]');
                operations.push(
                    Operation.for('int i = 0', 'i < ' + this.pointLightsCount, 'i++', [
                        Operation.if(Operation.greater(intensity, 0), [
                            Operation.equal(
                                Operation.declare(lightDistance),
                                Operation.substract(Operation.selection(LightMaterial.parameters.pointLightPosition, '[i]'), vPosition)
                            ),
                            Operation.equal(
                                Operation.declare(lightDirection),
                                Operation.normalize(lightDistance)
                            ),
                            Operation.equal(
                                Operation.declare(attenuation),
                                Operation.clamp(Operation.divide(intensity, Operation.len(lightDistance)), 0, 1)
                            ),
                            Operation.if(Operation.notEquals(attenuation, 0),
                                Operation.addTo(lightColor, Operation.multiply(
                                    attenuation,
                                    Operation.do(calculateLight, [
                                        lightDirection,
                                        Operation.selection(LightMaterial.parameters.pointLightColor, '[i]'),
                                        Operation.selection(LightMaterial.parameters.pointLightAmbientStrength, '[i]'),
                                        1,
                                        materialAmbient,
                                        materialDiffuse,
                                        materialSpecular,
                                        materialEmissive,
                                        nCameraPosition,
                                        normal
                                    ]))
                                )
                            )
                        ])
                    ])
                );
            }
            if (this.pointShadowLightsCount) {
                LightMaterial.parameters.pointShadowLightShadowMatrix.length = this.pointShadowLightsCount;
                LightMaterial.parameters.pointShadowLightShadowMap.length = this.pointShadowLightsCount;
                LightMaterial.parameters.pointShadowLightColor.length = this.pointShadowLightsCount;
                LightMaterial.parameters.pointShadowLightPosition.length = this.pointShadowLightsCount;
                LightMaterial.parameters.pointShadowLightAmbientStrength.length = this.pointShadowLightsCount;
                LightMaterial.parameters.pointShadowLightIntensity.length = this.pointShadowLightsCount;
                const lightDirection = Parameter.vector3('lightDirection');
                const lightDistance = Parameter.vector3('lightDistance');
                const attenuation = Parameter.number('attenuation');
                const intensity = Operation.selection(LightMaterial.parameters.pointShadowLightIntensity, '[i]');
                const visibility = Parameter.number('visibility');

                const vPositionFromPointShadowLight = Parameter.vector4('v_positionFromPointShadowLight', Parameter.qualifier.out);
                vPositionFromPointShadowLight.length = this.pointShadowLightsCount
                this.vertexShader.operations.push(
                    Operation.for('int i = 0', 'i < ' + this.pointShadowLightsCount, 'i++',
                        Operation.equal(
                            Operation.selection(vPositionFromPointShadowLight, '[i]'),
                            Operation.multiply(Operation.selection(LightMaterial.parameters.pointShadowLightShadowMatrix, '[i]'), position))
                    ));

                operations.push(
                    Operation.for('int i = 0', 'i < ' + this.pointShadowLightsCount, 'i++', [
                        Operation.if(Operation.greater(intensity, 0), [
                            Operation.equal(
                                Operation.declare(lightDistance),
                                Operation.substract(Operation.selection(LightMaterial.parameters.pointShadowLightPosition, '[i]'), vPosition)
                            ),
                            Operation.equal(
                                Operation.declare(lightDirection),
                                Operation.normalize(lightDistance)
                            ),
                            Operation.equal(
                                Operation.declare(attenuation),
                                Operation.clamp(Operation.divide(intensity, Operation.len(lightDistance)), 0, 1)
                            ),
                            Operation.if(Operation.notEquals(attenuation, 0), [
                                Operation.equal(
                                    Operation.declare(visibility),
                                    Operation.do(calculateVisibility, [
                                        Operation.selection(vPositionFromPointShadowLight, '[i]'),
                                        Operation.selection(LightMaterial.parameters.pointShadowLightShadowMap, '[i]'),
                                    ])
                                ),
                                Operation.addTo(lightColor, Operation.multiply(
                                    attenuation,
                                    Operation.do(calculateLight, [
                                        lightDirection,
                                        Operation.selection(LightMaterial.parameters.pointShadowLightColor, '[i]'),
                                        Operation.selection(LightMaterial.parameters.pointShadowLightAmbientStrength, '[i]'),
                                        visibility,
                                        materialAmbient,
                                        materialDiffuse,
                                        materialSpecular,
                                        materialEmissive,
                                        nCameraPosition,
                                        normal
                                    ]))
                                )
                            ])
                        ])
                    ])
                );
            }
            if (this.spotLightsCount) {
                LightMaterial.parameters.spotLightColor.length = this.spotLightsCount;
                LightMaterial.parameters.spotLightPosition.length = this.spotLightsCount;
                LightMaterial.parameters.spotLightDirection.length = this.spotLightsCount;
                LightMaterial.parameters.spotLightRadius.length = this.spotLightsCount;
                LightMaterial.parameters.spotLightInnerRadius.length = this.spotLightsCount;
                LightMaterial.parameters.spotLightAmbientStrength.length = this.spotLightsCount;
                LightMaterial.parameters.spotLightIntensity.length = this.spotLightsCount;
                const r = Parameter.number('r');
                const lightDistance = Parameter.vector3('lightDistance');
                const theta = Parameter.number('theta');
                const smoothing = Parameter.number('smoothing');
                const attenuation = Parameter.number('attenuation');
                const intensity = Operation.selection(LightMaterial.parameters.spotLightIntensity, '[i]');
                operations.push(
                    Operation.for('int i = 0', 'i < ' + this.spotLightsCount, 'i++', [
                        Operation.if(Operation.greater(intensity, 0), [
                            Operation.equal(
                                Operation.declare(lightDistance),
                                Operation.substract(Operation.selection(LightMaterial.parameters.spotLightPosition, '[i]'), vPosition)
                            ),
                            Operation.equal(
                                Operation.declare(theta),
                                Operation.substract(
                                    Operation.dot(Operation.normalize(lightDistance), Operation.selection(LightMaterial.parameters.spotLightDirection, '[i]')),
                                    Operation.selection(LightMaterial.parameters.spotLightRadius, '[i]')),
                            ),
                            Operation.equal(Operation.declare(r), Operation.substract(
                                Operation.selection(LightMaterial.parameters.spotLightInnerRadius, '[i]'),
                                Operation.selection(LightMaterial.parameters.spotLightRadius, '[i]')),
                            ),
                            Operation.equal(
                                Operation.declare(smoothing),
                                Operation.clamp(Operation.divide(theta, r), 0, 1)
                            ),
                            Operation.equal(
                                Operation.declare(attenuation),
                                Operation.multiply(
                                    smoothing,
                                    Operation.clamp(Operation.divide(intensity, Operation.len(lightDistance)), 0, 1)
                                )
                            ),
                            Operation.if(Operation.notEquals(attenuation, 0),
                                Operation.addTo(lightColor, Operation.multiply(
                                    attenuation,
                                    Operation.do(calculateLight, [
                                        Operation.selection(LightMaterial.parameters.spotLightDirection, '[i]'),
                                        Operation.selection(LightMaterial.parameters.spotLightColor, '[i]'),
                                        Operation.selection(LightMaterial.parameters.spotLightAmbientStrength, '[i]'),
                                        1,
                                        materialAmbient,
                                        materialDiffuse,
                                        materialSpecular,
                                        materialEmissive,
                                        nCameraPosition,
                                        normal
                                    ]))
                                )
                            )
                        ])
                    ])
                );
            }
            if (this.spotShadowLightsCount) {
                const vPositionFromSpotShadowLight = Parameter.vector4('v_positionFromSpotShadowLight', Parameter.qualifier.out);
                LightMaterial.parameters.spotShadowLightShadowMatrix.length = this.spotShadowLightsCount;
                vPositionFromSpotShadowLight.length = this.spotShadowLightsCount
                this.vertexShader.operations.push(
                    Operation.for('int i = 0', 'i < ' + this.spotShadowLightsCount, 'i++',
                        Operation.equal(
                            Operation.selection(vPositionFromSpotShadowLight, '[i]'),
                            Operation.multiply(Operation.selection(LightMaterial.parameters.spotShadowLightShadowMatrix, '[i]'), position))
                    ));

                const visibility = Parameter.number('visibility');
                LightMaterial.parameters.spotShadowLightShadowMap.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightColor.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightPosition.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightDirection.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightRadius.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightInnerRadius.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightAmbientStrength.length = this.spotShadowLightsCount;
                LightMaterial.parameters.spotShadowLightIntensity.length = this.spotShadowLightsCount;
                const r = Parameter.number('r');
                const lightDistance = Parameter.vector3('lightDistance');
                const theta = Parameter.number('theta');
                const smoothing = Parameter.number('smoothing');
                const attenuation = Parameter.number('attenuation');
                const intensity = Operation.selection(LightMaterial.parameters.spotShadowLightIntensity, '[i]');
                operations.push(
                    Operation.for('int i = 0', 'i < ' + this.spotShadowLightsCount, 'i++', [
                        Operation.if(Operation.greater(intensity, 0), [

                            Operation.equal(
                                Operation.declare(visibility),
                                Operation.do(calculateVisibility, [
                                    Operation.selection(vPositionFromSpotShadowLight, '[i]'),
                                    Operation.selection(LightMaterial.parameters.spotShadowLightShadowMap, '[i]'),])
                            ),
                            Operation.equal(
                                Operation.declare(lightDistance),
                                Operation.substract(Operation.selection(LightMaterial.parameters.spotShadowLightPosition, '[i]'), vPosition)
                            ),
                            Operation.equal(
                                Operation.declare(theta),
                                Operation.substract(
                                    Operation.dot(Operation.normalize(lightDistance), Operation.selection(LightMaterial.parameters.spotShadowLightDirection, '[i]')),
                                    Operation.selection(LightMaterial.parameters.spotShadowLightRadius, '[i]')),
                            ),
                            Operation.equal(Operation.declare(r), Operation.substract(
                                Operation.selection(LightMaterial.parameters.spotShadowLightInnerRadius, '[i]'),
                                Operation.selection(LightMaterial.parameters.spotShadowLightRadius, '[i]')),
                            ),
                            Operation.equal(
                                Operation.declare(smoothing),
                                Operation.clamp(Operation.divide(theta, r), 0, 1)
                            ),
                            Operation.equal(
                                Operation.declare(attenuation),
                                Operation.multiply(
                                    smoothing,
                                    Operation.clamp(Operation.divide(intensity, Operation.len(lightDistance)), 0, 1)
                                )
                            ),
                            Operation.if(Operation.notEquals(attenuation, 0),
                                Operation.addTo(lightColor, Operation.multiply(
                                    attenuation,
                                    Operation.do(calculateLight, [
                                        Operation.selection(LightMaterial.parameters.spotShadowLightDirection, '[i]'),
                                        Operation.selection(LightMaterial.parameters.spotShadowLightColor, '[i]'),
                                        Operation.selection(LightMaterial.parameters.spotShadowLightAmbientStrength, '[i]'),
                                        visibility,
                                        materialAmbient,
                                        materialDiffuse,
                                        materialSpecular,
                                        materialEmissive,
                                        nCameraPosition,
                                        normal
                                    ]))
                                )
                            )
                        ])
                    ])
                );
            }

            operations.push(Operation.multiplyTo(fragmentColor, Operation.toVector4(lightColor, 1)));
        }
        if (this.fog) {
            const distance = Parameter.number('distance');
            const fogDistance = Material.parameters.fogDistance;
            const fogDistanceY = Operation.selection(fogDistance, '.y');
            operations.push(Operation.equal(
                Operation.declare(distance),
                Operation.substract(fogDistanceY, vDistance)
            ));
            operations.push(Operation.equal(
                fragmentRGB,
                Operation.mix(
                    Material.parameters.backgroundColor,
                    fragmentRGB,
                    Operation.clamp(
                        Operation.substract(
                            Operation.divide(distance, fogDistanceY),
                            Operation.selection(fogDistance, '.x'))
                        , 0, 1))
            ));
        }
        operations.push(Operation.equal(Shader.parameters.output, fragmentColor));
        operations.push(Material.operation.gammaCorrection);
        this.fragmentShader = Shader.fragmentShader(operations);
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

    static shaderFunction = {
        calculateVisibility: () => {
            const positionFromLight = Parameter.vector4('positionFromLight');
            const shadowMap = Parameter.texture('shadowMap');

            const projection = Parameter.vector3('projection');
            const x = Operation.selection(projection, '.x');
            const y = Operation.selection(projection, '.y');
            const depth = Parameter.vector4('depth');
            return new ShaderFunction('calculateVisibility', Number, [
                positionFromLight,
                shadowMap], [
                Operation.equal(
                    Operation.declare(projection),
                    Operation.add(
                        Operation.multiply(
                            Operation.divide(
                                Operation.selection(positionFromLight, '.xyz'),
                                Operation.selection(positionFromLight, '.w')),
                            0.5),
                        0.5)
                ),
                Operation.equal(
                    Operation.declare(depth),
                    Operation.read(shadowMap, Operation.selection(projection, '.xy'))
                ),
                Operation.if(
                    Operation.and(
                        Operation.greaterEquals(x, 0),
                        Operation.greaterEquals(y, 0),
                        Operation.lessEquals(x, 1),
                        Operation.lessEquals(y, 1),
                        Operation.isEqual(Operation.selection(depth, '.w'), 1),
                        Operation.greater(
                            Operation.selection(projection, '.z'),
                            Operation.add(Operation.selection(depth, '.z'), 0.005),
                        )),
                    Operation.return(0)
                ),
                Operation.return(1),
            ]);
        },
        calculateLight: () => {
            const lightDirection = Parameter.vector3('lightDirection');
            const lightColor = Parameter.vector3('lightColor');
            const ambientStrength = Parameter.number('ambientStrength');
            const visibility = Parameter.number('visibility');
            const materialAmbient = Parameter.vector3('materialAmbient');
            const materialDiffuse = Parameter.vector3('materialDiffuse');
            const materialSpecular = Parameter.vector3('materialSpecular');
            const materialEmissive = Parameter.vector3('materialEmissive');
            const cameraPosition = Parameter.vector3('cameraPosition');
            const normal = Parameter.vector3('normal');

            const ambient = Parameter.vector3('ambient');
            const diffuse = Parameter.vector3('diffuse');
            const specular = Parameter.vector3('specular');
            const emissive = Parameter.vector3('emissive');
            const nDotL = Parameter.number('nDotL');
            const spec = Parameter.number('spec');

            return new ShaderFunction('calculateLight', Vector3, [
                lightDirection,
                lightColor,
                ambientStrength,
                visibility,
                materialAmbient,
                materialDiffuse,
                materialSpecular,
                materialEmissive,
                cameraPosition,
                normal], [
                Operation.if(
                    Operation.notEquals(lightColor, new Vector3()),
                    [
                        Operation.equal(
                            Operation.declare(ambient),
                            Operation.multiply(materialAmbient, lightColor, ambientStrength)
                        ),
                        Operation.equal(
                            Operation.declare(nDotL),
                            Operation.max(
                                Operation.dot(lightDirection, normal),
                                0
                            )
                        ),
                        Operation.if(Operation.isEqual(nDotL, 0), Operation.return(ambient)),
                        Operation.equal(
                            Operation.declare(diffuse),
                            Operation.multiply(materialDiffuse, lightColor, visibility, nDotL)
                        ),
                        Operation.equal(
                            Operation.declare(spec),//blinn-phong
                            Operation.pow(Operation.max(Operation.dot(normal, Operation.normalize(Operation.add(lightDirection, cameraPosition))), 0), LightMaterial.parameters.shininess)
                        ),
                        // Operation.equal(
                        //     Operation.declare(spec),//phong
                        //     Operation.pow(Operation.max(Operation.dot(cameraPosition, Operation.substract(Operation.multiply(2, Operation.dot(normal, lightDirection), normal), lightDirection)), 0), PhongMaterial.parameters.shininess)
                        // ),
                        Operation.equal(
                            Operation.declare(specular),
                            Operation.multiply(visibility, spec, lightColor, materialSpecular)
                        ),
                        Operation.equal(
                            Operation.declare(emissive),
                            Operation.multiply(lightColor, materialEmissive)
                        ),
                        Operation.return(Operation.add(ambient, diffuse, specular, emissive))
                    ]
                ),
                Operation.return(new Vector3())
            ]);
        },
    };

    static shadowMaterial = new Material();
}

LightMaterial.shadowMaterial.culling = Material.culling.front;
LightMaterial.shadowMaterial.setParameter(Material
    .parameters.projectionMatrix);
LightMaterial.shadowMaterial.vertexShader = Shader.vertexShader([
    Operation.equal(
        Shader.parameters.output,
        Operation.multiply(
            Material.parameters.projectionMatrix,
            Material.parameters.vertexMatrix,
            Material.parameters.position))
]);
LightMaterial.shadowMaterial.fragmentShader = Shader.fragmentShader([
    Operation.equal(
        Shader.parameters.output,
        Operation.toVector4(0, 0, Operation.selection(Shader.parameters.fragmentCoordinate, '.z'), 1))
]);