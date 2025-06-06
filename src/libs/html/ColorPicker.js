import Uint8Vector3 from '../math/Uint8Vector3';
import Div from './Div';
import Input from './Input';
import Label from './Label';

export default class ColorPicker extends Div {
    /** Create a new ColorPicker
    */
    constructor(name) {
        super();
        const color = new Uint8Vector3(0, 0, 0);
        this._color = color;

        this.input = new Input('color');
        this.input.element.addEventListener('input', (e) => {
            color.hex = parseInt(e.target.value.substring(1), 16);
        });
        const label = new Label(this.input, name);
        this.appendChild(label, this.input);
    }

    get color() {
        return this._color;
    }

    set color(v) {
        if (v) {
            this.color.set(v);
            this.input.element.value = '#' + this.color.hex.toString(16);
        }
    }
}