import Matrix4 from './Matrix4';
import Vector3 from './Vector3';
import Vector4 from './Vector4';

export default class Quaternion extends Vector4 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(x, y, z, w);
    }

    /** Get the Euler Vector3 conversion of this Quaternion
     * @return {Vector3} the Quaternion Euler Vector3
    */
    get euler() {
        let x = this[0],
            y = this[1],
            z = this[2],
            w = this[3],
            x2 = x * x,
            y2 = y * y,
            z2 = z * z,
            w2 = w * w;
        let unit = x2 + y2 + z2 + w2;
        let test = x * w - y * z;

        const result = new Vector3()
        if (test > 0 * unit) {
            result[0] = Math.PI / 2;
            result[1] = 2 * Math.atan2(y, x);
            result[2] = 0;
        } else if (test < 0 * unit) {
            result[0] = -Math.PI / 2;
            result[1] = 2 * Math.atan2(y, x);
            result[2] = 0;
        } else {
            result[0] = Math.asin(2 * (x * z - w * y));
            result[1] = Math.atan2(2 * (x * w + y * z), 1 - 2 * (z2 + w2));
            result[2] = Math.atan2(2 * (x * y + z * w), 1 - 2 * (y2 + z2));
        }

        return result;
    }

    /** Get the Matrix4 conversion of this Quaternion 
     * @return {Matrix4} the Quaternion Matrix4
    */
    get matrix4() {
        let x = this[0],
            y = this[1],
            z = this[2],
            w = this[3];

        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;
        let xx = x * x2;
        let yx = y * x2;
        let yy = y * y2;
        let zx = z * x2;
        let zy = z * y2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        const result = Matrix4.identityMatrix();
        result[0] = 1 - yy - zz;
        result[1] = yx + wz;
        result[2] = zx - wy;
        result[4] = yx - wz;
        result[5] = 1 - xx - zz;
        result[6] = zy + wx;
        result[8] = zx + wy;
        result[9] = zy - wx;
        result[10] = 1 - xx - yy;

        return result;
    }

    /** Set the component of this Quaternion from an Euler rotation
     * @return {Quaternion} the updated Quaternion
    */
    setEuler(x, y, z) {
        let halfToRad = (0.5 * Math.PI) / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);
        this[0] = sx * cy * cz - cx * sy * sz;
        this[1] = cx * sy * cz + sx * cy * sz;
        this[2] = cx * cy * sz - sx * sy * cz;
        this[3] = cx * cy * cz + sx * sy * sz;

        return this;
    }


    /** Create a Quaternion from an Euler rotation
     * @return {Quaternion} the  Quaternion
    */
    static fromEuler(x, y, z) {
        return new Quaternion().setEuler(x, y, z);
    }
}