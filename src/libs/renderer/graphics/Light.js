import FloatArray from '../../math/FloatArray';
import GraphicsNode from './GraphicsNode';

export default class Light extends GraphicsNode {
    constructor(color) {
        super();
        this.color = color;
        this.ambientStrength = 0.3;
        this.intensity = 1;
    }

    get on() {
        return this.intensity > 0;
    }

    toggle() {
        const cache = this._intensity || 0;
        this._intensity = this.intensity;
        this.intensity = cache;
    }

    setScene(parameters) {
        for (const name in this.parameters) {
            let parameter = this.getParameter(name);
            if (parameter instanceof FloatArray) {
                if (!parameters[name]) {
                    parameters[name] = new FloatArray(parameter);
                } else {
                    parameters[name] = parameters[name].concat(parameter);
                }
            } else if (Number.isFinite(parameter)) {
                if (!parameters[name]) {
                    parameters[name] = new FloatArray([parameter]);
                } else {
                    parameters[name] = parameters[name].concat(parameter);
                }
            } else {
                if (!parameters[name]) {
                    parameters[name] = [parameter];
                } else {
                    parameters[name].push(parameter);
                }
            }
        }

        return this;
    }
}