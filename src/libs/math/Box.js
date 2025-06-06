import Vector3 from './Vector3';

export default class Box {
    /** Create a new AABB Box
     * @param {Vector3} min of Plan from origin
     * @param {Vector3} max of Plan
    */
    constructor(min = new Vector3(+Infinity, +Infinity, +Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }

    get isEmpty() {
        return (this.max[0] < this.min[0]) || (this.max[1] < this.min[1]) || (this.max[2] < this.min[2]);
    }

    get center() {
        return this.isEmpty ? new Vector3(0, 0, 0) : this.min.clone().add(this.max).scale(0.5);
    }

    get size() {
        return this.isEmpty ? new Vector3(0, 0, 0) : this.max.clone().substract(this.min);
    }

    set(box) {
        this.min.set(box.min);
        this.max.set(box.max);

        return this;
    }

    translate(vector3) {
        this.min.add(vector3);
        this.max.add(vector3);

        return this;
    }

    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);

        return this;
    }

    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);

        if (this.isEmpty) {
            this.empty();
        }

        return this;
    }

    expandByPoint(vector3) {
        this.min.min(vector3);
        this.max.max(vector3);

        return this;
    }

    expandByVector(vector3) {
        this.min.substract(vector3);
        this.max.add(vector3);

        return this;
    }

    expandByScalar(scalar) {
        this.min.scale(-scalar);
        this.max.scale(scalar);

        return this;
    }

    setFromCenterAndSize(center, size) {
        const half = size.clone().scale(0.5);

        this.min = center.clone().substract(half);
        this.max = center.clone().add(half);

        return this;
    }

    distanceToPoint(point) {
        return point.clone().clamp(this.min, this.max).distance(point);
    }

    containsPoint(vector3) {
        return vector3[0] < this.min[0] || vector3[0] > this.max[0] ||
            vector3[1] < this.min[1] || vector3[1] > this.max[1] ||
            vector3[2] < this.min[2] || vector3[2] > this.max[2] ? false : true;

    }

    containsBox(box) {
        return this.min[0] <= box.min[0] && box.max[0] <= this.max[0] &&
            this.min[1] <= box.min[1] && box.max[1] <= this.max[1] &&
            this.min[2] <= box.min[2] && box.max[2] <= this.max[2];

    }

    intersectsBox(box) {
        // using 6 splitting planes to rule out intersections.
        return box.max[0] < this.min[0] || box.min[0] > this.max[0] ||
            box.max[1] < this.min[1] || box.min[1] > this.max[1] ||
            box.max[2] < this.min[2] || box.min[2] > this.max[2] ? false : true;

    }

    normalFrom(point) {
        const localPoint = point.clone().substract(this.center);
        const size = this.size;
        let normal = null;
        let min = Infinity;
        let distance = Math.abs(size[0] - Math.abs(localPoint[0]));
        if (distance < min) {
            min = distance;
            if (Math.sign(localPoint[0]) < 0) {
                normal = new Vector3(-1, 0, 0);
            } else {
                normal = new Vector3(1, 0, 0);
            }
        }
        distance = Math.abs(size[1] - Math.abs(localPoint[1]));
        if (distance < min) {
            min = distance;
            if (Math.sign(localPoint[1]) < 0) {
                normal = new Vector3(0, -1, 0);
            } else {
                normal = new Vector3(0, 1, 0);
            }
        }
        distance = Math.abs(size[2] - Math.abs(localPoint[2]));
        if (distance < min) {
            min = distance;
            if (Math.sign(localPoint[2]) < 0) {
                normal = new Vector3(0, 0, -1);
            } else {
                normal = new Vector3(0, 0, 1);
            }
        }
        return normal;
    }

    empty() {
        this.min[0] = this.min[1] = this.min[2] = + Infinity;
        this.max[0] = this.max[1] = this.max[2] = - Infinity;

        return this;
    }

    clone() {
        return new Box(this.min.clone(), this.max.clone());
    }

    equals(box) {
        return box.min.equals(this.min)
            && box.max.equals(this.max);
    }
}
const a = new Vector3();
const b = new Vector3();