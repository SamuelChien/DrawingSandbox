//Constant for the shape state
var RECTANGLE_SHAPE 	= 1;
var LINE_SHAPE 			= 2;
var TRIANGLE_SHAPE 		= 3;
var SELECT_MODE			= 4;

//Shape object represents different shape on the canvas
function Shape(currentShape, currentColor, currentOutlineColor, currentOutlineWidth, startingX, startingY) 
{
  	this.shapeState = currentShape;
	this.colorState = currentColor;
	this.outlineColorState = currentOutlineColor;
	this.outlineWidth = currentOutlineWidth;
	this.startingX = startingX;
	this.startingY = startingY;
	this.widthLength = 0;
	this.heightLength = 0;
	this.beenSelected = 0;
}
//Prints out the shape object to the canvas
Shape.prototype.print = function()
{
  	if(this.shapeState == RECTANGLE_SHAPE)
	{
		$("#myCanvas").drawRect({
			fillStyle: this.colorState,
			strokeStyle: this.outlineColorState,
			strokeWidth: this.outlineWidth + this.beenSelected * 10,
		  	x: this.startingX + this.widthLength/2, y: this.startingY + this.heightLength/2,
		  	width: this.widthLength,
		  	height: this.heightLength
		});
	}
	else if (this.shapeState == LINE_SHAPE)
	{
		$("#myCanvas").drawLine({
			strokeStyle: this.outlineColorState,
			strokeWidth: this.outlineWidth + this.beenSelected * 10,
		  	x1: this.startingX, y1: this.startingY,
		  	x2: this.startingX + this.widthLength, y2: this.startingY + this.heightLength
		});
	}
	else if (this.shapeState == TRIANGLE_SHAPE)
	{
		$("#myCanvas").drawPolygon({
			fillStyle: this.colorState,
			strokeStyle: this.outlineColorState,
			strokeWidth: this.outlineWidth + this.beenSelected * 10,
		  	x: this.startingX + this.widthLength/2, y: this.startingY + this.heightLength/2,
		  	radius: this.widthLength/2,
		  	sides: 3
		});
	}
};
//Given x, y coordinate, return if this shape contains this point
Shape.prototype.contain = function(clickingX, clickingY)
{
  	if(this.shapeState == RECTANGLE_SHAPE)
	{
		return this.inRectangle(clickingX, clickingY);
	}
	else if (this.shapeState == LINE_SHAPE)
	{			
		return this.inLine(clickingX, clickingY);
	}
	else if (this.shapeState == TRIANGLE_SHAPE)
	{	
		return this.inTriangle(clickingX, clickingY);
	}
};
//If the shape is rectangle, check if a point is in rectangle
Shape.prototype.inRectangle = function(clickingX, clickingY)
{
	if(this.startingX < this.startingX + this.widthLength)
	{
		var leftX 	= this.startingX;
		var rightX 	= this.startingX + this.widthLength;
	}
	else
	{
		var leftX 	= this.startingX + this.widthLength;
		var rightX 	= this.startingX;
	}
	
	if(this.startingY < this.startingY + this.heightLength)
	{
		var leftY 	= this.startingY;
		var rightY 	= this.startingY + this.heightLength;
	}
	else
	{
		var leftY 	= this.startingY + this.heightLength;
		var rightY 	= this.startingY;
	}		
	if(clickingX > leftX && clickingX < rightX &&  clickingY > leftY && clickingY < rightY)
		return 1;
	else
		return 0;
}
// If the shape is a line object, check if the cordinate is in the line object.
Shape.prototype.inLine = function(clickingX, clickingY)
{
	//check if the point is close to the line by finding the triangle area between dot and line
	var triangleArea = this.getTriangleAreaByThreePoint(this.startingX, this.startingY, this.startingX + this.widthLength, this.startingY + this.heightLength, clickingX, clickingY);
	if(triangleArea < 700)
		return 1;
	else
		return 0;
}
//If the shape is a triangle object, check if the cordinate is in the triangle object.
Shape.prototype.inTriangle = function(clickingX, clickingY)
{
	//Since we know center to the outer 3 dot of triangle is this.widthLength/2(radius), we can use
	//trignometry to find the exact x and y of all three points.
	var xIncrement = this.widthLength/2 * Math.sqrt(3)/2;
	var yIncrement = this.widthLength/4
	
	var x1 = this.startingX + this.widthLength/2;
	var y1 = this.startingY;
	var x2 = this.startingX + this.widthLength/2 + xIncrement;
	var y2 = this.startingY + this.heightLength/2 + yIncrement;
	var x3 = this.startingX + this.widthLength/2 - xIncrement;
	var y3 = this.startingY + this.heightLength/2 + yIncrement;
	
	var triangle1 = this.getTriangleAreaByThreePoint(x1, y1, x2, y2, clickingX, clickingY);
	var triangle2 = this.getTriangleAreaByThreePoint(x2, y2, x3, y3, clickingX, clickingY);
	var triangle3 = this.getTriangleAreaByThreePoint(x3, y3, x1, y1, clickingX, clickingY);
	var triangle4 = this.getTriangleAreaByThreePoint(x1, y1, x2, y2, x3, y3);
	
	//if clicking inside triangle, then sum of triangle 1, 2, 3 should be same as 4.
	if(triangle1 + triangle2 + triangle3 - triangle4 < 700)
		return 1;
	else
		return 0;
}
//Get triangle's area by 3 points.
Shape.prototype.getTriangleAreaByThreePoint = function(x1, y1, x2, y2, x3, y3)
{
	var lengthA = this.getLengthByTwoPoint(x1, y1, x2, y2);
	var lengthB = this.getLengthByTwoPoint(x2, y2, x3, y3);
	var lengthC = this.getLengthByTwoPoint(x3, y3, x1, y1);
	return this.getTriangleAreaBySideLength(lengthA, lengthB, lengthC);
}
//Get the length of a line by 2 points
Shape.prototype.getLengthByTwoPoint = function(x1, y1, x2, y2)
{
	//use formula c^2 = a^2 + b^2
	var a = x2 - x1;
	var b = y2 -y1;
	return Math.sqrt(a*a + b*b);
}
//Get triangle's area with length of its side.
Shape.prototype.getTriangleAreaBySideLength = function(lengthA, lengthB, lengthC)
{
	//use Heron Forumula
	var s = (lengthA + lengthB + lengthC)/2;
	return Math.sqrt(s*(s-lengthA)*(s-lengthB)*(s-lengthC));
}

//Select object is the main object that execute the program and detect user mouse event.
function SelectedObject()
{
	this.offset 			= $("#myCanvas").offset();
	this.shapeList 			= new Array();
	this.mouseStillDown 	= false;
	this.selectedShapeState = RECTANGLE_SHAPE;
	this.insideColorState 	= "#000";
	this.outlineColorState 	= "#000";
	this.outlineWidthLength = 1;
	this.draggableState		= 0;
	this.dragStartingX		= 0;
	this.dragStartingY		= 0;
}
//Initialize the program with different UI events.
SelectedObject.prototype.initialize = function()
{
	//set the parent variable so it can be see anywhere in this function
	var parent = this;
	//Initialize the outline canvas with a thin line.
	$("#outlineWidthCanvas").drawLine({
		strokeStyle: this.outlineColorState,
		strokeWidth: this.outlineWidthLength,
	  	x1: 10, y1: 150,
	  	x2: 390, y2: 150
	});
	//If width slider change, the line on canvas should change too.
	$('#widthSlider').change( function() {
		$("#outlineWidthCanvas").clearCanvas();
		$("#outlineWidthCanvas").drawLine({
			strokeStyle: parent.outlineColorState,
			strokeWidth: parseInt(this.value),
		  	x1: 10, y1: 150,
		  	x2: 390, y2: 150
		});
		$("#widthSizeIndicator").text(this.value);
	});
	//detect the mouseDown event on canvas.
	$("#myCanvas").mousedown(function(e) {
		parent.mouseStillDown = true;
		//If user is not in a select mode, create shape to shapelist.
		if(parent.selectedShapeState != SELECT_MODE)
		{
			var startingX = e.clientX - parent.offset.left;
			var startingY = e.clientY - parent.offset.top;
			var newShape = new Shape(parent.selectedShapeState, parent.insideColorState, parent.outlineColorState, parent.outlineWidthLength, startingX, startingY);
			parent.shapeList[parent.shapeList.length] = newShape;
		}
		//if user is in a select mode, then check if it press a shape
		else
		{
			var clickingX = e.clientX - parent.offset.left;
			var clickingY = e.clientY - parent.offset.top;
			//if user click on a shape, then move it to the top and enable dragging.
			parent.draggableState = parent.moveShapeToFront(clickingX, clickingY);
			if (parent.draggableState)
			{
				$("#selectedToolbar").show();
				parent.dragStartingX = e.clientX - parent.offset.left;
				parent.dragStartingY = e.clientY - parent.offset.top;
			}
			else
			{
				//if user didn't click on an object, make sure deselect everything.
				parent.cleanUpSelect();
			}
		}
	});
	//This handle all the event happens during dragging.
	$("#myCanvas").mousemove(function(e){
		//if down event is never register on canvas, do nothing
	    if(!parent.mouseStillDown) {return;}
		//if it's in a draggable state, then start dragging the selected shape
		else if(parent.draggableState)
		{
			var currentShape 	= parent.shapeList[parent.shapeList.length-1];
			var currentX 		= e.clientX - parent.offset.left;
			var currentY 		= e.clientY - parent.offset.top;
			var differenceX		= currentX - parent.dragStartingX;
			var differenceY		= currentY - parent.dragStartingY;
			parent.dragStartingX= currentX;
			parent.dragStartingY= currentY;
			currentShape.startingX += differenceX;
			currentShape.startingY += differenceY;
		}
		//This handles the case for resizing and new shape. To resize, simply select the shape then click
		//ouside the shape and drag.
		else
		{
			var currentX = e.clientX - parent.offset.left;
			var currentY = e.clientY - parent.offset.top;
			var currentShape = parent.shapeList[parent.shapeList.length-1];
			currentShape.widthLength = currentX - currentShape.startingX;
			currentShape.heightLength = currentY - currentShape.startingY;
		}
		$("#myCanvas").clearCanvas();
		parent.drawCanvas();
	});
	//Handle mouse up event
	$("#myCanvas").mouseup(function(e) {
	    parent.mouseStillDown = false;
	});
	//handle style button click event
	$("#colorBtn").click(function() {
		$("#colorChooser").show();
		parent.cleanUpSelect();
	});
	//handle rectangle button click event
	$("#rectangleBtn").click(function() {
		parent.selectedShapeState = RECTANGLE_SHAPE;
		parent.cleanUpSelect();
	});
	//handle triangle button click event
	$("#triangleBtn").click(function() {
		parent.selectedShapeState = TRIANGLE_SHAPE;
		parent.cleanUpSelect();
	});
	//handle line button click event
	$("#lineBtn").click(function() {
		parent.selectedShapeState = LINE_SHAPE;
		parent.cleanUpSelect();
	});
	//handle select button click event
	$("#selectBtn").click(function() {
		parent.selectedShapeState = SELECT_MODE;
	});
	//handle clear canvas button click event
	$("#clearCanvas").click(function() {
		parent.shapeList = new Array();
		parent.cleanUpSelect();
	});
	//handle select tag in style div
	$("#styleSwitch").change(function() {
		$("#fillColor").hide();
		$("#outlineColor").hide();
		$("#outlineWidth").hide();
		var selectedTag = $(this).val();
		if(selectedTag == "Fill Color")
		{
			$("#fillColor").show();
		}
		else if(selectedTag == "Outline Color")
		{
			$("#outlineColor").show();
		}
		else
		{
			$("#outlineWidth").show();
		}

	});
	//handle delete button after shape is been selected
	$("#deleteBtn").click(function() {
		parent.shapeList.splice(parent.shapeList.length - 1, 1);
		parent.cleanUpSelect();
	});
	//handle copy button after shape is been selected
	$("#copyBtn").click(function() {
		console.log("ye");
		var topShape = parent.shapeList[parent.shapeList.length - 1];
		var newShape = new Shape(topShape.shapeState, topShape.colorState, topShape.outlineColorState, topShape.outlineWidth, 50, 50);
		newShape.widthLength = topShape.widthLength;
		newShape.heightLength = topShape.heightLength;
		newShape.beenSelected = 0;
		parent.shapeList[parent.shapeList.length] = newShape;
		$("#myCanvas").clearCanvas();
		parent.drawCanvas();
	});
	//handle fill color submit button
	$("#submitBtn").click(function() {
		parent.insideColorState = $("#colorCodeBox").val();
		parent.outlineColorState = $("#outlineColorCodeBox").val();
		parent.outlineWidthLength = parseInt($('#widthSlider').val());
		$("#colorChooser").hide();
	});
	//handle outline color submit button
	$("#outlineSubmitBtn").click(function() {
		parent.insideColorState = $("#colorCodeBox").val();
		parent.outlineColorState = $("#outlineColorCodeBox").val();
		parent.outlineWidthLength = parseInt($('#widthSlider').val());
		$("#colorChooser").hide();
	});
	//handle width submit submit button
	$("#widthSubmitBtn").click(function() {
		parent.insideColorState = $("#colorCodeBox").val();
		parent.outlineColorState = $("#outlineColorCodeBox").val();
		parent.outlineWidthLength = parseInt($('#widthSlider').val());
		$("#colorChooser").hide();
	});
	//handle slider events
	$('#slider1').change( function() {
		parent.updateColor('#sliderValue1', this.value);
	});

	$('#slider2').change( function() {
		parent.updateColor('#sliderValue2', this.value);
	});

	$('#slider3').change( function() {
	    parent.updateColor('#sliderValue3', this.value);
	});

	$('#outlineSlider1').change( function() {
	    parent.updateOutlineColor('#outlineSliderValue1', this.value);
	});

	$('#outlineSlider2').change( function() {
	    parent.updateOutlineColor('#outlineSliderValue2', this.value);
	});

	$('#outlineSlider3').change( function() {
	    parent.updateOutlineColor('#outlineSliderValue3', this.value);
	});
}
//move the select shape to the front
SelectedObject.prototype.moveShapeToFront = function(clickingX, clickingY)
{
	var success = 0;
	var objectIndex = -1;
	//loop through the array and find the index of the object that's selected
	for (var indexCount = 0; indexCount < this.shapeList.length; indexCount++) {
	    if(this.shapeList[indexCount].contain(clickingX, clickingY))
		{
			objectIndex = indexCount;
			success = 1;
		}
	}
	//move the shape to top
	if(success == 1)
	{
		this.originalAllShape();
		var clickShape = this.shapeList[objectIndex];
		clickShape.beenSelected = 1;
		this.shapeList[this.shapeList.length] = clickShape;
		this.shapeList.splice(objectIndex, 1);
		$("#myCanvas").clearCanvas();
		this.drawCanvas();
	}
	else
	{
		this.originalAllShape();
		$("#myCanvas").clearCanvas();
		this.drawCanvas();
	}
	return success;
}
//turn selected shape to original outline width
SelectedObject.prototype.originalAllShape = function()
{
	for (var indexCount = 0; indexCount < this.shapeList.length; indexCount++) {
		this.shapeList[indexCount].beenSelected = 0;
	}
}
//draw the canvas by looping through the array
SelectedObject.prototype.drawCanvas = function()
{
	for (var indexCount = 0; indexCount < this.shapeList.length; indexCount++) {
	    this.shapeList[indexCount].print();
	}
}
//Clean up and deselect all the shape
SelectedObject.prototype.cleanUpSelect = function()
{
	this.draggableState = 0;
	$("#selectedToolbar").hide();
	this.originalAllShape();
	$("#myCanvas").clearCanvas();
	this.drawCanvas();
}
//Update the fill color
SelectedObject.prototype.updateColor = function(sliderValueID, sliderValue)
{
	var hexValue = Math.ceil(255 * sliderValue/100);
	var hexString = hexValue.toString(16);
	if(hexString.length == 1)
	{
		hexString = "0" + hexString;
	}
    $(sliderValueID).html(hexString.toUpperCase());
	
	var newColorCode = "#" + $('#sliderValue1').text() + $('#sliderValue2').text() + $('#sliderValue3').text();
	$("#colorDiv").css("background-color", newColorCode);
	$("#colorCodeBox").val(newColorCode);
}
//Update the outline color
SelectedObject.prototype.updateOutlineColor = function(sliderValueID, sliderValue)
{
	var hexValue = Math.ceil(255 * sliderValue/100);
	var hexString = hexValue.toString(16);
	if(hexString.length == 1)
	{
		hexString = "0" + hexString;
	}
    $(sliderValueID).html(hexString.toUpperCase());
	
	var newColorCode = "#" + $('#outlineSliderValue1').text() + $('#outlineSliderValue2').text() + $('#outlineSliderValue3').text();
	$("#outlineColorDiv").css("background-color", newColorCode);
	$("#outlineColorCodeBox").val(newColorCode);
}

var main = new SelectedObject();
main.initialize();
