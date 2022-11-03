"use strict";

let gl;
let vertices;
let colors;
let shift = -30;
const speed = 0.15;
const delta = 0.04;

// make gl point size changable

window.onload = () => {
    let canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");

    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);

    render();
};

const GHOST = (x, y, c) => {
    ////////////////// EYES //////////////////

    const balls = {
        vertices: [
            // left ball

            vec2(0, 2),
            vec2(1, 2),
            vec2(-1, 2),
            vec2(-2, 2),
            vec2(-1, 1),
            vec2(-2, 1),
            vec2(-1, 0),
            vec2(-2, 0),
            vec2(-1, -1),
            vec2(-2, -1),
            vec2(0, -1),
            vec2(1, -1),

            // right ball

            vec2(6, 2),
            vec2(7, 2),
            vec2(5, 2),
            vec2(4, 2),
            vec2(5, 1),
            vec2(4, 1),
            vec2(5, 0),
            vec2(4, 0),
            vec2(5, -1),
            vec2(4, -1),
            vec2(6, -1),
            vec2(7, -1),
        ],
        colors: Array.from({ length: 24 }, (v, i) => vec4(1.0, 1.0, 1.0, 1.0)),
    };

    const irises = {
        vertices: [
            vec2(0, 0),
            vec2(1, 0),
            vec2(0, 1),
            vec2(1, 1),
            vec2(6, 0),
            vec2(7, 0),
            vec2(6, 1),
            vec2(7, 1),
        ],

        colors: Array.from({ length: 8 }, (v, i) => vec4(0.0, 0.0, 0.0, 1.0)),
    };

    const eyes = {
        vertices: balls.vertices.concat(irises.vertices),
        colors: balls.colors.concat(irises.colors),
    };

    ////////////////// FACE //////////////////

    const face = {
        vertices: [
            vec2(2, 2),
            vec2(2, 1),
            vec2(2, 0),
            vec2(2, -1),
            vec2(3, 2),
            vec2(3, 1),
            vec2(3, 0),
            vec2(3, -1),
            vec2(8, 2),
            vec2(8, 1),
            vec2(8, 0),
            vec2(8, -1),
            vec2(9, 1),
            vec2(9, 0),
            vec2(9, -1),
            vec2(-3, 2),
            vec2(-3, 1),
            vec2(-3, 0),
            vec2(-3, -1),
            vec2(-4, 1),
            vec2(-4, 0),
            vec2(-4, -1),
        ],
        colors: [],
    };

    const level = [
        vec3(-3, 8, 3),
        vec3(-3, 8, 4),
        vec3(-2, 7, 5),
        vec3(-1, 6, 6),
        vec3(1, 4, 7),
        vec3(-4, 9, -2),
        vec3(-4, 9, -3),
        vec3(-4, 9, -4),
        vec3(-4, -1, -5),
        vec3(1, 4, -5),
        vec3(6, 9, -5),
        vec3(-3, -2, -6),
        vec3(2, 3, -6),
        vec3(7, 8, -6),
    ];

    for (var i = 0; i < level.length; ++i) {
        const lev = level[i];

        face.vertices = face.vertices.concat(strech(lev[0], lev[1], lev[2]));
    }

    face.colors = Array.from({ length: face.vertices.length }, (v, i) => c);

    ////////////////// GHOST //////////////////

    const ghost = {
        vertices: face.vertices.concat(eyes.vertices),
        colors: face.colors.concat(eyes.colors),
    };

    ghost.vertices = ghost.vertices.map((v) => {
        return vec2((v[0] + x) * delta, (v[1] + y) * delta);
    });

    return ghost;
};

const strech = (xmin, xmax, y) => {
    let result = [];
    for (var i = xmin; i <= xmax; ++i) {
        result.push(vec2(i, y));
    }
    return result;
};

const render = () => {
    const ghost = GHOST(shift, 0, vec4(1.0, 0.0, 0.0, 1.0));

    vertices = ghost.vertices;
    colors = ghost.colors;

    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    let vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length);

    shift += speed;

    if (shift > 30) {
        shift = -30;
    }

    window.requestAnimationFrame(render);
};
