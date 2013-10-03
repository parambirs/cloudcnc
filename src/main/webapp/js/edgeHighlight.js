var edgeHighlighter = function(ctx, billet){

	// var billetImgData = ctx.getImageData(0, ctx.canvas.height / 2 - billet.radius - 1, billet.length, billet.radius + 1);

	var billet2dData = get2DData(ctx.getImageData(0, ctx.canvas.height / 2 - billet.radius - 1, billet.length, billet.radius + 1));

	var get2DData() = function(){
		var array2D = [];
		
	}

	var DIRECTION = {
		DOWN:  0,
		RIGHT: 1,
		UP: 2	
	};

	var getUpPixel
	var getNextDirection = function(i){
		
	};

	var getNextPoint = function(i, direction){
		if(direction === DIRECTION.DOWN){
			
			i = i + billet.length*4;
		} else if (direction === DIRECTION.RIGHT){

			i = i + 4;
		} else if (direction === DIRECTION.UP) {
			i = i - billet.length*4;
		}

	};

	function componentToHex(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {

	    return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
	}

	function isBilletPixel(i) {
		var color = rgbToHex(billetImgData.data[i], billetImgData.data[i+1], billetImgData.data[i+2]);
		// console.log('color = ' + color);
		return color === billet.properties.color.toUpperCase();
	}

	var edgePoints = [];

	for (var i = 0; i < billetImgData.data.length; i += 4) {
		if(isWhitePixel(i)) {
			
			billetImgData.data[i] = 0;
			billetImgData.data[i+1] = 255;
			billetImgData.data[i+2] = 0;
			billetImgData.data[i+3] = 128;
		} else {
			billetImgData.data[i] = 0;
			billetImgData.data[i+1] = 0;
			billetImgData.data[i+2] = 255;
			billetImgData.data[i+3] = 128;
		}
	}

	
	

	ctx.putImageData(billetImgData, 50, 50);

	return {
		highlight: function() {
			var i = 0;
			var direction = DIRECTION.DOWN;
			while(i < billet.length){
				direction = getNextDirection(i);
				i = getNextPoint(i, direction);
			}
		}
	};
}();
