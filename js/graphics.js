
var cnc;
var cncCtx;

function drawBillet(billet) {
	
	cncCtx.fillStyle = billet.properties.color;
	cncCtx.fillRect(-billet.length, -billet.diameter/2, billet.length, billet.diameter);
}

function initSimulation() {
	cnc = document.getElementById("cnc");
	cncCtx = cnc.getContext("2d");
	tool = initTool('tools/tool.bmp');
}


// This will move the tool on a pre-defined path set in the PATH array. 
// fromIndex: the index in the path array from which to start drawing tool.
function moveTool(cncCtx, tool, path, fromIndex) {
	if(fromIndex >= path.length) return;

	if(fromIndex){
		drawGhostTool(cncCtx, tool, path[fromIndex-1]);
	} 
	
	drawTool(cncCtx, tool, path[fromIndex]);

	setTimeout(function() {
		moveTool(cncCtx, tool, path, fromIndex+1)
	}, 5);


}

//tool is a Tool object
//tool.toolCanvas
//tool.ghostCanvas
//tool.invertedGhostCanvas
//tool.width
//tool.height

function drawTool(ctx, tool, pos){

	//console.log('drawTool[x=' + pos.x + ",z=" + pos.z + "]");
	// Z is horizontal & X is Vertical
	var posZ = pos.z;
	var posX = -pos.x - tool.height;

	ctx.drawImage(tool.toolCanvas, posZ, posX);
}

function drawGhostTool(ctx, tool, pos){
	var posX = -pos.x - tool.height;
	// console.log('ghost' + pos.x);
	ctx.drawImage(tool.ghostCanvas, pos.z, posX);
	
	// drawing inverted ghost
	
	 ctx.drawImage(tool.invertedGhostCanvas, pos.z, pos.x);
}

function initTool(imgPath){
	//Creating img tag
	var toolImg = document.createElement('img');
	toolImg.src = imgPath;
	
	var canvas = document.createElement("canvas");
	canvas.width = toolImg.width;
	canvas.height = toolImg.height;
	var ctx = canvas.getContext('2d');
	
	// drawing tool image on a temp canvas
	ctx.drawImage(toolImg, 0, 0);
	
	var toolData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var ghostData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	// Tool: Removing rgb(255,0,255) color from the BMP image and make it transparent
	// Ghost: Removing rgb(255,0,255) color from the BMP image and make it transparent, and making non magenta color pixel to white (background color)
	for (var i = 0; i < toolData.data.length; i += 4) {
		if (toolData.data[i] === 255 && toolData.data[i + 1] === 0 && toolData.data[i + 2] === 255) {
			toolData.data[i + 3] = 0;
			ghostData.data[i + 3] = 0;
		} else {
			ghostData.data[i] = 255;
			ghostData.data[i + 1] = 255;
			ghostData.data[i + 2] = 255;
			ghostData.data[i + 3] = 255;
		}
	}
	
	// Making temp canvas to get rid of transparnt issue
	var toolCanvas = document.createElement("canvas");
	toolCanvas.width = toolImg.width;
	toolCanvas.height = toolImg.height;
	var toolCanvasCtx = toolCanvas.getContext('2d');
	toolCanvasCtx.putImageData(toolData, 0, 0);

	// Making temp canvas to get rid of transparnt issue
	var ghostCanvas = document.createElement("canvas");
	ghostCanvas.height = toolImg.height;
	ghostCanvas.width = toolImg.width;
	var ghostCanvasCtx = ghostCanvas.getContext('2d');
	ghostCanvasCtx.putImageData(ghostData, 0, 0);

	// Making temp canvas to get rid of transparnt issue
	var invertedGhostCanvas = document.createElement("canvas");
	invertedGhostCanvas.height = toolImg.height;
	invertedGhostCanvas.width = toolImg.width;
	var invertedGhostCanvasCtx = invertedGhostCanvas.getContext('2d');
	invertedGhostCanvasCtx.translate(0, toolImg.height);
	invertedGhostCanvasCtx.scale(1,-1);
	invertedGhostCanvasCtx.drawImage(ghostCanvas,0,0);
	
	
	// Making tool object
	var tool = {
		width: toolImg.width,
		height: toolImg.height,
		toolCanvas: toolCanvas,
		ghostCanvas: ghostCanvas,
		invertedGhostCanvas: invertedGhostCanvas
	}
	
	return tool;
}