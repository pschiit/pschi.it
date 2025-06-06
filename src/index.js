import Editor from './apps/Boxel/Editor';
import Test from './apps/Boxel/Test';
import Lights from './apps/lights/Lights';
import OrthographicCamera from './libs/3d/camera/OrthographicCamera';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import Vector3 from './libs/math/Vector3';

const body = HtmlNode.body;
body.style = {
    margin: 0,
    display: 'block',
};
const canvas = new WebGLCanvas();
body.appendChild(canvas);
canvas.style = {
    width: '100vw',
    height: '100vh',
    display: 'block',
    background: 'transparent',
    'touch-action': 'none',
}

let app;
app = getApp(window.location.pathname.replace('/', ''));
let animationFrame = requestAnimationFrame(run);
let then = 0;

function getApp(name) {
    if (app) {
        app.stop();
    }
    switch (name) {
        case 'test':
            return new Test(canvas);
        case 'lights':
            return new Lights(canvas);
        case 'editor':
            return new Editor(canvas);
        default:
            return new Test(canvas);
    }
}

function run(time) {
    const now = time * 0.001;
    canvas.element.setAttribute('fps', Math.round(1 / (now - then)).toString());
    then = now;
    app.run(time);
    animationFrame = requestAnimationFrame(run);
}