(function () {
    
    let canvas = document.getElementById("c");
    let gl = canvas.getContext("webgl");
    
    if(!gl){
        // WebGL not available
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    let program = createProgram(gl,  vertexShader, fragmentShader);

    //
    // Create buffer
    //

    let hexVertices = [
        // X, Y, Z
        //Middle Top
        0.0, 0.0, 0.5,  0.5, 0.0,0.2,

        //F
        -0.5, -0.866, 0.5 , 0.0, 0.0,0.5,

        //A
        -1.0, 0.0, 0.5 ,  0.3, 0.5,0.5,

        //B
        -0.5, 0.866, 0.5,  0.0, 0.0,0.5,

        //C
        0.5, 0.866, 0.5 , 0.3, 0.5,0.5,

        //D
        1.0, 0.0, 0.5  ,0.0, 0.0,0.5,

        //E
        0.5, -0.866, 0.5  ,0.3, 0.5,0.5,       

        //Middle Bottom
        0.0, 0.0, -0.5,  0.5, 0.0,0.2,

        //F
        -0.5, -0.866, -0.5 , 0.3, 0.5,0.5,

        //A
        -1.0, 0.0, -0.5 ,  0.1, 0.2,0.5,

        //B
        -0.5, 0.866, -0.5,  0.3, 0.5,0.5,

        //C
        0.5, 0.866, -0.5 , 0.1, 0.2,0.5,

        //D
        1.0, 0.0, -0.5  ,0.5, 0.0,0.2,

        //E
        0.5, -0.866, -0.5  ,0.1, 0.2,0.5,
    ]

    let hexIndices = [
        //Top
        0, 1, 6,
        0, 2, 1,
        0, 3, 2,
        0, 4, 3, 
        0, 5, 4,
        0, 6, 5,
        //Side
        6, 1, 13,
        1, 8, 13,
        1, 2, 8,
        2, 9, 8,
        2, 3, 9,
        3, 10, 9,
        3, 4, 10,
        4, 11, 10,
        4, 5, 11,
        5, 12, 11,
        5, 6, 12,
        6, 13, 12,
        //Bottom
        7, 13, 8,
        7, 8, 9,
        7, 9, 10,
        7, 10, 11, 
        7, 11, 12,
        7, 12, 13,
    ]

    let boxVertices =
        [ // X, Y, Z           R, G, B
            // Top
            -1.0, 1.0, -1.0,   0.5, 0.0,0.2,
            -1.0, 1.0, 1.0,    0.5, 0.0,0.2,
            1.0, 1.0, 1.0,     0.5, 0.0,0.2,
            1.0, 1.0, -1.0,    0.5, 0.0,0.2,

            // Left
            -1.0, 1.0, 1.0,    0.3, 0.5,0.5,
            -1.0, -1.0, 1.0,   0.3, 0.5,0.5,
            -1.0, -1.0, -1.0,  0.3, 0.5,0.5,
            -1.0, 1.0, -1.0,   0.3, 0.5,0.5,

            // Right
            1.0, 1.0, 1.0,     0.0, 0.0,0.5,
            1.0, -1.0, 1.0,    0.0, 0.0,0.5,
            1.0, -1.0, -1.0,   0.0, 0.0,0.5,
            1.0, 1.0, -1.0,    0.0, 0.0,0.5,

            // Front
            1.0, 1.0, 1.0,     0.5, 0.5,0.0,
            1.0, -1.0, 1.0,    0.5, 0.5,0.0,
            -1.0, -1.0, 1.0,   0.5, 0.5,0.0,
            -1.0, 1.0, 1.0,    0.5, 0.5,0.0,

            // Back
            1.0, 1.0, -1.0,    0.1, 0.2,0.5,
            1.0, -1.0, -1.0,   0.1, 0.2,0.5,
            -1.0, -1.0, -1.0,  0.1, 0.2,0.5,
            -1.0, 1.0, -1.0,   0.1, 0.2,0.5,

            // Bottom
            -1.0, -1.0, -1.0,  0.8, 0.2,0.5,
            -1.0, -1.0, 1.0,   0.8, 0.2,0.5,
            1.0, -1.0, 1.0,    0.8, 0.2,0.5,
            1.0, -1.0, -1.0,   0.8, 0.2,0.5
        ];

    let boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

    // let boxVertexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    // let boxIndexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    let hexVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexVertices), gl.STATIC_DRAW);

    let hexIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hexIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(hexIndices), gl.STATIC_DRAW);
    
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let xRotationMatrix = new Float32Array(16);
    let yRotationMatrix = new Float32Array(16);
    
    //
    // Main render loop
    //
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        resize(canvas);

        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, hexIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    function createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    function resize(canvas) {
        // Lookup the size the browser is displaying the canvas.
        let displayWidth  = canvas.clientWidth;
        let displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width  !== displayWidth ||
            canvas.height !== displayHeight) {

            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
})();