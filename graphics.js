
function drawBillet(ctx, billet) {
	
	ctx.fillStyle = billet.color;
	ctx.fillRect(-billet.length, -billet.diameter/2, billet.length, billet.diameter);
}

function initSimulation() {
	var cnc = document.getElementById("cnc");
	var cncCtx = cnc.getContext("2d");
	var billet = {color: "#f00", length: 400, diameter: 200};
	cncCtx.translate(billet.length, cnc.height/2);
	drawBillet(cncCtx, billet);

	var tool = initTool('tools/tool.bmp');

	moveTool(cncCtx, tool, 0, billet.diameter/2-5, -billet.length, billet.diameter/2-5);
	//drawTool(cncCtx, tool, {x: 0, z: billet.diameter/2});
	//drawGhostTool(cncCtx, tool, {x: -50, z: billet.diameter/2})
}


function moveTool(cncCtx, tool, xi, zi, x, z) {


	drawGhostTool(cncCtx, tool, {x: xi+1, z: zi});
	drawTool(cncCtx, tool, {x: xi, z: zi});

	setTimeout(function() {
		moveTool(cncCtx, tool, xi-1, zi, x, z)
	}, 20);


}

//tool is a Tool object
//tool.toolCanvas
//tool.ghostCanvas
//tool.invertedGhostCanvas
//tool.width
//tool.height

function drawTool(ctx, tool, pos){

	// console.log('tool' + pos.x);
	var posZ = -pos.z - tool.height;
	ctx.drawImage(tool.toolCanvas, pos.x, posZ);
}

function drawGhostTool(ctx, tool, pos){
	var posZ = -pos.z - tool.height;
	// console.log('ghost' + pos.x);
	ctx.drawImage(tool.ghostCanvas, pos.x, posZ);
	
	// drawing inverted ghost
	
	 ctx.drawImage(tool.invertedGhostCanvas, pos.x, pos.z);
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