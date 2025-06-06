import Vector3 from './Vector3';

export default class Sphere {
    /** Create a new Sphere
     * @param {Vector3} center of Sphere
     * @param {Number} radius of Sphere
    */
    constructor(center = new Vector3(0, 0, 0), radius = 0) {
        this.radius = radius;
        this.center = center;
    }

    get isEmpty() {
        return this.radius < 0;
    }

    distanceToPoint(point) {
		return ( point.distance( this.center ) - this.radius );
    }

    empty() {
        this.center.empty();
        this.radius = - 1;

        return this;
    }

    clone() {
        return new Sphere(this.center, this.radius);
    }

    fromBox(box){
        this.center = box.center;
        this.radius = box.size.len * 0.5
        
        return this;
    }
}