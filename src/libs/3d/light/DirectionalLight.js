import Color from '../../core/Color';
import Light from '../../renderer/graphics/Light';
import Texture from '../../renderer/graphics/Texture';
import OrthographicCamera from '../camera/OrthographicCamera';
import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';

export default class DirectionalLight extends Node3d {
    constructor(color, position, target) {
        super();
        this.light = new Light(color);
        if (position) {
            this.translate(position);
        }
        if (target) {
            this.target = target;
        }
    }

    get shadow() {
        return this._shadow;
    }

    set shadow(v) {
        if (v != this.shadow) {
            if (v) {
                if (!v.data) {
                    v.data = new OrthographicCamera(-10, 10, -10, 10, 0, 100);
                }
                if (!v.data.filters.some(i => i == shadowFilter)) {
                    v.data.filters.push(shadowFilter);
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
                    v.colorTexture.wrapS = Texture.wrapping.clamp;
                    v.colorTexture.wrapT = Texture.wrapping.clamp;
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
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightShadowMatrix, this.shadow.data.projectionMatrix);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightShadowMap, this.shadow.colorTexture);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightColor, this.light.color.rgb.scale(this.light.intensity));
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightDirection, this.zAxis);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightAmbientStrength, this.light.ambientStrength);
        } else {
            this.light.setParameter(LightMaterial.parameters.directionalLightColor, this.light.color.rgb.scale(this.light.intensity));
            this.light.setParameter(LightMaterial.parameters.directionalLightDirection, this.zAxis);
            this.light.setParameter(LightMaterial.parameters.directionalLightAmbientStrength, this.light.ambientStrength);
        }
        this.light.setScene(parameters);

        return this;
    }
}
const shadowFilter = 'castShadow';