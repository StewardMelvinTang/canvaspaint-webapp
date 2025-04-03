
const canvas = document.querySelector("canvas"); //* this will return the first canvas element in html
toolButtons = document.querySelectorAll(".tool"); // * return all .tool class
fillColor = document.getElementById("fill-color");
brushSizeSlider = document.getElementById("brushsize-slider");
canvasContext = canvas.getContext("2d"); // * return one and only context
colorButtons = document.querySelectorAll(".colors-pick .option");
menuButtons = document.querySelectorAll(".row.buttons .menuBtn");
resetCanvasBtn = document.getElementById("btn-reset-canvas");

// disable undo & redo button at first
undoButton = document.getElementById("undo-button");
redoButton = document.getElementById("redo-button");


let isMouseDown = false;
currentToolSelected = "Brush";
lastSelectedTool = "None";
brushSize = 5;
selectedColor = "#000000";

// * Text Tool
let isTypingText = false;
// let isTextToolActive = false;
let textX = 0, textY = 0;
let inputFocus = "";
textToolInput = document.getElementById("font-text-input");
fontSizeInput = document.getElementById("font-size");
fontFamilyInput = document.getElementById("font-family");

let prevMouseX, prevMouseY, snapshot;

// * undo & redo system
let undoStack = [];
let redoStack = [];


window.addEventListener("load", () => {
    // return viewable size of canvas.
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

// undo and redo functions are down below. save state is for to save the curr state
// ! Make sure to always run this function anytime we add smth
const SaveState = () => {

    // fix eraser bug when undo
    // canvasContext.globalCompositeOperation = "source-over";
    // after the stack gets to 25 more, remove the first one to improve performance
    if (undoStack.length > 25) undoStack.shift();
    undoStack.push(canvas.toDataURL()); //save the canvas state
    redoStack.length = 0; // clear the redo stack when new action is made
    UpdateUndoAndRedoButton();
}

// * Resize Canvas System
const canvasSizeXInput = document.getElementById("canvas-width");
const canvasSizeYInput = document.getElementById("canvas-height");
const canvasSizeApplyBtn = document.getElementById("resize-canvas");
canvasSizeApplyBtn.disabled = true;
const ResizeCanvas = () => {
    const newWidth = parseInt(canvasSizeXInput.value);
    const newHeight = parseInt(canvasSizeYInput.value);

    //update canvas size based on the inpt
    if (!isNaN(newWidth) && !isNaN(newHeight) && newWidth >= 100 && newHeight >= 100){
        // store tempimg snapshot
        const tempImg = canvasContext.getImageData(0,0,canvas.width, canvas.height);
        const oldWidth = canvas.width;
        const oldHeiht = canvas.height;
        canvas.width = newWidth;
        canvas.height = newHeight;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        // restore the saved img (other wise it blank)
        // * restore in the middle of canvas
        canvasContext.putImageData(tempImg, (newWidth - oldWidth) / 2, (newHeight- oldHeiht )/ 2);
        
    } else {
        alert('Please enter valid size and the size must be 100 or aobve');
    }
}

canvasSizeXInput.addEventListener("change", () => {
    canvasSizeApplyBtn.disabled = parseInt(canvasSizeXInput.value) == canvas.width;
});

canvasSizeYInput.addEventListener("change", () => {
    canvasSizeApplyBtn.disabled = parseInt(canvasSizeYInput.value) == canvas.height;
});

canvasSizeApplyBtn.addEventListener("click", () => {
    ResizeCanvas();
    canvasSizeApplyBtn.disabled = true;
})

// * IMAGE IMPORT & RESIZING SYSTEM
// Idea : make it resizable & draggable (move) along the canvas
// we already implemented resize canvas, so we dont have to follow the TA's instruction to resize canvas according to img size
// but i will add the option later
// ! [TODO] Add option to resize canvas automatically (checkbx)
let isOnImageTransformationMode = false;
let customImg = null;
let isOpeningFilePicker = false

let imgX = 25, imgY = 25;
let imgWidth = 0, imgHeight = 0; //change according to img size
let isDragging = false;
let isResizing = false;
let resizeHandleSize = 10;
let dragOffsetX, dragOffsetY;
let imgTransform_CheckBtn = document.getElementById("imgtransform-proceed-btn");
let imgTransform_CancelBtn = document.getElementById("imgtransform-cancel-btn");
let originalCanvasState = null;


document.getElementById("image-upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        // SaveState();
        isFileSelected = true;
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                customImg = img;
                originalCanvasState = canvasContext.getImageData(0,0, canvas.width, canvas.height);
                SaveState();
                
                // ! Handle Img X and Img Y put it in the middle
                // imgX, imgY
                
                imgHeight = img.height;
                imgWidth = img.width;
                // make a algorithm where when the image exceeds the canvas size,
                // we will resize the image in a loop after it below the canvas size
                console.log("original img width : ", imgWidth, " original img height: ", imgHeight);
                
                while (imgWidth > canvas.width || imgHeight > canvas.height){
                    imgWidth *= 0.8;
                    imgHeight *= 0.8;
                }
                
                console.log("modifid img width : ", imgWidth, " modifid img height: ", imgHeight);
                if (isOnImageTransformationMode) return;
                isOnImageTransformationMode = true;
                UpdateImgTransforma();

                document.getElementById("main-toolbar").classList.add("disabled"); // Disable
            };
        };
        
        reader.readAsDataURL(file);
    }

    isOpeningFilePicker = false;
});

window.addEventListener("focus", function() {
    isOpeningFilePicker = false;
});

function UpdateImgTransforma(finish = false) {
    // if (!finish && !isOnImageTransformationMode) return;
    // SaveState();
    canvasContext.clearRect(0,0, canvas.width, canvas.height);
    canvasContext.putImageData(originalCanvasState, 0,0);
    if (customImg) {

        // * ENTER IMGTRANSFORM  MODE
        canvasContext.drawImage(customImg, imgX, imgY, imgWidth, imgHeight);
        if (!finish){
            canvasContext.strokeStyle = "black";
            canvasContext.lineWidth = 3;
            canvasContext.setLineDash([10,5]);
            canvasContext.beginPath();
            canvasContext.rect(imgX, imgY, imgWidth, imgHeight);
            canvasContext.stroke();
            canvasContext.setLineDash([]);
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(imgX + imgWidth - resizeHandleSize, imgY + imgHeight - resizeHandleSize, resizeHandleSize, resizeHandleSize);
            document.querySelector(".img-transform-toolbar").classList.remove("hidden");
        }
    }
}

const CheckImgTransformation = (e) => {
    if (currentToolSelected != "Image" || !isOnImageTransformationMode) return;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    // console.log('p')
    // Check if resizing
    if (
        mouseX > imgX + imgWidth - resizeHandleSize &&
        mouseX < imgX + imgWidth &&
        mouseY > imgY + imgHeight - resizeHandleSize &&
        mouseY < imgY + imgHeight
    ) {
        isResizing = true;
    }
    // Check if dragging
    else if (mouseX > imgX && mouseX < imgX + imgWidth && mouseY > imgY && mouseY < imgY + imgHeight) {
        isDragging = true;
        offsetX = mouseX - imgX;
        offsetY = mouseY - imgY;
    }
}

const ResizingImage = (e) => {
    if (currentToolSelected != "Image" || !isOnImageTransformationMode) return;
    if (isDragging) {
        imgX = e.offsetX - offsetX;
        imgY = e.offsetY - offsetY;
        UpdateImgTransforma();
        canvas.style.cursor = "move";
    } else if (isResizing) {
        imgWidth = e.offsetX - imgX;
        imgHeight = e.offsetY - imgY;
        UpdateImgTransforma();
        // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
        canvas.style.cursor = "nwse-resize";
    }
};

const cancelImgTransformation = () => {
    if (currentToolSelected != "Image") return;
    console.log("cancel putting img");
    // UndoCnavas();
    canvasContext.putImageData(originalCanvasState, 0, 0);
    
    isOnImageTransformationMode = false;
    // revert back to last selected tool
    OnToolButtonClicked("", true, lastSelectedTool);
    document.querySelector(".img-transform-toolbar").classList.add("hidden");
    document.getElementById("main-toolbar").classList.remove("disabled"); // enable main toolbar
    // undoStack.pop();
}

const acceptImgTransformation = () => {
    if (currentToolSelected != "Image") return;
    console.log("done putting img");

    isOnImageTransformationMode = false;
    OnToolButtonClicked("", true, lastSelectedTool);
    document.querySelector(".img-transform-toolbar").classList.add("hidden");
    document.getElementById("main-toolbar").classList.remove("disabled"); // Enable main toolbar
    UpdateImgTransforma(true);
}

imgTransform_CancelBtn.addEventListener("click", cancelImgTransformation );

imgTransform_CheckBtn.addEventListener("click", acceptImgTransformation);



const DrawText = (text, x, y) => {
    let fontSize = fontSizeInput.value + "px";
    let fontFam = fontFamilyInput.value;

    canvasContext.font = `${fontSize} ${fontFam}`;
    canvasContext.fillStyle = selectedColor;
    canvasContext.fillText(text, x, y);

    // SaveState();
}

const DrawShape = (mouseInp, shapeType) => {

    canvasContext.globalCompositeOperation = "source-over";
    // console.log("Selected Color : ", selectedColor);
    canvasContext.fillStyle = selectedColor;
    canvasContext.strokeStyle = selectedColor;
    canvasContext.fillColor = selectedColor;
    switch(shapeType){
        case "Rectangle":
            let w = prevMouseX - mouseInp.offsetX;
            let h = prevMouseY - mouseInp.offsetY;
            canvasContext.lineWidth = brushSize;
        
            if (!fillColor.checked) canvasContext.strokeRect(mouseInp.offsetX, mouseInp.offsetY, w, h); // * outline only (no fill)
            else {
                // canvasContext.fillColor = selectedColor
                // ;
                // canvasContext.fillStyle = selectedColor;
                canvasContext.fillRect(mouseInp.offsetX, mouseInp.offsetY, w, h); // * FIll color
            }
            break;
        case "Circle":
            canvasContext.beginPath();
            let radius = Math.sqrt(Math.pow((prevMouseX - mouseInp.offsetX), 2) + Math.pow((prevMouseY - mouseInp.offsetY), 2));
            canvasContext.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //https://www.w3schools.com/graphics/canvas_circles.asp
            if (fillColor.checked) canvasContext.fill();
            else canvasContext.stroke();
            canvasContext.lineWidth = brushSize;
            break;
        case "Triangle": //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
            canvasContext.beginPath();
            canvasContext.lineWidth = brushSize;
            canvasContext.moveTo(prevMouseX, prevMouseY);
            canvasContext.lineTo(mouseInp.offsetX, mouseInp.offsetY);
            canvasContext.lineTo(prevMouseX * 2 - mouseInp.offsetX, mouseInp.offsetY);
            canvasContext.closePath();

            if (fillColor.checked) canvasContext.fill();
            else canvasContext.stroke();
    }
    // SaveState();
}

const DrawingEvent = (mouseInp) => {
    if (!isMouseDown || currentToolSelected === "Font" || isTypingText) return;
    // SetMousePositionRelative(mouseInp);
    if (currentToolSelected != "Eraser") canvasContext.putImageData(snapshot, 0, 0);

    switch(currentToolSelected){
        case "Brush":
            canvasContext.globalCompositeOperation = "source-over";
            // canvasContext.lineTo(mouseInp.offsetX, mouseInp.offsetY); //get mouse pointer e
            canvasContext.lineTo(mouseInp.offsetX, mouseInp.offsetY); //get mouse pointer e
            canvasContext.stroke(); //draw line
            canvasContext.lineWidth = brushSize;
            // canvasContext.fillColor = selectedColor;
            // canvasContext.fillStyle = selectedColor;
            canvasContext.strokeStyle = selectedColor;
        break;

        case "Eraser":
            // console.log("Eraser Selected");
            // canvasContext.beginPath();
            canvasContext.globalCompositeOperation = "destination-out";
            canvasContext.lineWidth = brushSize;
            canvasContext.lineCap = "round";

            // canvasContext.beginPath();
            // canvasContext.moveTo(prevMouseX, prevMouseY);
            // canvasContext.lineTo(mouseInp.offsetX, mouseInp.offsetY);
            // canvasContext.stroke();
            // canvasContext.beginPath();
            // canvasContext.arc(mouseInp.offsetX, mouseInp.offsetY, brushSize / 2, 0, Math.PI * 2);
            // canvasContext.fill();

            // * Smoother eraser brush system
            let dx = mouseInp.offsetX - prevMouseX;
            let dy = mouseInp.offsetY - prevMouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let steps = Math.max(1, Math.floor(distance / (brushSize/2))); 

            for (let i = 0; i <= steps; i++){
                let x = prevMouseX + (dx * i / steps);
                let y = prevMouseY + (dy * i / steps);

                canvasContext.beginPath();
                canvasContext.arc(x, y, brushSize / 2, 0, Math.PI * 2);
                canvasContext.fill();
                canvasContext.closePath();
            }
            // canvasContext.closePath();
            prevMouseX = mouseInp.offsetX;
            prevMouseY = mouseInp.offsetY;
            break;
            
        

        default:
        DrawShape(mouseInp, currentToolSelected);
    }
}

const StartDrawing = (mouseInp) => {
    isMouseDown = true;
    
    if (currentToolSelected != "Image") SaveState();

    prevMouseX = mouseInp.offsetX;
    prevMouseY = mouseInp.offsetY;
    canvasContext.beginPath();
    canvasContext.lineWidth;
    snapshot = canvasContext.getImageData(0,0, canvas.width, canvas.height);

    if (currentToolSelected === "Font"){
        isTypingText = true;
        textX = mouseInp.offsetX;
        // textY = mouseInp.offsetY;
        textY = mouseInp.offsetY + parseInt(fontSizeInput.value) * 1.25;
        //set position of the hidden input box
        let fontSize = fontSizeInput.value + "px";
        let fontFam = fontFamilyInput.value;
        console.log("focused to text tool input");
        textToolInput.style.left = `${mouseInp.pageX}px`;
        textToolInput.style.top = `${mouseInp.pageY}px`;
        textToolInput.style.display = "block";
        textToolInput.value = "";
        textToolInput.style.color = selectedColor;
        textToolInput.style.fontSize = fontSize;
        textToolInput.style.fontFamily = fontFam;
        textToolInput.focus();
    } else {
        if (isTypingText) {
            textToolInput.style.display = "none"; //hide input text
            isTypingText = false;
            isMouseDown = false;
        }
    }

   
}



const OnToolButtonClicked = (toolButton, useId = false, toolId = "") => {
    // if (useId ? toolId : toolButton.id === lastSelectedTool) return;
    if (isOpeningFilePicker) return;
    document.querySelector(".options .active").classList.remove("active");

    if (useId) {
        document.getElementById(toolId).classList.add("active");
    } else 
        toolButton.classList.add("active");

    lastSelectedTool = currentToolSelected;
    currentToolSelected = useId ? toolId : toolButton.id;
    console.log("selected tool : ", currentToolSelected, " last selected tool : ", lastSelectedTool);


    updateCursor();

    // immedaitely open file picker if click on image tool
    if (currentToolSelected === "Image"){
        isOpeningFilePicker = true;
        document.getElementById("image-upload").click();
        if (isTypingText) {
            textToolInput.style.display = "none"; //hide input text
            isTypingText = false;
            isMouseDown = false;
        }
    }

    // disable font family and font size input when "text tool" isnt selected
    let fontStylingBox = document.querySelectorAll(".font-menu .options .horizontal-btns");
    fontStylingBox.forEach((element) => {
        element.querySelectorAll("select, input, button").forEach((child) => {
            child.disabled = currentToolSelected != "Font";
        });
    }); 
}

toolButtons.forEach(toolButton => {
    toolButton.addEventListener("click", () => {
          OnToolButtonClicked(toolButton);
    })
});

brushSizeSlider.addEventListener("change", () => {
    console.log(brushSizeSlider.value / 10);
    brushSize = brushSizeSlider.value / 10;
})

colorButtons.forEach(clr => {
    clr.addEventListener("click", ()=>{
        // console.log(clr.id);
        // * we can get the color of the colorbtn by using getPropertyValue
        selectedColor = window.getComputedStyle(clr).getPropertyValue("background-color");
        console.log(selectedColor);
        document.querySelector(".options .selected").classList.remove("selected");
        clr.classList.add("selected");

        // update text preview if the input is visible
        if (isTypingText == true){
            textToolInput.style.color = selectedColor;
        }
    })
});

menuButtons.forEach(btn => {

    btn.addEventListener("click", () => {
        console.log("Menu btn clicked:", btn.id);
        switch(btn.id) {
            case "btn-reset-canvas":
                canvasContext.clearRect(0,0,canvas.width, canvas.height);

                // clear undo & redo stack
                undoStack = [];
                redoStack = [];
                UpdateUndoAndRedoButton();
                break;

            case "btn-download-img":
                // https://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf
                const link = document.createElement("a");
                link.download = `${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
                break;
            case "undo-button":
                // console.log("undoBtn");
                UndoCnavas();
                break;
            case "redo-button":
                RedoCanvas();
                break;
        }
    });
});


// * Dynamic Cursor System
const updateCursor = () => {
    if (currentToolSelected === "Rectangle" || currentToolSelected === "Circle" || currentToolSelected === "Triangle"){
        canvas.style.cursor = "crosshair";
    } else if (currentToolSelected === "Eraser" || currentToolSelected === "Brush") {
        let size = brushSize *1.5;
        // canvas.style.cursor = `url('res/icons/cursor-brush-eraser.png') ${size /2} ${size/2}, auto`;
        // set min brush size (other wise it wont show up lol)
        // console.log(size);
        if (size < 12) size = 12;
        
        const cursorCanvas = document.createElement("canvas");
        const cursorCtx = cursorCanvas.getContext("2d");
        // * make it dynamically size following the brush size
        const img = new Image();
        img.src = "res/icons/brush-circle-cursorpreview.svg";

        img.onload = () => {
            cursorCanvas.width = size;
            cursorCanvas.height = size;
            cursorCtx.drawImage(img, 0, 0, size, size);
            canvas.style.cursor = `url(${cursorCanvas.toDataURL()}) ${size / 2} ${size / 2}, auto`;        }


    } else if (currentToolSelected === "Font") {
        canvas.style.cursor = "text";
    } else canvas.style.cursor = "default";

    // * image cursor handled above for dynamic resize/move cursor
    // } else if (currentToolSelected === "Image"){
    //     canvas.style.cursor = "move";
    
    
}



const OnKeyDown = (e) => {
    // console.log(e.key);
    if (currentToolSelected === "Font"  && isTypingText == true){
        if (e.key === "Enter" && inputFocus === "font-text-input"){
            DrawText(textToolInput.value, textX, textY); //draw text call
            textToolInput.style.display = "none"; //hide input text
            isTypingText = false;
            isMouseDown = false;
        } else if (e.key === "Escape"){
            textToolInput.style.display = "none"; //hide input text
            isTypingText = false;
            isMouseDown = false;
        }
    } else if (currentToolSelected === "Image" && isOnImageTransformationMode){
        if (e.key === "Enter"){
            acceptImgTransformation();
        } else if (e.key === "Escape"){
            cancelImgTransformation();
        }
    } else if (e.ctrlKey && e.key === "z"){
        e.preventDefault();
        UndoCnavas();
    } else if (e.ctrlKey && e.key === "y"){
        e.preventDefault();
        RedoCanvas();
    }
}

const UndoCnavas = () => {
    if (undoStack.length <= 0) return;
    redoStack.push(canvas.toDataURL());
    let prevState = undoStack.pop();
    UpdateCanvasState(prevState);
}

const RedoCanvas = () => {
    if (redoStack.length <= 0) return;
    undoStack.push(canvas.toDataURL());
    let nextState = redoStack.pop();
    UpdateCanvasState(nextState);
}

const UpdateCanvasState = (imgData) => {
    let img = new Image();
    img.src = imgData;
    img.onload = () => {

        // idea: clear the canvas first than draw the new updated img (either undo/redo)
        // ! Fix eraser bug
        canvasContext.globalCompositeOperation = "source-over"; // Reset mode to default
        canvasContext.clearRect(0,0,canvas.width, canvas.height);
        canvasContext.drawImage(img, 0, 0);
    }
    UpdateUndoAndRedoButton();
}

const UpdateUndoAndRedoButton = () => {
    if (!undoButton || !redoButton) return;
    undoButton.disabled = undoStack <= 0;
    redoButton.disabled = redoStack <= 0;
}

canvas.addEventListener("mousedown", (e) => {
    StartDrawing(e);
    CheckImgTransformation(e);
});
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
    isResizing = false;
    isDragging = false;
    // SaveState();
    // if (currentToolSelected === "Brush" || currentToolSelected === "Eraser"){
    //     SaveState();
    // }
});
canvas.addEventListener("mousemove", (e) => {
    DrawingEvent(e);
    ResizingImage(e);
    //dynamic cursor when change brush size
    if (currentToolSelected === "Brush" || currentToolSelected === "Eraser") updateCursor();
});

document.addEventListener("keydown", OnKeyDown);
fontFamilyInput.addEventListener("change", () => {

    //set preview font size if viible
    if (isTypingText){
        textToolInput.style.fontFamily = fontFamilyInput.value;
    }
});

fontSizeInput.addEventListener("change", () => {
    // clamp font size
    if (fontSizeInput.value < 10) fontSizeInput.value = 10;
    else if (fontSizeInput.value > 100) fontSizeInput.value = 100;

    if (isTypingText){
        textToolInput.style.fontSize = fontSizeInput.value + "px";
    }
})

textToolInput.addEventListener("focus", () => {inputFocus = textToolInput.id});
fontSizeInput.addEventListener("focus", () => {inputFocus = fontSizeInput.id});

UpdateUndoAndRedoButton();
