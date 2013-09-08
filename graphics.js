function drawBillet(ctx, billet) {
	
	//var ctx = canvas.getContext("2d");
	ctx.fillStyle = billet.color;
	ctx.fillRect(-billet.length, -billet.diameter / 2, billet.length, billet.diameter);
}


function initSimulation() {
	var cnc = document.getElementById("cnc");
	var cncCtx = cnc.getContext("2d");
	var billet = {color: "#ff0000", length: 400, diameter: 200};
	cncCtx.translate(billet.length, cnc.height/2);
	drawBillet(cncCtx, billet);
	var tool = initTool('tools/tool.bmp');
	moveTool(cncCtx, tool, 0, billet.diameter/2-5, -billet.length, billet.diameter/2-5);
	//drawTool(cncCtx, tool, {x: 0, z: billet.diameter/2});
	//drawGhostTool(cncCtx, tool, {x: -50, z: billet.diameter/2})
}


//tool is a Tool object
//tool.toolCanvas
//tool.ghostCanvas
//tool.invertedGhostCanvas
//tool.width
//tool.height

function drawTool(ctx, tool, pos){

	var posZ = -pos.z - tool.height;
	ctx.drawImage(tool.toolCanvas, pos.x, posZ);
}

function drawGhostTool(ctx, tool, pos){
	var posZ = -pos.z - tool.height;
	ctx.drawImage(tool.ghostCanvas, pos.x, posZ);
	
	// drawing inverted ghost
	
	ctx.drawImage(tool.invertedGhostCanvas, pos.x, pos.z);
}