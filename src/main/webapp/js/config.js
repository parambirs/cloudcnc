var config = (function(){
	"use strict";
	return {
		homeProperties: {
			toolbarHeight: 40,
			footerHeight: 30,
			editorWidth: 300,
			lineNumbersWidth: 30,
			lineHeight: 20
		},

		billetProperties: {
			color: '#6C87B7',
			highlightColor: '#AAC3EE'
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