import Vector3 from './Vector3';

export default class Triangle {
    /** Create a new Triangle
     * @param {Vector3} a point
     * @param {Vector3} b point
     * @param {Vector3} c point
    */
    constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    set(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    isFacing(direction) {
        return this.c.clone().substract(this.b).cross(this.a.clone().substract(this.b)).dot(direction) < 0 ? true : false;
    }

    get normal() {
        return this.c.clone().substract(this.b).cross(this.a.clone().substract(this.b)).normalize();
    }
}