import Color from '../../core/Color';
import Angle from '../../math/Angle';
import Light from '../../renderer/graphics/Light';
import Texture from '../../renderer/graphics/Texture';
import PerspectiveCamera from '../camera/PerspectiveCamera';
import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';

export default class SpotLight extends Node3d {
    constructor(color, radius, position, target) {
        super();
        this.light = new Light(color);
        this.translate(position);
        this.radius = radius;
        this.innerRadius = radius;
        this.target = target;
    }

    get shadow() {
        return this._shadow;
    }

    set shadow(v) {
        if (v != this.shadow) {
            if (v) {
                if (!v.data) {
                    v.data = new PerspectiveCamera(Angle.toDegree(this.radius * 2), 1, 0.5, 500);
                    v.data.filters.push('castShadow');
                }
                if (v.data.parent != this) {
                    this.appendChild(v.data);
                }
                if (!v.material) {
                    v.material = LightMaterial.shadowMaterial;
                }
                if (!v.colorTexture) {
                    v.colorTexture = new Texture();
                    v.colorTexture.minification = Texture.filter.linear;
                }
                v.backgroundColor = Color.transparent();
                this._shadow = v;
                this.light.parameters = {};
            } else if (this.shadow) {
                if (this.shadow.data.parent == this) {
                    this.removeChild(this.shadow.data);
                }
                this._shadow = null;
                this.light.parameters = {};
            }
        }
    }

    get shadowCamera() {
        return this.shadow?.data;
    }

    get shadowMap() {
        return this.shadow?.colorTexture;
    }

    setScene(parameters) {
        super.setScene(parameters);
        if (this.shadow) {
            this.light.setParameter(LightMaterial.parameters.spotShadowLightShadowMatrix, this.shadow.data.projectionMatrix);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightShadowMap, this.shadow.colorTexture);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightColor, this.light.color.rgb);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightPosition, this.position);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightDirection, this.zAxis);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightInnerRadius, this.innerRadius);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightRadius, this.radius);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightAmbientStrength, this.light.ambientStrength);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightIntensity, this.light.intensity);
        } else {
            this.light.setParameter(LightMaterial.parameters.spotLightColor, this.light.color.rgb);
            this.light.setParameter(LightMaterial.parameters.spotLightPosition, this.position);
            this.light.setParameter(LightMaterial.parameters.spotLightDirection, this.zAxis);
            this.light.setParameter(LightMaterial.parameters.spotLightInnerRadius, this.innerRadius);
            this.light.setParameter(LightMaterial.parameters.spotLightRadius, this.radius);
            this.light.setParameter(LightMaterial.parameters.spotLightAmbientStrength, this.light.ambientStrength);
            this.light.setParameter(LightMaterial.parameters.spotLightIntensity, this.light.intensity);
        }
        this.light.setScene(parameters);
        return this;
    }
}