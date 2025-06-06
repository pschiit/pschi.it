import Color from '../core/Color';
import Matrix4 from '../math/Matrix4';
import Quaternion from '../math/Quaternion';
import Ray from '../math/Ray';
import Vector3 from '../math/Vector3';
import Material from '../renderer/graphics/Material';
import Render from '../renderer/graphics/Render';

export default class Node3d extends Render {
    /** Create a new Node3d
    */
    constructor(material, vertexBuffer) {
        super(material, vertexBuffer);
        const colorId = generateColorId();
        this.setParameter(Material.parameters.colorId, colorId);
        this._quaternion = new Quaternion();
        this._matrix = Matrix4.identityMatrix();

        this.castShadow = false;
        this.visible = true;
    }

    get colorId() {
        return this.getParameter(Material.parameters.colorId);
    }

    get vertexMatrix() {
        let vertexMatrix = this.getParameter(Material.parameters.vertexMatrix);
        if (!vertexMatrix) {
            const parentMatrix = this.parent?.vertexMatrix;
            vertexMatrix = parentMatrix instanceof Matrix4 ? parentMatrix.clone().multiply(this.matrix)
                : this.matrix.clone();
            if (this.target) {
                vertexMatrix.target(this.target);
            }
            this.setParameter(Material.parameters.vertexMatrix, vertexMatrix);
        }
        return vertexMatrix;
    }

    get normalMatrix() {
        return this.getParameter(Material.parameters.normalMatrix);
    }

    get ray() {
        return this.vertexMatrix.ray;
    }

    /** Return a Vector3 reflecting the x axis from the current Node3d
     * @return {Vector3} x axis vector
    */
    get xAxis() {
        return this.vertexMatrix.xAxis;
    }

    /** Return a Vector3 reflecting the y axis from the current Node3d
     * @return {Vector3} y axis vector
    */
    get yAxis() {
        return this.vertexMatrix.yAxis;
    }
    /** Return a Vector3 reflecting the z axis from the current Node3d
     * @return {Vector3} z axis vector
    */
    get zAxis() {
        return this.vertexMatrix.zAxis;
    }

    /** Return a Vector3 reflecting the position of the current Node3d
     * @return {Vector3} scale vector
    */
    get position() {
        return this.vertexMatrix.positionVector;
    }

    /** Return a Vector3 reflecting the scale of the current Node3d
     * @return {Vector3} scale vector
    */
    get scale() {
        return this.vertexMatrix.scaleVector;
    }

    /** Return the Vector3 target
     * @return {Vector3} node Vector3 target
    */
    get target() {
        return this._target instanceof Node3d ? this._target.position : this._target;
    }

    /** Set the target of the current Node3d
     * @param {Vector3|Node3d} v Vector3 target
    */
    set target(v) {
        this._target = v;
        this.clearVertexMatrix();
    }

    /** Return the Quaternion of the current Node3d
     * @return {Quaternion} node Quaternion
    */
    get quaternion() {
        return this.vertexMatrix.quaternion;
    }

    /** Return the Matrix4
     * @return {Matrix4} node Matrix4
    */
    get matrix() {
        return this._matrix;
    }

    /** Set the Matrix4 of the current Node3d
     * @param {Matrix4} v Matrix4
    */
    set matrix(v) {
        this._matrix = v;
        this.clearVertexMatrix();
    }

    /** Translate the Node3d by a Vector3 array
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    translate(x = 0, y = 0, z = 0) {
        this.matrix.translate(x instanceof Vector3 ? x : new Vector3(x, y, z));
        this.clearVertexMatrix();

        return this;
    }

    /** Rescale the Node3d by a Vector3 array
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rescale(x = 0, y = 0, z = 0) {
        this.matrix.scale(x instanceof Vector3 ? x : new Vector3(x, y, z));
        this.clearVertexMatrix();

        return this;
    }

    /** Rotate the Node3d by a Euler rotation Vector3
     * @param {Number|Vector3} x angle in radians of the rotation around xAxis
     * @param {Number} y angle in radians of the rotation around yAxis
     * @param {Number} z angle in radians of the rotation around zAxis
     * @return the current Node3d
    */
    rotate(x = 0, y = 0, z = 0) {
        if (x instanceof Vector3) {
            z = x[2];
            y = x[1];
            x = x[0];
        }
        const quaternion = Quaternion.fromEuler(x, y, z);
        this.transform(quaternion.matrix4);
        this.clearVertexMatrix();

        return this;
    }

    /** Make the Node3d look at a Vector3 positon
     * @param {Number|Vector3} x first coordinate of the Vector3
     * @param {Number} y second coordinate of the Vector3
     * @param {Number} z third coordinate of the Vector3
     * @return the current Node3d
    */
    lookAt(x = 0, y = 0, z = 0) {
        this.matrix.target(x instanceof Vector3 ? x : new Vector3(x, y, z));
        this.clearVertexMatrix();

        return this;
    }

    /** Transform the Node3d matrix with a Matrix4
     * @param {Matrix4} matrix 
     * @return the current Node3d
    */
    transform(matrix) {
        this.matrix.multiply(matrix);
        this.clearVertexMatrix();

        return this;
    }

    clearMatrix() {
        this.setParameter(Material.parameters.vertexMatrix, null);
        this.setParameter(Material.parameters.normalMatrix, null);
    }

    clearVertexMatrix() {
        this.dispatchCallback((node) => {
            if (node.vertexMatrix) {
                node.clearMatrix();
            }
        });
    }
    
    raycast(offset) {
        const position = this.position;
        if(offset){
            position.add(offset);
        }
        return new Ray(
            position, 
            this.zAxis);
    }

    intersect(ray) {
        return null;
    }

    setScene(parameters) {
        if (this.renderable && !this.normalMatrix) {
            this.setParameter(Material.parameters.normalMatrix, this.vertexMatrix.inverse.transpose());
        }
    }
}

const cache = {};
function generateColorId() {
    do {
        const color = Color.random();
        if (!cache[color]) {
            cache[color] = true;
            return color;
        }
    } while (true);
}