import Matrix4 from '../../math/Matrix4';
import Ray from '../../math/Ray';
import Vector3 from '../../math/Vector3';
import Material from '../../renderer/graphics/Material';
import Camera from './Camera';

export default class OrthographicCamera extends Camera {
    constructor(left = -1, right = 1, bottom = -1, top = 1, near = 0.1, far = 1000) {
        super();
        this._left = left;
        this._right = right;
        this._bottom = bottom;
        this._top = top;
        this._near = near;
        this._far = far;

        this.updateAspectRatio = true;
    }

    get zoom() {
        return this._zoom;
    }

    set zoom(v) {
        if (v != this._zoom && v > 1) {
            this._zoom = v;
            this._orthographicMatrix = null;
        }
    }

    get left() {
        return this._left;
    }

    set left(v) {
        if (v != this._left) {
            this._left = v;
            this._orthographicMatrix = null;
        }
    }

    get right() {
        return this._right;
    }

    set right(v) {
        if (v != this._right) {
            this._right = v;
        }
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(v) {
        if (v != this._bottom) {
            this._bottom = v;
            this._orthographicMatrix = null;
        }
    }

    get top() {
        return this._top;
    }

    set top(v) {
        if (v != this._top) {
            this._top = v;
            this._orthographicMatrix = null;
        }
    }

    get near() {
        return this._near;
    }

    set near(v) {
        if (v != this._near) {
            this._near = v;
            this._orthographicMatrix = null;
        }
    }

    get far() {
        return this._far;
    }

    set far(v) {
        if (v != this._far) {
            this._far = v;
            this._orthographicMatrix = null;
        }
    }

    set aspectRatio(v) {
        const right = this.top * v;
        const bottom = -this.top;
        const far = this.top * 10;
        if (this._far != far) {
            this._far = far;
            this._orthographicMatrix = null;
        }
        if (this._bottom != bottom) {
            this._bottom = bottom;
            this._orthographicMatrix = null;
        }
        if (this.right != right) {
            this._left = -right;
            this._right = right;
            this._orthographicMatrix = null;
        }
    }

    get orthographicMatrix() {
        if (!this._orthographicMatrix) {
            const dx = (this.right - this.left) / (2 * this.zoom);
            const dy = (this.top - this.bottom) / (2 * this.zoom);
            const cx = (this.right + this.left) / 2;
            const cy = (this.top + this.bottom) / 2;

            let left = cx - dx;
            let right = cx + dx;
            let top = cy + dy;
            let bottom = cy - dy;
            this._orthographicMatrix = Matrix4.orthographicMatrix(left, right, bottom, top, this.near, this.far);
            if (this.frustum) {
                this.frustum._matrix = this._orthographicMatrix.inverse;
            }
        }
        return this._orthographicMatrix;
    }

    get projectionMatrix() {
        let result = this.getParameter(Material.parameters.projectionMatrix);
        if (!result || !this._orthographicMatrix) {
            result = this.orthographicMatrix.clone().multiply(this.vertexMatrix.inverse);
            this.setParameter(Material.parameters.projectionMatrix, result);
        }
        return result;
    }

    raycast(offset) {
        if (!offset) {
            offset = new Vector3();
        }
        offset[2] = (this.near + this.far) / (this.near - this.far);
        return new Ray(
            this.unproject(offset),
            this.zAxis.negate());
    }

    getScene(renderTarget, materialParameters) {
        if (!this.viewport && this.updateAspectRatio) {
            this.aspectRatio = renderTarget.aspectRatio;
        }
        return super.getScene(renderTarget, materialParameters);
    }
}