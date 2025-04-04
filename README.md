# Software Studio 2025 Spring
## Assignment 01 Web Canvas


### Scoring

| **Basic components** | **Score** | **Check** |
| :------------------- | :-------: | :-------: |
| Basic control tools  |    30%    |     Y     |
| Text input           |    10%    |     Y     |
| Cursor icon          |    10%    |     Y     |
| Refresh button       |    5%     |     Y     |

| **Advanced tools**     | **Score** | **Check** |
| :--------------------- | :-------: | :-------: |
| Different brush shapes |    15%    |     Y     |
| Un/Re-do button        |    10%    |     Y     |
| Image tool             |    5%     |     Y     |
| Download               |    5%     |     Y     |

| **Other useful widgets** | **Score** | **Check** |
| :----------------------- | :-------: | :-------: |
| Image Resizing & Move System           |   1~5%    |    Y      |
| Resizable Dynamic Cursor for brush & eraser           |   1~5%    |    Y      |
| Canvas Resize           |   1~5%    |    Y      |

---

### How to use 

The web divided into 2 part, the toolbar and the drawing canvas.
The drawing canvas is responsive meaning you can resize the canvas as anything youwant and you can scroll through it.

**1. Toolbar Menu**
- Shapes -> Rectangle, Circle, Triangle (all supports fill shape color). Choose the color first (default color: black)
- Mode -> Brush, Eraser, Import Image
- Font -> Press on the Text Tool first to enable font style editing (you can change the font and the size)
- Colors -> You can pick from the color square or just press on the circle (quick access)
- Canvas -> You can resize the canvas both on X and Y axis, click Apply. There is also Clear Canvas button
- Tools -> Undo / Redo, Download

**2. Drawing on the Canvas**
- Brush -> You can choose the size of the brush and set the color as anything you like
- Eraser -> I use the globalCompositeOperation method, so it will correctly erase anything.
- Shapes -> Choose between rectangle, circle or triangle and start drawing on the canvas by clicking on it. Release the mouse button to stop drawing and it will fix the shape in place.
- Text -> You can change the font family and font size if you are on the text tool mode, so click on text tool mode first before changing. Text preview will be previewed in real-time (including the size & font also)

**3. Image Insertion**
 - Click the Import Image button to open a file dialog and you can choose any image there
 - The web will be in "Image Transformation Mode" that you can resize and move the image freely in the canvas (you can't press on any other tool until you confirm).
- You will see a small menu appears on the top of the screen (X and Y button). X will cancel the image import and Y will fix the image in place

**4. Color Selection**
 - Pick a color from the color square (click on it) and the selected color will change (indicated by the square below). You can also pick the color from the quick access color picker (the circle)

**5. Undo/Redo**
 - Undo: Click the Undo button to revert the last drawing action. The stack has a limit of 25 to save performance
 - Redo: CLick the redo button to revert to the next drawing.
Both undo & redo button will be disabled if the stack is empty.

**6. Canvas Adjustment**
 - You can set both X and Y size of the canvas there. After you change those number, the apply button will be enabled and you can click on Apply. The canvas will now resizes.
 - Clear Canvas -> This will clear everything on the canvas including the undo/redo stack.

**7. Download**
This will save the snapshots of the canvas (including its size) and will be downloaded as png

### Bonus Function description

**1. Image Resizing & Move System**
As I said before, when you import an image, it will be on "image transformation" mode where you can resize/move the image freely in the canvas.

**2. Resizable Dynamic Cursor for brush & eraser**
When you are on either brush/eraser mode, then you modify the size of the brush, the dynamic cursor will also follow the size of brush.

**3. Canvas Resize**
You can freely resize the canvas size



### Web page link

Project Console: https://console.firebase.google.com/u/0/project/ss-hw1-112006223/overview

Hosting URL: https://ss-hw1-112006223.firebaseapp.com/

### Others (Optional)
- color square won't work on the (.webapp) so I give you the firebaseapp.com

Thank you TA!

