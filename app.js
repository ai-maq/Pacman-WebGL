"use strict";

let gl; // WebGL context
let vertices; // vertices of the quad
let colors;

window.onload = () => {
    let canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");

    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.1, 1.0);

    const delta = 0.04;

    ////////////////// EYES //////////////////

    const left_iris = {
        vertices: [vec2(0.0, 0.0), vec2(1, 0.0), vec2(0.0, 1), vec2(1, 1)],

        colors: [
            vec4(0.0, 0.0, 0.0, 1.0),
            vec4(0.0, 0.0, 0.0, 1.0),
            vec4(0.0, 0.0, 0.0, 1.0),
            vec4(0.0, 0.0, 0.0, 1.0),
        ],
    };

    const left_eyeball = {
        vertices: [
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
        ],
        colors: [
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
        ],
    };

    const right_eyeball = {
        vertices: [],
        colors: left_eyeball.colors,
    };

    const right_iris = {
        vertices: [],
        colors: left_iris.colors,
    };

    var i;

    for (i = 0; i < left_eyeball.vertices.length; ++i) {
        const left_ball_pos = left_eyeball.vertices[i];
        right_eyeball.vertices[i] = vec2(
            left_ball_pos[0] + 6,
            left_ball_pos[1]
        );
    }
    for (i = 0; i < left_iris.vertices.length; ++i) {
        const left_iris_pos = left_iris.vertices[i];
        right_iris.vertices[i] = vec2(left_iris_pos[0] + 6, left_iris_pos[1]);
    }

    const balls = {
        vertices: left_eyeball.vertices.concat(right_eyeball.vertices),
        colors: left_eyeball.colors.concat(right_eyeball.colors),
    };

    const irises = {
        vertices: left_iris.vertices.concat(right_iris.vertices),
        colors: left_iris.colors.concat(right_iris.colors),
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

    for (i = 0; i < level.length; ++i) {
        const lev = level[i];

        face.vertices = face.vertices.concat(strech(lev[0], lev[1], lev[2]));
    }

    console.log(face);

    for (var i = 0; i < face.vertices.length; ++i) {
        face.colors.push(vec4(1.0, 0.0, 0.0, 1.0));
    }

    ////////////////// GHOST //////////////////

    const ghost = {
        vertices: face.vertices.concat(eyes.vertices),
        colors: face.colors.concat(eyes.colors),
    };

    ////////////////// END //////////////////

    vertices = flatten(ghost.vertices);

    for (i = 0; i < vertices.length; ++i) {
        vertices[i] *= delta;
    }

    colors = ghost.colors;

    render();
};

const strech = (xmin, xmax, y) => {
    let result = [];
    for (var i = xmin; i <= xmax; ++i) {
        result.push(vec2(i, y));
    }
    return result;
};
const render = () => {
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    let vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
};
