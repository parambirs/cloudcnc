

var graphics = (function(){
	'use strict';
	var cnc;
	var cncCtx;
	var tool;

	var initTool = function (imgPath){
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

	return{

		reset : function(){
			console.log('graphics: reset called');
			cncCtx.restore();	
			delete context.prevPoint;
		},

		initSimulation: function(){
			cnc = document.getElementById(context.getCncCanvasId());
			cncCtx = cnc.getContext("2d");
			tool = initTool(context.getToolImage());
		},

		drawBillet: function(billet){
			cncCtx.save();
			cncCtx.translate(billet.length, Math.ceil(cnc.height/2));
			cncCtx.fillStyle = billet.properties.color;
			cncCtx.fillRect(-billet.length, -billet.radius, billet.length, billet.radius*2);
		},

		drawTool: function(pos){

			// Z is horizontal & X is Vertical
			var posZ = pos.z;
			var posX = -pos.x - tool.height;

			cncCtx.drawImage(tool.toolCanvas, posZ, posX);
		},

		drawGhostTool: function(pos){
			var posX = -pos.x - tool.height;
			// console.log('ghost' + pos.x);
			cncCtx.drawImage(tool.ghostCanvas, pos.z, posX);
			
			// drawing inverted ghost			
			 cncCtx.drawImage(tool.invertedGhostCanvas, pos.z, pos.x);
		},

		clear: function() {
			if(cnc) {
				cnc.width = cnc.width;
			}
		}
	};
})();




