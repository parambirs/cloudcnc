var config = (function(){
	"use strict";
	return {
		homeProperties: {
			toolbarHeight: 40,
			footerHeight: 30,
			editorWidth: 300,
			lineNumbersWidth: 30
		},

		billetProperties: {
			color: '#6D7372'
		}
	}
})();


var context = (function(){
	"use strict";
	var cncCanvasDivId = "cncCanvas";
	var toolImage = "tools/tool.bmp";
	return {
		getCncCanvasId : function(){
			return cncCanvasDivId;
		},

		getToolImage : function(){
			return toolImage;
		}
	};
})();