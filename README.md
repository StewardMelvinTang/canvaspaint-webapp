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
| Fill funcrtion           |   1~5%    |    Y      |


---

### How to use 

1.	Tool Selection
 - Sidebar Tools:
On the left sidebar, you will find several tool buttons:
 - Brush: Draw freehand lines.
 - Eraser: Erase parts of your drawing.
 - Text: Click anywhere on the canvas to add text.
 - Shapes: Buttons for drawing shapes such as Circle, Rectangle, and Triangle.
 - Image Insertion: A button (with a custom icon) to upload an image.
 - Brush Size Slider: Adjust the brush stroke size using the vertical slider.
 - Color Picker: Click the color display to open the color picker modal.

2.	Drawing on the Canvas
- Freehand Drawing (Brush):
Select the Brush tool and use the mouse to draw freehand. Adjust the stroke width using the slider.
 - Erasing:
Choose the Eraser tool to clear portions of your drawing by dragging over them.
 - Text Input:
Select the Text tool and click on the canvas where you want your text to appear. A text input field will appear; type your text and press Enter (or click outside) to render it on the canvas.
 - Shape Drawing:
Select one of the Shape tools (Circle, Rectangle, Triangle). Click and drag on the canvas to create a preview of the shape as you move the mouse. When you release the mouse button, the final shape is drawn.

3.	Image Insertion
 - Click the image insertion button (displayed with the custom “insert_image.png” icon) to open a file dialog.
 - Select an image file. The application will resize the canvas to match the image’s original dimensions and center the image in the canvas container.

4.	Color Selection
 - Click the Color button (which shows the current color) on the sidebar to open the color picker modal.
 - Use the color wheel to choose a color, or type a Hex value or RGB value into the provided input fields. The selected color is immediately applied to your drawing tools and displayed in the color indicator.

5.	Undo/Redo
 - Undo: Click the Undo button to revert the last drawing action. You can keep pressing Undo to step back through your drawing history until the canvas is empty.
 - Redo: If you have undone an action, click the Redo button to restore the most recent undone action.

6.	Refresh and Download
 - Refresh: Click the Refresh button to clear the canvas completely. This resets the drawing history so you can start fresh.
 - Download: Click the Download button to save your current canvas drawing as an image file (PNG).

### Bonus Function description

Fill-in Mode

The Fill-in (or Fill) mode is an additional feature that allows you to fill shapes with the selected color:
 - How It Works:
When Fill-in mode is enabled (via the bonus toggle you can add to your sidebar), drawing a shape (Circle, Rectangle, or Triangle) will render it filled with the current color rather than just an outline.
 - Usage:
	1.	Activate Fill-in mode by checking the Fill toggle button.
	2.	Select a shape tool (e.g., Circle) from the sidebar.
	3.	Click and drag on the canvas. While dragging, you’ll see a preview of the shape; once you release the mouse button, the shape will be drawn filled with the chosen color.


### Web page link

Project Console: https://console.firebase.google.com/project/software-studio-3c5ce/overview
Hosting URL: https://software-studio-3c5ce.web.app

### Others (Optional)

Thanks!

<style>
table th{
    width: 100%;
}
</style>
