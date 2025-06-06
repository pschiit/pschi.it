import Plane from './Plane';

export default class Frustum {
    /** Create a new Frustum
     * @param {Plane} left Left Plan of the frustum
     * @param {Plane} right Right Plan of the frustum
     * @param {Plane} bottom Bottom Plan of the frustum
     * @param {Plane} top Top Plan of the frustum
     * @param {Plane} near Near Plan of the frustum
     * @param {Plane} far Far Plan of the frustum
    */
    constructor(left, right, bottom, top, near, far) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
    }
}