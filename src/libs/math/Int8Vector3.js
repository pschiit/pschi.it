import Vector3 from './Vector3';
import Uint8Vector3 from './Uint8Vector3';

export default class Int8Vector3 extends Int8Array {
    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    get hex() {
        return this[0] + 128 << 16 ^ this[1] + 128 << 8 ^ this[2] + 128;
    }

    set hex(v) {
        this[0] = (v >> 16 & 255) - 128;
        this[1] = (v >> 8 & 255) - 128;
        this[2] = (v & 255) - 128;
    }

    /** Return whether or not a Uint8Vector3 array is equals the current Uint8Vector3
     * @param {Int8Vector3|Uint8Vector3} vector the vector to compare
     * @return {Boolean} true if vectors are equals
    */
    equals(vector) {
        if (vector instanceof Uint8Vector3) {
            vector = vector.toInt8Vector3();
        }
        return vector && this[0] === vector[0] &&
            this[1] === vector[1] &&
            this[2] === vector[2];
    }

    /** Set a vector array to the current Uint8Vector3
     * @param {Int8Vector3|Uint8Vector3} vector 
     * @return the current updated Uint8Vector3
    */
    set(vector) {
        if (vector instanceof Uint8Vector3) {
            vector = vector.toInt8Vector3();
        }
        this[0] = vector[0];
        this[1] = vector[1];
        this[2] = vector[2];

        return this;
    }

    /** Add a vector array to the current Uint8Vector3
     * @param {Int8Vector3|Uint8Vector3} vector right operand
     * @return the current updated Uint8Vector3
    */
    add(vector) {
        if (vector instanceof Uint8Vector3) {
            vector = vector.toInt8Vector3();
        }
        this[0] += vector[0];
        this[1] += vector[1];
        this[2] += vector[2];

        return this;
    }


    /** Substract a vector array to the current Uint8Vector3
     * @param {Int8Vector3|Uint8Vector3} vector right operand
     * @return the current updated Uint8Vector3
    */
    substract(vector) {
        if (vector instanceof Uint8Vector3) {
            vector = vector.toInt8Vector3();
        }
        this[0] -= vector[0];
        this[1] -= vector[1];
        this[2] -= vector[2];

        return this;
    }

    /** Multiply a vector array to the current Uint8Vector3
     * @param {Int8Vector3|Uint8Vector3} vector right operand
     * @return the current updated Uint8Vector3
    */
    multiply(vector) {
        if (vector instanceof Uint8Vector3) {
            vector = vector.toInt8Vector3();
        }
        this[0] *= vector[0];
        this[1] *= vector[1];
        this[2] *= vector[2];

        return this;
    }


    /** Add a scalar the current Uint8Vector3
     * @param {Number} scalar scale
     * @return the current updated Uint8Vector3
    */
    addScalar(scalar) {
        this[0] = this[0] + scalar;
        this[1] = this[1] + scalar;
        this[2] = this[2] + scalar;

        return this;
    }

    /** Scale the current Uint8Vector3
     * @param {Number} scalar scale
     * @return the current updated Uint8Vector3
    */
    multiplyScalar(scalar) {
        this[0] = this[0] * scalar;
        this[1] = this[1] * scalar;
        this[2] = this[2] * scalar;

        return this;
    }

    empty() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;

        return this;
    }

    clone() {
        return new Int8Vector3(this[0], this[1], this[2]);
    }

    toVector3() {
        return new Vector3(this[0], this[1], this[2]);
    }

    toUint8Vector3() {
        return new Uint8Vector3(this[0] + 128, this[1] + 128, this[2] + 128);
    }

    static fromHex(hex){
        const result =new Int8Vector3();
        result.hex = hex;
        return result;
    }
}
