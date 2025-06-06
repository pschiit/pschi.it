import Color from '../../core/Color';
import Light from '../../renderer/graphics/Light';
import Texture from '../../renderer/graphics/Texture';
import OrthographicCamera from '../camera/OrthographicCamera';
import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';

export default class PointLight extends Node3d {
    constructor(color, position) {
        super();
        this.light = new Light(color);
        this.translate(position);
    }
    
    get shadow() {
        return this._shadow;
    }

    set shadow(v) {
        if (v != this.shadow) {
            if (v) {
                if (!v.data) {
                    v.data = new OrthographicCamera(-10, 10, -10, 10, 0, 100);
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
        if(this.shadow){
            this.light.setParameter(LightMaterial.parameters.pointShadowLightShadowMatrix, this.shadow.data.projectionMatrix);
            this.light.setParameter(LightMaterial.parameters.pointShadowLightShadowMap, this.shadow.colorTexture);
            this.light.setParameter(LightMaterial.parameters.pointShadowLightColor,this.light.color.rgb);
            this.light.setParameter(LightMaterial.parameters.pointShadowLightPosition,this.position);
            this.light.setParameter(LightMaterial.parameters.pointShadowLightAmbientStrength,this.light.ambientStrength);
            this.light.setParameter(LightMaterial.parameters.pointShadowLightIntensity,this.light.intensity);
        }else{
            this.light.setParameter(LightMaterial.parameters.pointLightColor,this.light.color.rgb);
            this.light.setParameter(LightMaterial.parameters.pointLightPosition,this.position);
            this.light.setParameter(LightMaterial.parameters.pointLightAmbientStrength,this.light.ambientStrength);
            this.light.setParameter(LightMaterial.parameters.pointLightIntensity,this.light.intensity);
        }
        this.light.setScene(parameters);

        return this;
    }
}