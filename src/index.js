const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
document.body.style['margin'] = '0';
canvas.style['height'] = '100vh';
canvas.style['width'] = '100vw';

const gl = canvas.getContext('webgl2');
gl.clearColor(1,0.5,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);