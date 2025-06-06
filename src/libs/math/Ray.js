import Vector3 from './Vector3';

export default class Ray {
    /** Create a new Ray
     * @param {Vector3} origin of Ray
     * @param {Vector3} direction of Ray
    */
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    move(distance) {
        this.origin = this.at(distance);
        return this;
    }

    at(distance) {
        return this.direction.clone().scale(distance).add(this.origin);
    }

    target(vector3) {
        this.direction.set(vector3).substract(this.origin).normalize();
        return this;
    }

    distanceToPoint(point) {
        return Math.sqrt(this.distanceSqrtToPoint(point));
    }

    distanceSqrtToPoint(point) {
        const directionDistance = point.clone().substract(this.origin).dot(this.direction);
        // point behind the ray
        if (directionDistance < 0) {
            return this.origin.distanceSqrt(point);
        }

        return this.direction.clone().scale(directionDistance).add(this.origin).distanceSqrt(point);
    }

    distanceToPlane(plane) {
        const denominator = plane.normal.clone().dot(this.direction);
        if (denominator === 0) {
            if (plane.distanceToPoint(this.origin) === 0) {
                return 0;
            }
            return null;

        }
        const distance = - (this.origin.dot(plane.normal) + plane.distance) / denominator;
        return distance >= 0 ? distance : null;
    }

    intersectSphere(sphere) {
        const vector3 = sphere.center.clone().substract(this.origin)
        const tca = vector3.dot(this.direction);
        const d2 = vector3.dot(vector3) - tca * tca;
        const radius2 = sphere.radius * sphere.radius;

        if (d2 > radius2) return null;

        const thc = Math.sqrt(radius2 - d2);

        // t0 = first intersect point - entrance on front of sphere
        const t0 = tca - thc;

        // t1 = second intersect point - exit point on back of sphere
        const t1 = tca + thc;

        // test to see if both t0 and t1 are behind the ray - if so, return null
        if (t0 < 0 && t1 < 0) return null;

        // test to see if t0 is behind the ray:
        // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
        // in order to always return an intersect point that is in front of the ray.
        if (t0 < 0) return this.at(t1);

        // else t0 is in front of the ray, so return the first collision point scaled by t0
        return this.at(t0);

    }

    intersectPlane(plane) {
        const distance = this.distanceToPlane(plane);
        return distance ? this.at(distance) : null;
    }

    intersectBox(box) {
        let tmin, tmax, tymin, tymax, tzmin, tzmax;

        const invdirx = 1 / this.direction[0],
            invdiry = 1 / this.direction[1],
            invdirz = 1 / this.direction[2];

        if (invdirx >= 0) {
            tmin = (box.min[0] - this.origin[0]) * invdirx;
            tmax = (box.max[0] - this.origin[0]) * invdirx;

        } else {
            tmin = (box.max[0] - this.origin[0]) * invdirx;
            tmax = (box.min[0] - this.origin[0]) * invdirx;

        }

        if (invdiry >= 0) {
            tymin = (box.min[1] - this.origin[1]) * invdiry;
            tymax = (box.max[1] - this.origin[1]) * invdiry;

        } else {
            tymin = (box.max[1] - this.origin[1]) * invdiry;
            tymax = (box.min[1] - this.origin[1]) * invdiry;

        }

        if ((tmin > tymax) || (tymin > tmax)) return null;

        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN

        if (tymin > tmin || tmin !== tmin) tmin = tymin;

        if (tymax < tmax || tmax !== tmax) tmax = tymax;

        if (invdirz >= 0) {
            tzmin = (box.min[2] - this.origin[2]) * invdirz;
            tzmax = (box.max[2] - this.origin[2]) * invdirz;
        } else {
            tzmin = (box.max[2] - this.origin[2]) * invdirz;
            tzmax = (box.min[2] - this.origin[2]) * invdirz;
        }

        console.log(tmin, tmax, tymin, tymax, tzmin, tzmax);
        if ((tmin > tzmax) || (tzmin > tmax)) return null;

        if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

        if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

        //return point closest to the ray (positive side)

        if (tmax < 0) return null;

        return this.at(tmin >= 0 ? tmin : tmax);

    }

    transformMatrix4(matrix4) {
        this.origin.transformMatrix4(matrix4);
        this.direction.transformMatrix4(matrix4).normalize();

        return this;
    }

    clone(origin) {
        return new Ray(origin || this.origin, this.direction);
    }

    set(ray) {
        this.origin.set(ray.origin);
        this.direction.set(ray.direction);
    }
}