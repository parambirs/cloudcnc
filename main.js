

var billet = {
	length: 400,
	diameter: 200
}

var tool = {
	tipx: 0,
	tipy: 0
}




function loadTool(image) {
	var tool = document.createElement('img');

	tool.src = 'tools/tool.bmp';

	var c = document.createElement("canvas");
	c.width = tool.width;
	c.height = tool.height;
	var ctx = c.getContext("2d");
	ctx.drawImage(tool, 0, 0);

	

	var cnc = document.getElementById("cnc");


	var cncCtx = cnc.getContext("2d");


	// moveTool(toolData, ghostData, cncCtx, 200, 200, 0, 0);

	//cncCtx.clearRect(200, 200, toolData.width, toolData.height);


	var tempCanvas = document.createElement("canvas");
	var tempCtx = tempCanvas.getContext("2d");
	tempCtx.putImageData(toolData, 0, 0);

	var tempGostCanvas = document.createElement("canvas");
	var tempGostCtx = tempGostCanvas.getContext("2d");
	tempGostCtx.putImageData(ghostData, 0, 0);


	moveTool(tempCanvas, tempGostCanvas, cncCtx, 200, 200, 0, 0);

	//cncCtx.drawImage(tempCanvas, 200,200);


	//cncCtx.putImageData(ghostData,100,200);		 

	//document.getElementById('temp').appendChild(tool);
}

function moveTool(cncCtx, tool, xi, zi, x, z) {


	drawGhostTool(cncCtx, tool, {x: xi+1, z: zi});
	drawTool(cncCtx, tool, {x: xi, z: zi});

	

	setTimeout(function() {
		moveTool(cncCtx, tool, xi-1, zi, x, z)
	}, 0);


}

window.onload = function(){
	$('#cnc').get(0).width = $('#canvasDiv').width();
	$('#cnc').get(0).height = $('#canvasDiv').height();
	initSimulation();
}


function initTool(imgPath){
	//Creating img tag
	var toolImg = document.createElement('img');
	toolImg.src = imgPath;
	
	var canvas = document.createElement("canvas");
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



