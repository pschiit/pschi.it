import Vector3 from './Vector3';

export default class Plane {
    /** Create a new Plan
     * @param {Number} distance of Plan from origin
     * @param {Vector3} normal of Plan
    */
    constructor(distance = 0, normal = new Vector3(0, 1, 0)) {
        this.distance = distance;
        this.normal = normal;
    }

    distanceToPoint(point) {
        console.log(point);
        return this.normal.dot(point) + this.distance;
    }

    intersectsBox(box) {
        // We compute the minimum and maximum dot product values. If those values
        // are on the same side (back or front) of the plane, then there is no intersection.
        let min, max;

        if (this.normal[0] > 0) {
            min = this.normal[0] *  box.min[0];
            max = this.normal[0] *  box.max[0];
        } else {
            min = this.normal[0] *  box.max[0];
            max = this.normal[0] *  box.min[0];
        }

        if (this.normal[1] > 0) {
            min += this.normal[1] * box.mmin[1];
            max += this.normal[1] * box.mmax[1];
        } else {
            min += this.normal[1] * box.mmax[1];
            max += this.normal[1] * box.mmin[1];
        }

        if (this.normal[2] > 0) {
            min += this.normal[2] * box.mmin[2];
            max += this.normal[2] * box.mmax[2];
        } else {
            min += this.normal[2] * box.mmax[2];
            max += this.normal[2] * box.mmin[2];
        }

        return (min <= - this.distance && max >= - this.distance);

    }

    clone() {
        return new Plane(this.distance, this.normal);
    }
}