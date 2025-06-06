import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import ShaderFunction from '../../renderer/graphics/shader/ShaderFunction';
import VertexBuffer from '../../renderer/graphics/buffer/VertexBuffer';
import PerspectiveCamera from '../camera/PerspectiveCamera';
import Node3d from '../Node3d';

export default class Grid extends Node3d {
    constructor(camera) {
        super();
        this.vertexBuffer = new GridBuffer();
        this.material = new GridMaterial();
        this.mode = camera instanceof PerspectiveCamera ? Grid.mode.perspective
            : Grid.mode.orthographic;

    }

    get color() {
        return this.getParameter(GridMaterial.parameters.color);
    }

    set color(v) {
        this.setParameter(GridMaterial.parameters.color, v);
    }

    get sizes() {
        return this.getParameter(GridMaterial.parameters.sizes);
    }

    set sizes(v) {
        this.setParameter(GridMaterial.parameters.sizes, v);
    }

    get distance() {
        return this.getParameter(GridMaterial.parameters.distance);
    }

    set distance(v) {
        this.setParameter(GridMaterial.parameters.distance, v);
    }

    get fading() {
        return this.getParameter(GridMaterial.parameters.fading);
    }

    set fading(v) {
        this.setParameter(GridMaterial.parameters.fading, v);
    }

    get mode() {
        return this._mode;
    }

    set mode(v) {
        if (v != this.mode) {
            this._mode = v;
            this.material.init(v)
        };
    }

    static mode = {
        orthographic: 'orthographic',
        perspective: 'perspective'
    }
}

export class GridBuffer extends VertexBuffer {
    constructor() {
        super();

        this.primitive = Node3d.primitive.triangleFan;
        this.index = [
            0, 1, 2, 3,];
        this.position = [
            -1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
            1, -1, 0,];
    }
}

export class GridMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;

        this.setParameter(Material.parameters.cameraPosition);
        this.setParameter(Material.parameters.cameraTarget);
        this.setParameter(Material.parameters.projectionMatrix);

        this.color = Color.black();
        this.sizes = new Vector2(1, 10);
        this.distance = 10000;
        this.axes = 'xzy';
        this.fading = 25;
    }

    get distance() {
        return this.getParameter(GridMaterial.parameters.distance);
    }

    set distance(v) {
        this.setParameter(GridMaterial.parameters.distance, v);
    }

    get sizes() {
        return this.getParameter(GridMaterial.parameters.sizes);
    }

    set sizes(v) {
        this.setParameter(GridMaterial.parameters.sizes, v);
    }

    get color() {
        return this.getParameter(GridMaterial.parameters.color);
    }

    set color(v) {
        this.setParameter(GridMaterial.parameters.color, v);
    }

    get fading() {
        return this.getParameter(GridMaterial.parameters.fading);
    }

    set fading(v) {
        this.setParameter(GridMaterial.parameters.fading, v);
    }

    init(mode) {
        const planeAxes = '.' + this.axes.substring(0, 2);

        const position = Parameter.vector3('pos');
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);

        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.multiply(
                    Operation.selection(Material.parameters.position, '.' + this.axes),
                    GridMaterial.parameters.distance)),
            Operation.addTo(
                Operation.selection(position, planeAxes),
                Operation.selection(Material.parameters.cameraPosition, planeAxes)),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    Operation.toVector4(position, 1))),
            Operation.equal(
                vPosition,
                position)]);


        const r = Parameter.vector2('r');
        const grid = Parameter.vector2('grid');
        const line = Parameter.number('line');

        const viewPosition = Parameter.vector3('viewPosition');
        const d = Parameter.number('d');
        const g1 = Parameter.number('g1');
        const g2 = Parameter.number('g2');

        const outputAlpha = Operation.selection(Shader.parameters.output, '.a');
        const planeAxesSelection = Operation.selection(vPosition, planeAxes);

        const dOperation = mode == Grid.mode.perspective ?
            Operation.equal(
                Operation.declare(d),
                Operation.substract(
                    1,
                    Operation.min(
                        Operation.distance(
                            Operation.selection(viewPosition, planeAxes),
                            Operation.divide(
                                planeAxesSelection,
                                GridMaterial.parameters.distance
                            ),
                        ),
                        1
                    )
                )
            ) : //Orthographic mode
            Operation.equal(
                Operation.declare(d),
                Operation.substract(
                    1,
                    Operation.divide(
                        Operation.distance(
                            planeAxesSelection,
                            Operation.selection(
                                Material.parameters.cameraTarget,
                                planeAxes
                            )
                        ),
                        GridMaterial.parameters.fading,
                    )
                )
            );


        const size = Parameter.number('size');
        const getGrid = new ShaderFunction(
            'getGrid',
            Number,
            size,
            [
                Operation.equal(
                    Operation.declare(r),
                    Operation.divide(
                        planeAxesSelection,
                        size
                    )
                ),
                Operation.equal(
                    Operation.declare(grid),
                    Operation.divide(
                        Operation.abs(
                            Operation.substract(
                                Operation.fract(Operation.substract(r, 0.5)),
                                0.5
                            ),
                        ),
                        Operation.fWidth(
                            r
                        ),
                    )
                ),
                Operation.equal(
                    Operation.declare(line),
                    Operation.min(
                        Operation.selection(grid, '.x'),
                        Operation.selection(grid, '.y'),
                    ),
                ),
                Operation.return(
                    Operation.substract(1, Operation.min(line, 1))
                ),
            ]);
        const x = Operation.selection(viewPosition, '.x');
        const y = Operation.selection(viewPosition, '.y');

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(
                Operation.declare(viewPosition),
                Operation.normalize(
                    Operation.substract(
                        Material.parameters.cameraPosition,
                        vPosition
                    )
                )
            ),
            dOperation,
            Operation.equal(
                Operation.declare(g1),
                Operation.do(
                    getGrid,
                    Operation.selection(GridMaterial.parameters.sizes, '.x'))
            ),
            Operation.equal(
                Operation.declare(g2),
                Operation.do(
                    getGrid,
                    Operation.selection(GridMaterial.parameters.sizes, '.y'))
            ),
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(
                    GridMaterial.parameters.color,
                    Operation.multiply(
                        Operation.mix(g2, g1, g1),
                        Operation.pow(d, 3))),
            ),
            Operation.equal(
                outputAlpha,
                Operation.mix(
                    Operation.multiply(0.5, outputAlpha),
                    outputAlpha,
                    g2
                )),
            Operation.if(
                Operation.lessEquals(
                    outputAlpha,
                    0
                ),
                Operation.discard()
            ),
            Material.operation.gammaCorrection],
            Shader.precision.high);
    }

    static parameters = {
        distance: Parameter.number('gridDistance', Parameter.qualifier.const),
        sizes: Parameter.vector2('gridSizes', Parameter.qualifier.const),
        color: Parameter.vector3('gridColor', Parameter.qualifier.const),
        fading: Parameter.number('gridFading', Parameter.qualifier.const),
    };
}