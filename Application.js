(function () {

    function gameState(){

        let proto = {
        }

        proto.landscape = landscape();
        proto.commands = commands();

        return proto;
    }

    function commands(){

        let proto = {
            landscapeClick: {
                pending: false,
                x: null,
                y: null
            },
            clickOnLandscape: function(x, y){
                this.landscapeClick = {
                    pending: true,
                    x: x,
                    y: y
                }
            }
        }

        return Object.create(proto);
    }

    function landscape(){

        let proto = {
            gameSpace:[],
            xSize: 60,
            ySize: 30,
            zSize: 5,
            forEach: function(action){
                for (var x = this.xSize - 1; x >= 0; x--) {
                    for (var y = this.ySize - 1; y >= 0; y--) {
                        for (var z = this.zSize - 1; z >= 0; z--) {
                            action(x, y, z);
                        }
                    }
                }
            }

        }

        function initGameSpace(){
            for (let x = proto.xSize - 1; x >= 0; x--) {
                for (var y = proto.ySize - 1; y >= 0; y--) {
                    for (var z = proto.zSize - 1; z >= 0; z--) {

                        //Initialise arrays where needed
                        if(!proto.gameSpace[x]){
                            proto.gameSpace[x] = [];
                        }
                        if(!proto.gameSpace[x][y]){
                            proto.gameSpace[x][y] = [];
                        }

                        proto.gameSpace[x][y][z] = tileGenerationRule(x,y,z);
                    }    
                }
            }
        }

        function tileGenerationRule(x,y,z){
            if(z == 0){
                return tile(true);
            }
            if(z == 1 && Math.random() < 0.5){
                return tile(true);
            }
            if(z == 2 && Math.random() < 0.5){
                if(proto.gameSpace[x,y,z-1] && proto.gameSpace[x,y,z-1].visible){
                    return tile(true);
                }
            }
            if(z == 3 && Math.random() < 0.25){
                if(proto.gameSpace[x,y,z-1] && proto.gameSpace[x,y,z-1].visible){
                    return tile(true);
                }
            }
            return tile(false);
        }

        initGameSpace();

        return Object.create(proto);
    }

    function tile(visible){

        let proto = {
            visible: visible
        }

        return Object.create(proto);
    }

    
function scrollUpHandler(e) {
    
        // if (e.shiftKey){
        //     if (e.deltaY < 0) {
        //         if (grid.skew > 0.95) return true;
        //         grid.skew = grid.skew + 0.01;
        //     } else {
        //         if (grid.skew < 0.05) return true;
        //         grid.skew = grid.skew - 0.01 ;
        //     }
        //     grid.reDraw();
        //     return true;
        // }
        
        
        // Increase / Decrease on logarithm scale
        if (e.deltaY > 0) {
            zIndex = zIndex + (zIndex * 0.1);
        } else {
            zIndex = zIndex - (zIndex * 0.1);
        }
        return true;
    }

    function clickhandler(e){
        // gameState.commands.clickOnLandscape(e.clientX, e.clientY);
        GetObjectFromFrameBuffer(e.clientX, e.clientY);
    }        

    function keyPressHandler(e){
        console.log(e.key);

        if(e.key === 'ArrowUp'){
            upArrowPressed = true;
        }
        if(e.key === 'ArrowDown'){
            downArrowPressed = true;
        }
        if(e.key === 'ArrowRight'){
            rightArrowPressed = true;
        }
        if(e.key === 'ArrowLeft'){
            leftArrowPressed = true;
        }
    }

    function keyUpHandler(e){
        console.log(e.key);

        if(e.key === 'ArrowUp'){
            upArrowPressed = false;
        }
        if(e.key === 'ArrowDown'){
            downArrowPressed = false;
        }
        if(e.key === 'ArrowRight'){
            rightArrowPressed = false;
        }
        if(e.key === 'ArrowLeft'){
            leftArrowPressed = false;
        }
    }

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

    let objectPickerVertexShaderSource = document.getElementById("object-picking-vertex-shader").text;
    let objectPickerFragmentShaderSource = document.getElementById("object-picking-fragment-shader").text;

    let objectPickerVertexShader = createShader(gl, gl.VERTEX_SHADER, objectPickerVertexShaderSource);
    let objectPickerFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, objectPickerFragmentShaderSource);
    
    let objectPickerProgram = createProgram(gl,  objectPickerVertexShader, objectPickerFragmentShader);

    var zIndex = 30;
    var xScroll = -20;
    var yScroll = -20;

    document.addEventListener('wheel', scrollUpHandler);
    document.addEventListener('keydown', keyPressHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.addEventListener('click', clickhandler);

    var upArrowPressed = false;
    var downArrowPressed = false;
    var leftArrowPressed = false;
    var rightArrowPressed = false;

    var gameState = gameState();

    const hexagonVertices = [ //X, Y, X, R, G, B, N(X, Y, Z)
        ////Top Area
        //Top face
        0.0, 0.0, 0.0,          0.0, 0.8, 0.0,      0,0,1,
        -0.5, -0.866, 0.0,      0.1, 0.4, 0.1,      0,0,1,
        0.5, -0.866, 0.0,       0.1, 0.4, 0.1,      0,0,1,

        //Top Left face
        0.0, 0.0, 0.0,          0.0, 0.8, 0.0,      0,0,1,
        -1.0, 0.0, 0.0,         0.1, 0.4, 0.1,      0,0,1,
        -0.5, -0.866, 0.0,      0.1, 0.4, 0.1,      0,0,1,

        //Bottom Left face
        0.0, 0.0, 0.0,          0.0, 0.8, 0.0,      0,0,1,
        -0.5, 0.866, 0.0,       0.1, 0.4, 0.1,      0,0,1,
        -1.0, 0.0, 0.0,         0.1, 0.4, 0.1,      0,0,1,

        //Bottom face
        0.0, 0.0, 0.0,          0.0, 0.8, 0.0,      0,0,1,
        0.5, 0.866, 0.0,        0.1, 0.4, 0.1,      0,0,1,
        -0.5, 0.866, 0.0,       0.1, 0.4, 0.1,      0,0,1,

        //Bottom Right face
        0.0, 0.0, 0.0,          0.0, 0.8, 0.0,      0,0,1,
        1.0, 0.0, 0.0,          0.1, 0.4, 0.1,      0,0,1,
        0.5, 0.866, 0.0,        0.1, 0.4, 0.1,      0,0,1,

        //Top Right face
        0.0, 0.0, 0.0,          0.0, 0.8, 0.0,      0,0,1,
        0.5, -0.866, 0.0,       0.1, 0.4, 0.1,      0,0,1,
        1.0, 0.0, 0.0,          0.1, 0.4, 0.1,      0,0,1,

        ////Side Area
        //Top face
        0.5, -0.866, -1.0,  0.6, 0.2, 0.2,          1,0,0,
        0.5, -0.866, 0.0, 0.6, 0.2, 0.2,            1,0,0,
        -0.5, -0.866, 0.0,  0.6, 0.2, 0.2,          1,0,0,
        -0.5, -0.866, 0.0,  0.6, 0.2, 0.2,          1,0,0,
        -0.5, -0.866, -1.0, 0.6, 0.2, 0.2,          1,0,0,
        0.5, -0.866, -1.0,  0.6, 0.2, 0.2,          1,0,0,

        //Top Left face
        -0.5, -0.866, -1.0, 0.6, 0.2, 0.2,          1,1,0,
        -0.5, -0.866, 0.0, 0.6, 0.2, 0.2,           1,1,0,
        -1.0, 0.0, 0.0, 0.6, 0.2, 0.2,              1,1,0,
        -1.0, 0.0, 0.0, 0.6, 0.2, 0.2,              1,1,0,
        -1.0, 0.0, -1.0, 0.6, 0.2, 0.2,             1,1,0,
        -0.5, -0.866, -1.0, 0.6, 0.2, 0.2,          1,1,0,

        //Bottom Left face
        -1.0, 0.0, -1.0, 0.6, 0.2, 0.2,             -1,1,0,         
        -1.0, 0.0, 0.0, 0.6, 0.2, 0.2,              -1,1,0,          
        -0.5, 0.866, 0.0, 0.6, 0.2, 0.2,            -1,1,0,           
        -0.5, 0.866, 0.0, 0.6, 0.2, 0.2,            -1,1,0,            
        -0.5, 0.866, -1.0, 0.6, 0.2, 0.2,           -1,1,0,          
        -1.0, 0.0, -1.0, 0.6, 0.2, 0.2,             -1,1,0,       

        //Bottom face
        -0.5, 0.866, -1.0, 0.6, 0.2, 0.2,           -1,0,0,
        -0.5, 0.866, 0.0, 0.6, 0.2, 0.2,            -1,0,0,
        0.5, 0.866, 0.0, 0.6, 0.2, 0.2,             -1,0,0,
        0.5, 0.866, 0.0, 0.6, 0.2, 0.2,             -1,0,0,
        0.5, 0.866, -1.0, 0.6, 0.2, 0.2,            -1,0,0,
        -0.5, 0.866, -1.0, 0.6, 0.2, 0.2,           -1,0,0,

        //Bottom Right face
        0.5, 0.866, -1.0, 0.6, 0.2, 0.2,            -1,-1,0,
        0.5, 0.866, 0.0, 0.6, 0.2, 0.2,             -1,-1,0,
        1.0, 0.0, 0.0, 0.6, 0.2, 0.2,               -1,-1,0,
        1.0, 0.0, 0.0, 0.6, 0.2, 0.2,               -1,-1,0,
        1.0, 0.0, -1.0, 0.6, 0.2, 0.2,              -1,-1,0,
        0.5, 0.866, -1.0, 0.6, 0.2, 0.2,            -1,-1,0,

        //Top Right face
        1.0, 0.0, -1.0, 0.6, 0.2, 0.2,              1,-1,0,
        1.0, 0.0, 0.0, 0.6, 0.2, 0.2,               1,-1,0,
        0.5, -0.866, 0.0, 0.6, 0.2, 0.2,            1,-1,0,
        0.5, -0.866, 0.0, 0.6, 0.2, 0.2,            1,-1,0,
        0.5, -0.866, -1.0, 0.6, 0.2, 0.2,           1,-1,0,
        1.0, 0.0, -1.0, 0.6, 0.2, 0.2,              1,-1,0,

        ////Bottom Area
        //Top Face
        0.0, 0.0, -1.0, 0.0, 0.8, 0.0,          0,0,-1,
        0.5, -0.866, -1.0, 0.1, 0.4, 0.1,       0,0,-1,
        -0.5, -0.866, -1.0, 0.1, 0.4, 0.1,      0,0,-1,

        //Top Left face
        0.0, 0.0, -1.0, 0.0, 0.8, 0.0,          0,0,-1,
        -0.5, -0.866, -1.0, 0.1, 0.4, 0.1,      0,0,-1,
        -1.0, 0.0, -1.0, 0.1, 0.4, 0.1,         0,0,-1,

        //Bottom Left face
        0.0, 0.0, -1.0, 0.0, 0.8, 0.0,          0,0,-1,
        -1.0, 0.0, -1.0, 0.1, 0.4, 0.1,         0,0,-1,
        -0.5, 0.866, -1.0, 0.1, 0.4, 0.1,       0,0,-1,

        //Bottom face
        0.0, 0.0, -1.0, 0.0, 0.8, 0.0,          0,0,-1,
        -0.5, 0.866, -1.0, 0.1, 0.4, 0.1,       0,0,-1,    
        0.5, 0.866, -1.0, 0.1, 0.4, 0.1,        0,0,-1,       

        //Bottom Right face
        0.0, 0.0, -1.0, 0.0, 0.8, 0.0,          0,0,-1,
        0.5, 0.866, -1.0, 0.1, 0.4, 0.1,        0,0,-1,
        1.0, 0.0, -1.0, 0.1, 0.4, 0.1,          0,0,-1,

        //Top Right face
        0.0, 0.0, -1.0, 0.0, 0.8, 0.0,          0,0,-1,
        1.0, 0.0, -1.0, 0.1, 0.4, 0.1,          0,0,-1,
        0.5, -0.866, -1.0, 0.1, 0.4, 0.1,       0,0,-1,
    ];

    //
    // Create buffer
    //
    let hexVertices = [
        // X, Y, Z        R, G, B
        //Middle Top
        0.0, 0.0, 0.5,  0.0, 0.8, 0.0,
        -0.5, -0.866, 0.5, 0.1, 0.4, 0.1, //F
        //A
        -1.0, 0.0, 0.5 ,  0.1, 0.4,0.1,
        //B
        -0.5, 0.866, 0.5,  0.1, 0.4,0.1,

        //C
        0.5, 0.866, 0.5 , 0.1, 0.4,0.1,

        //D
        1.0, 0.0, 0.5  ,0.1, 0.4,0.1,

        //E
        0.5, -0.866, 0.5  ,0.1, 0.4,0.1,    

        //Middle Bottom
        0.0, 0.0, -0.5,  0.5, 0.2, 0.2,

        //F
        -0.5, -0.866, -0.5 , 0.5, 0.2, 0.2,

        //A
        -1.0, 0.0, -0.5 , 0.5, 0.2, 0.2,

        //B
        -0.5, 0.866, -0.5,  0.5, 0.2, 0.2,

        //C
        0.5, 0.866, -0.5 , 0.5, 0.2, 0.2,

        //D
        1.0, 0.0, -0.5  ,0.5, 0.2, 0.2,

        //E
        0.5, -0.866, -0.5  ,0.5, 0.2, 0.2,
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

    // let boxVertexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    // let boxIndexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    let hexVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVertices), gl.STATIC_DRAW);

    // let hexIndexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hexIndexBufferObject);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(hexIndices), gl.STATIC_DRAW);
    
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let normalAttribLocation = gl.getAttribLocation(program, 'a_normal');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        normalAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.enableVertexAttribArray(normalAttribLocation);

    gl.useProgram(program);

    let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);


    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    // let xRotationMatrix = new Float32Array(16);
    // let yRotationMatrix = new Float32Array(16);

    var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");


    
    //Hexagon Maths
    let longDiameter = 2;
    let longRadius = longDiameter / 2;
    let shortDiameter = Math.sqrt(3) * longRadius;
    let shortRadius = shortDiameter / 2;

    let scrollRate = 20;

    var width = canvas.width;
    var height = canvas.height;
    var pixels = new Uint8Array(4 * 1);

    //
    // Main render loop
    //
    var then = 0;
    var angle = 0;
    var loop = function (now) {
        resize(canvas);
        gl.useProgram(program);

            let projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
        // //CLick
        // if(gameState.commands.landscapeClick.pending){
        //     gameState.commands.landscapeClick.pending = false;

        //     var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);

        //     gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        //     console.log(pixels)
        // }

        // Convert the time to seconds
        now *= 0.001;
        // Subtract the previous time from the current time
        var deltaTime = now - then;
        // Remember the current time for the next frame.
        then = now;

        if(upArrowPressed){
            yScroll += scrollRate * deltaTime;
            xScroll += scrollRate * deltaTime;
        }
        if(leftArrowPressed){
            yScroll += scrollRate * deltaTime;
            xScroll -= scrollRate * deltaTime;
        }
        if(rightArrowPressed){
            yScroll -= scrollRate * deltaTime;
            xScroll += scrollRate * deltaTime;
        }
        if(downArrowPressed){
            yScroll -= scrollRate * deltaTime;
            xScroll -= scrollRate * deltaTime;
        }

        // set the light direction.
        gl.uniform3fv(reverseLightDirectionLocation, [0.5, 1, 1.2]);

        mat4.lookAt(viewMatrix, [xScroll, yScroll, zIndex], [xScroll + zIndex, yScroll + zIndex, 0], [0, 0, 1]);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        var identityMatrix = new Float32Array(16);        

        gameState.landscape.forEach(function(x, y, z){
            if(gameState.landscape.gameSpace[x][y][z].visible){
                let xVal = x * (0.75 * longDiameter);
                let yVal = y * shortDiameter;
                let zVal = z * longRadius;

                if(x % 2 === 0){
                    yVal = yVal + shortRadius;
                }

                let vector = [xVal, yVal, zVal];
                mat4.identity(identityMatrix);
                mat4.translate(worldMatrix, identityMatrix, vector);
                gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, hexagonVertices.length / 9);
            }
        });

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    function GetObjectFromFrameBuffer(x, y){
        gl.useProgram(objectPickerProgram);
        resize(canvas);
        // const fb = gl.createFramebuffer();
        // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // // create renderbuffer
        // depthBuffer = gl.createRenderbuffer();
        // gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

        // // allocate renderbuffer
        // gl.renderbufferStorage(
        //       gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth, gl.drawingBufferHeight);  

        // // attach renderebuffer
        // gl.framebufferRenderbuffer(
        //       gl.FRAMEBUFFER,
        //       gl.DEPTH_ATTACHMENT,
        //       gl.RENDERBUFFER,
        //       depthBuffer);    

        // if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
        //     alert("this combination of attachments does not work");
        //     return;
        // }        


        let matWorldUniformLocation = gl.getUniformLocation(objectPickerProgram, 'mWorld');
        let matViewUniformLocation = gl.getUniformLocation(objectPickerProgram, 'mView');
        let matProjUniformLocation = gl.getUniformLocation(objectPickerProgram, 'mProj');

        let worldMatrix = new Float32Array(16);
        let viewMatrix = new Float32Array(16);
        let projMatrix = new Float32Array(16);
        mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

        mat4.lookAt(viewMatrix, [xScroll, yScroll, zIndex], [xScroll + zIndex, yScroll + zIndex, 0], [0, 0, 1]);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        let hexVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, hexVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVertices), gl.STATIC_DRAW);

        let positionAttribLocation = gl.getAttribLocation(objectPickerProgram, 'vertPosition');
        let vertColorUniformLocation = gl.getUniformLocation(objectPickerProgram, 'vertColor');

        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        var identityMatrix = new Float32Array(16);       


        let count = 0;
        gameState.landscape.forEach(function(){

        })

        gameState.landscape.forEach(function(x, y, z){
            if(gameState.landscape.gameSpace[x][y][z].visible){
                let xVal = x * (0.75 * longDiameter);
                let yVal = y * shortDiameter;
                let zVal = z * longRadius;

                if(x % 2 === 0){
                    yVal = yVal + shortRadius;
                }

                let vector = [xVal, yVal, zVal];
                mat4.identity(identityMatrix);
                mat4.translate(worldMatrix, identityMatrix, vector);
                gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
                gl.uniform3fv(vertColorUniformLocation, [x / gameState.landscape.xSize, y / gameState.landscape.ySize, z / gameState.landscape.zSize]);
                gl.drawArrays(gl.TRIANGLES, 0, hexagonVertices.length / 9);
            }
        });

        var colorPicked = new Uint8Array(4);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, colorPicked);

        console.log(colorPicked);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);  
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);        
    }

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