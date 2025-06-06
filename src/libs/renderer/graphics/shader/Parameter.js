import Matrix2 from '../../../math/Matrix2';
import Matrix3 from '../../../math/Matrix3';
import Matrix4 from '../../../math/Matrix4';
import Vector2 from '../../../math/Vector2';
import Vector3 from '../../../math/Vector3';
import Vector4 from '../../../math/Vector4';
import Texture from '../Texture';
import ShaderNode from './ShaderNode';

export default class Parameter extends ShaderNode {
    constructor(type, name, qualifier) {
        super();
        this.name = name;
        this.type = type;
        this.qualifier = qualifier;
        this.length = 0;
    }

    /** Return the parameter name.
     * @returns {string} the parameter name
    */
    toString() {
        return this.name;
    }

    static qualifier = {
        const: 'const',
        in: 'in',
        out: 'out'
    }

    static boolean(name, qualifier) {
        return new Parameter(Boolean, name, qualifier);
    }

    static number(name, qualifier) {
        return new Parameter(Number, name, qualifier);
    }

    static vector2(name, qualifier) {
        return new Parameter(Vector2, name, qualifier);
    }

    static vector3(name, qualifier) {
        return new Parameter(Vector3, name, qualifier);
    }

    static vector4(name, qualifier) {
        return new Parameter(Vector4, name, qualifier);
    }

    static matrix2(name, qualifier) {
        return new Parameter(Matrix2, name, qualifier);
    }

    static matrix3(name, qualifier) {
        return new Parameter(Matrix3, name, qualifier);
    }

    static matrix4(name, qualifier) {
        return new Parameter(Matrix4, name, qualifier);
    }

    static texture(name, qualifier) {
        return new Parameter(Texture, name, qualifier);
    }
}