import Matrix2 from './Matrix2';
import Matrix3 from './Matrix3';
import Matrix4 from './Matrix4';
import Vector3 from './Vector3';
import Vector4 from './Vector4';
import FloatArray from './FloatArray';

export default class Vector2 extends FloatArray {
    /** Create a new Vector2 from the coordinates xy or a vector array
     * @param {Number|Number[]} x first coordinate or vector array
     * @param {Number} y second coordinate
    */
    constructor(x, y) {
        super(2);
        if (typeof x !== 'undefined') {
            if (x.length >= 0) {
                this[0] = x[0];
                this[1] = x[1];
            } else {
                this[0] = x;
                if (y) {
                    this[1] = y;
                }
            }
        }
    }

    get lenSqrt() {
        return this[0] * this[0] + this[1] * this[1];
    }

    get len() {
        return Math.sqrt(this.lenSqrt);
    }

    /** Return whether or not a Vector2 array is equals the current Vector2
     * @param {Vector2} vector the vector to compare
     * @return {Boolean} true if vectors are equals
    */
    equals(vector) {
        return vector?.length == this.length &&
            this[0] === vector[0] &&
            this[1] === vector[1];
    }

    /** Add a vector array to the current Vector2
     * @param {Vector2} vector right operand
     * @return the current updated Vector2
    */
    add(vector) {
        this[0] += vector[0];
        this[1] += vector[1];

        return this;
    }

    /** Substract a vector array to the current Vector2
     * @param {Vector2} vector right operand
     * @return the current updated Vector2
    */
    substract(vector) {
        this[0] -= vector[0];
        this[1] -= vector[1];

        return this;
    }

    /** Multiply a vector array to the current Vector2
     * @param {Vector2} vector right operand
     * @return the current updated Vector2
    */
    multiply(vector) {
        this[0] *= vector[0];
        this[1] *= vector[1];

        return this;
    }

    /** Divide a vector array to the current Vector2
     * @param {Vector2} vector right operand
     * @return the current updated Vector2
    */
    divide(vector) {
        this[0] /= vector[0];
        this[1] /= vector[1];

        return this;
    }

    /** Scale the current Vector2
     * @param {Number} value scale
     * @return the current updated Vector2
    */
    scale(value) {
        this[0] = this[0] * value;
        this[1] = this[1] * value;

        return this;
    }

    /** Normalize the current Vector2
     * @return the current updated Vector2
    */
    normalize() {
        const x = this[0];
        const y = this[1];
        let dot = x * x + y * y;

        if (dot > 0) {
            dot = 1 / Math.sqrt(dot);
        }

        this[0] = x * dot;
        this[1] = y * dot;

        return this;
    }

    /** Negate the current Vector3
     * @return the current updated Vector3
    */
    negate() {
        this[0] = -this[0];
        this[1] = -this[1];
        return this;
    }

    /**
     * Calculates the euclidian distance between two Vector2
     * @param {Vector2} vector the second operand
     * @returns {Number} distance
     */
    distance(vector) {
        const x = vector[0] - this[0];
        const y = vector[1] - this[1];

        return Math.hypot(x, y);
    }

    /**
     * Calculates the squared euclidian distance between two Vector2
     * @param {Vector2} vector the second operand
     * @returns {Number} squared distance
     */
    distanceSqrt(vector) {
        const x = vector[0] - this[0];
        const y = vector[1] - this[1];

        return x * x + y * y;
    }

    /** Transform the current Vector2 from a matrix array
     * @param {Array} matrix transformation matrix
     * @return the current updated Vector2
    */
    transform(matrix) {
        if (matrix.length == 4) {
            return this.transformMatrix2(matrix);
        } else if (matrix.length == 9) {
            return this.transformMatrix3(matrix);
        } else if (matrix.length == 16) {
            return this.transformMatrix4(matrix);
        }
        else {
            throw new Error(`Cannot transform ${this} with ${matrix}`);
        }
    }

    /** Transform the current Vector2 from a Matrix2
     * @param {Matrix2} matrix transformation matrix
     * @return the current updated Vector2
    */
    transformMatrix2(matrix) {
        const x = this[0],
            y = this[1];
        this[0] = matrix[0] * x + matrix[2] * y;
        this[1] = matrix[1] * x + matrix[3] * y;

        return this;
    }

    /** Transform the current Vector2 from a Matrix3
     * @param {Matrix3} matrix transformation matrix
     * @return the current updated Vector2
    */
    transformMatrix3(matrix) {
        const x = this[0],
            y = this[1];
        this[0] = matrix[0] * x + matrix[3] * y + matrix[6];
        this[1] = matrix[1] * x + matrix[4] * y + matrix[7];

        return this;
    }

    /** Transform the current Vector2 from a Matrix4
     * @param {Matrix4} matrix transformation matrix
     * @return the current updated Vector2
    */
    transformMatrix4(matrix) {
        const x = this[0],
            y = this[1];
        this[0] = matrix[0] * x + matrix[4] * y + matrix[12];
        this[1] = matrix[1] * x + matrix[5] * y + matrix[13];

        return this;
    }

    /** Calculate the cross product of the current Vector2 and a vector array
     * @param {Vector2} vector right operand
     * @return {Vector3} the cross product
    */
    cross(vector) {
        const z = this[0] * vector[1] - this[1] * vector[0];

        return new Vector3(0, 0, z);
    }

    /** Calculate the dot product of the current Vector2 and a vector array
     * @param {Vector2} vector right operand
     * @return {Number} the dot product
    */
    dot(vector) {
        return this[0] * vector[0] + this[1] * vector[1];
    }

    /** Convert the current Vector2 to a Vector3
     * @param {Number} z third coordinate of Vector3
     * @return {Vector3} converted Vector3
    */
    toVector3(z = 0) {
        return new Vector3(this[0], this[1], z);
    }

    /** Convert the current Vector2 to a Vector4
     * @param {Number} z third coordinate of Vector4
     * @param {Number} w fourth coordinate of Vector4
     * @return {Vector4} converted Vector4
    */
    toVector4(z = 0, w = 0) {
        return new Vector4(this[0], this[1], z, w);
    }

    empty() {
        this[0] = 0;
        this[1] = 0;
        
        return this;
    }
}