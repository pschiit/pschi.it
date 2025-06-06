import FloatArray from './FloatArray';
import Matrix3 from './Matrix3';
import Matrix4 from './Matrix4';
import Vector2 from './Vector2';
import Vector4 from './Vector4';

export default class Vector3 extends FloatArray {
    static xAxis = new Vector3(1, 0, 0);
    static yAxis = new Vector3(0, 1, 0);
    static zAxis = new Vector3(0, 0, 1);

    /** Create a new Vector3 from the coordinates xyz or a vector array
     * @param {Number|Number[]} x first coordinate or vector array
     * @param {Number} y second coordinate
     * @param {Number} z third coordinate
    */
    constructor(x, y, z) {
        super(3);
        if (typeof x !== 'undefined') {
            if (x.length >= 0) {
                this[0] = x[0];
                this[1] = x[1];
                this[2] = x[2];
            } else {
                this[0] = x;
                if (y) {
                    this[1] = y;
                }
                if (z) {
                    this[2] = z;
                }
            }
        }
    }

    get lenSqrt() {
        return this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
    }

    get len() {
        return Math.sqrt(this.lenSqrt);
    }

    /** Return whether or not a Vector3 array is equals the current Vector3
     * @param {Vector3} vector the vector to compare
     * @return {Boolean} true if vectors are equals
    */
    equals(vector) {
        return vector?.length == this.length &&
            this[0] === vector[0] &&
            this[1] === vector[1] &&
            this[2] === vector[2];
    }

    /** Set a vector array to the current Vector3
     * @param {Vector3} vector 
     * @return the current updated Vector3
    */
    set(vector) {
        this[0] = vector[0];
        this[1] = vector[1];
        this[2] = vector[2];

        return this;
    }

    /** Add a vector array to the current Vector3
     * @param {Vector3} vector right operand
     * @return the current updated Vector3
    */
    add(vector) {
        this[0] += vector[0];
        this[1] += vector[1];
        this[2] += vector[2];

        return this;
    }


    /** Substract a vector array to the current Vector3
     * @param {Vector3} vector right operand
     * @return the current updated Vector3
    */
    substract(vector) {
        this[0] -= vector[0];
        this[1] -= vector[1];
        this[2] -= vector[2];

        return this;
    }

    /** Multiply a vector array to the current Vector3
     * @param {Vector3} vector right operand
     * @return the current updated Vector3
    */
    multiply(vector) {
        this[0] *= vector[0];
        this[1] *= vector[1];
        this[2] *= vector[2];

        return this;
    }

    /** Divide a vector array to the current Vector3
     * @param {Vector3} vector right operand
     * @return the current updated Vector3
    */
    divide(vector) {
        this[0] /= vector[0];
        this[1] /= vector[1];
        this[2] /= vector[2];

        return this;
    }

    /** Add a scalar the current Vector3
     * @param {Number} value scale
     * @return the current updated Vector3
    */
    addScalar(value) {
        this[0] = this[0] + value;
        this[1] = this[1] + value;
        this[2] = this[2] + value;

        return this;
    }

    /** Scale the current Vector3
     * @param {Number} value scale
     * @return the current updated Vector3
    */
    scale(value) {
        this[0] = this[0] * value;
        this[1] = this[1] * value;
        this[2] = this[2] * value;

        return this;
    }

    /** Normalize the current Vector3
     * @return the current updated Vector3
    */
    normalize() {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        let dot = x * x + y * y + z * z;

        if (dot > 0) {
            dot = 1 / Math.sqrt(dot);
        }

        this[0] = x * dot;
        this[1] = y * dot;
        this[2] = z * dot;

        return this;
    }

    /** Negate the current Vector3
     * @return the current updated Vector3
    */
    negate() {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        return this;
    }

    /**
     * Calculates the euclidian distance between two Vector3
     * @param {Vector3} vector the second operand
     * @returns {Number} distance
     */
    distance(vector) {
        const x = vector[0] - this[0];
        const y = vector[1] - this[1];
        const z = vector[2] - this[2];

        return Math.hypot(x, y, z);
    }

    /**
     * Calculates the squared euclidian distance between two Vector3
     * @param {Vector3} vector the second operand
     * @returns {Number} squared distance
     */
    distanceSqrt(vector) {
        const x = vector[0] - this[0];
        const y = vector[1] - this[1];
        const z = vector[2] - this[2];

        return x * x + y * y + z * z;
    }

    /** Transform the current Vector3 from a matrix array
     * @param {Array} matrix transformation matrix
     * @return the current updated Vector3
    */
    transform(matrix) {
        if (matrix.length == 9) {
            return this.transformMatrix3(matrix);
        } else if (matrix.length == 16) {
            return this.transformMatrix4(matrix);
        }
        else {
            throw new Error(`Cannot transform ${this} with ${matrix}`);
        }
    }

    /** Transform the current Vector3 from a Matrix3
     * @param {Matrix3} matrix transformation matrix
     * @return the current updated Vector3
    */
    transformMatrix3(matrix) {
        const x = this[0],
            y = this[1],
            z = this[2];
        this[0] = matrix[0] * x + matrix[3] * y + matrix[6] * z;
        this[1] = matrix[1] * x + matrix[4] * y + matrix[7] * z;
        this[2] = matrix[2] * x + matrix[5] * y + matrix[8] * z;

        return this;
    }

    /** Transform the current Vector3 from a Matrix4
     * @param {Matrix4} matrix transformation matrix
     * @return the current updated Vector3
    */
    transformMatrix4(matrix) {
        const x = this[0],
            y = this[1],
            z = this[2];

        let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
        w = w || 1.0;
        this[0] = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w;
        this[1] = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w;
        this[2] = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w;

        return this;
    }

    /** Calculate the cross product of the current Vector3 and a vector array
     * @param {Vector3} vector right operand
     * @return the current updated Vector3
    */
    cross(vector) {
        const ax = this[0],
            ay = this[1],
            az = this[2],
            bx = vector[0],
            by = vector[1],
            bz = vector[2];
        this[0] = ay * bz - az * by;
        this[1] = az * bx - ax * bz;
        this[2] = ax * by - ay * bx;

        return this;
    }

    /** Calculate the dot product of the current Vector3 and a vector array
     * @param {Vector3} vector right operand
     * @return {Number} the dot product
    */
    dot(vector) {
        return this[0] * vector[0] + this[1] * vector[1] + this[2] * vector[2];
    }


    /** Convert the current Vector3 to a Vector2
     * @return {Vector2} converted Vector3
    */
    toVector2() {
        return new Vector2(this[0], this[1]);
    }

    /** Convert the current Vector3 to a Vector4
     * @param {Number} w fourth coordinate of Vector4
     * @return {Vector4} converted Vector4
    */
    toVector4(w) {
        return new Vector4(this[0], this[1], this[2], w);
    }

    empty() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        
        return this;
    }

    static random() {
        return new Vector3(Math.random(), Math.random(), Math.random());
    }
}