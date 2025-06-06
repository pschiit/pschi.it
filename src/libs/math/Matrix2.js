import Matrix3 from'./Matrix3';
import Matrix4 from'./Matrix4';
import FloatArray from'./FloatArray';
import Vector2 from'./Vector2';

export default class  Matrix2 extends FloatArray{
    /** Create a new Matrix2 from an array of number
     * @param {Number[]} values values of the matrix 
    */
    constructor(values) {
        super(4);
        if (values) {
            this.set(values);
        }
    }

    /** Return whether or not a Matrix2 array is equals the current Matrix2
     * @param {Matrix2} matrix the matrix to compare
     * @return {Boolean} true if matrices are equals
    */
    equals(matrix) {
        return matrix?.length == this.length && 
            this[0] === matrix[0] &&
            this[1] === matrix[1] &&
            this[2] === matrix[2] &&
            this[3] === matrix[3];
    }

    /** Add a Matrix2 array to the current Matrix2
     * @param {Matrix2} matrix right operand
     * @return the current updated Matrix2
    */
    add(matrix) {
        this[0] += matrix[0];
        this[1] += matrix[1];
        this[2] += matrix[2];
        this[3] += matrix[3];

        return this;
    }

    /** Substract a Matrix2 array to the current Matrix2
     * @param {Matrix2} matrix right operand
     * @return the current updated Matrix2
    */
    substract(matrix) {
        this[0] -= matrix[0];
        this[1] -= matrix[1];
        this[2] -= matrix[2];
        this[3] -= matrix[3];

        return this;
    }

    /** Multiply a Matrix2 array to the current Matrix2
     * @param {Matrix2} matrix right operand
     * @return the current updated Matrix2
    */
    multiply(matrix) {
        const a0 = this[0],
            a1 = this[1],
            a2 = this[2],
            a3 = this[3],
            b0 = matrix[0],
            b1 = matrix[1],
            b2 = matrix[2],
            b3 = matrix[3];

        this[0] = a0 * b0 + a2 * b1;
        this[1] = a1 * b0 + a3 * b1;
        this[2] = a0 * b2 + a2 * b3;
        this[3] = a1 * b2 + a3 * b3;

        return this;
    }

    /** Scale the current Matrix3 by a vector2 array
     * @param {Vector2} vector translation vector
     * @return the current updated Matrix3
    */
    scale(vector) {
        this[0] *= vector[0];
        this[1] *= vector[0];
        this[2] *= vector[1];
        this[3] *= vector[1];

        return this;
    }

    /** Rotate the current Matrix2 by an angle in radians
     * @param {Number} radians angle of rotation
     * @return the current updated Matrix2
    */
    rotate(radians) {
        const a0 = this[0],
            a1 = this[1],
            a2 = this[2],
            a3 = this[3],
            s = Math.sin(radians),
            c = Math.cos(radians);

        this[0] = a0 * c + a2 * s;
        this[1] = a1 * c + a3 * s;
        this[2] = a0 * -s + a2 * c;
        this[3] = a1 * -s + a3 * c;

        return this;
    }

    /** Transpose the current Matrix2
     * @return the current updated Matrix2
    */
    transpose() {
        const a1 = this[1];
        
        this[1] = this[2];
        this[2] = a1;

        return this;
    }

    /** Calculate the current Matrix2 determinant
     * @return {Number} determinant of the current Matrix2
    */
    determinant() {
        return this[0] * this[1] - this[2] * this[3];
    }

    /** Invert the current Matrix2
     * @return the current updated Matrix2 or null if determinant == 0
    */
    invert() {
        let det = this.determinant();
        if (!det) {
            return null;
        }
        det = 1.0 / det;

        this[0] = this[0] * det;
        this[1] = -this[1] * det;
        this[2] = -this[2] * det;
        this[3] = this[3] * det;

        return this;
    }

    /** Convert the current Matrix2 to a Matrix3
     * @return {Matrix3} converted Matrix3
    */
    toMatrix3() {
        const result = new Matrix3();

        result[0] = this[0];
        result[1] = this[1];
        result[3] = this[2];
        result[4] = this[3];
        result[8] = 1;

        return result;
    }

    /** Convert the current Matrix2 to a Matrix4
     * @return {Matrix4} converted Matrix4
    */
    toMatrix4() {
        const result = new Matrix4();

        result[0] = this[0];
        result[1] = this[1];
        result[4] = this[2];
        result[5] = this[3];
        result[10] = 1;
        result[15] = 1;

        return result
    }

    /** Create a new identity Matrix2
     * @return {Matrix2} the identity Matrix2
    */
    static identityMatrix() {
        const result = new Matrix2();

        result[0] = 1;
        result[3] = 1;

        return result;
    }
}