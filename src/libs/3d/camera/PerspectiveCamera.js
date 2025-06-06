import Matrix4 from '../../math/Matrix4';
import Ray from '../../math/Ray';
import Vector3 from '../../math/Vector3';
import Material from '../../renderer/graphics/Material';
import Camera from './Camera';

export default class PerspectiveCamera extends Camera {
    constructor(fovY, aspectRatio, near, far) {
        super();
        this._fovY = fovY;
        this._aspectRatio = aspectRatio;
        this._near = near;
        this._far = far;
        this.focus = 10;
        this.filmGauge = 35;
        this.filmOffset = 0;
    }

    get focalLength() {
        const vExtentSlope = Math.tan(Math.PI / 180 * 0.5 * this.fov);

        return 0.5 * this.filmHeigth / vExtentSlope;
    }

    set focalLength(v) {
        const vExtentSlope = 0.5 * this.filmHeigth / v;

        this.fov = 180 / Math.PI * 2 * Math.atan(vExtentSlope);
    }

    get filmWidth() {
        return this.filmGauge * Math.min(this.aspectRatio, 1);
    }

    get filmHeigth() {
        return this.filmGauge * Math.max(this.aspectRatio, 1);
    }

    get zoom() {
        return this._zoom;
    }

    set zoom(v) {
        if (v != this._zoom && v > 1) {
            this._zoom = v;
            this._perspectiveMatrix = null;
            this.setParameter(Material.parameters.projectionMatrix, null);
        }
    }

    get fovY() {
        return this._fovY;
    }

    set fovY(v) {
        this._fovY = v;
        this._perspectiveMatrix = null;
        this.setParameter(Material.parameters.projectionMatrix, null);
    }

    get aspectRatio() {
        return this._aspectRatio;
    }

    set aspectRatio(v) {
        this._aspectRatio = v;
        this._perspectiveMatrix = null;
        this.setParameter(Material.parameters.projectionMatrix, null);
    }

    get near() {
        return this._near;
    }

    set near(v) {
        this._near = v;
        this._perspectiveMatrix = null;
        this.setParameter(Material.parameters.projectionMatrix, null);
    }

    get far() {
        return this._far;
    }

    set far(v) {
        this._far = v;
        this._perspectiveMatrix = null;
        this.setParameter(Material.parameters.projectionMatrix, null);
    }

    get perspectiveMatrix() {
        if (!this._perspectiveMatrix) {
            this._perspectiveMatrix = Matrix4.perspectiveMatrix(this.fovY, this.aspectRatio, this.near, this.far, this.zoom);
            if (this.frustum) {
                this.frustum._matrix = this._perspectiveMatrix.inverse;
            }
        }
        return this._perspectiveMatrix;
    }

    get projectionMatrix() {
        let result = this.getParameter(Material.parameters.projectionMatrix);
        if (!result) {
            result = this.perspectiveMatrix.clone().multiply(this.vertexMatrix.inverse);
            this.setParameter(Material.parameters.projectionMatrix, result);
        }
        return result;
    }

    raycast(offset) {
        if(!offset){
            offset = new Vector3();
        }else{
            offset[2] = 0;
        }
        return new Ray(
            this.position,
            this.unproject(offset).substract(this.position).normalize());
    }

    getScene(renderTarget, materialParameters) {
        if (!this.viewport && this.aspectRatio != renderTarget.aspectRatio) {
            this.aspectRatio = renderTarget.aspectRatio;
        }
        return super.getScene(renderTarget, materialParameters);
    }
}