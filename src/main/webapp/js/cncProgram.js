var programHandler = (function(){
	"use strict";
	var program;
	var codeLines;
	var currentLine = -1;
	var billet;
	var breakPoints = {}
	var isStopped = false;
	var isTerminated = false;

	// input: array of code lines
	// returns: Billet object {radius: value, length: value}
	// throws: exception if [BILLET, X\d or Z\d not found
	var getBillet = function (codeArray){
	
		var billetLine;
		var found = false;
		
		for(var index = 0; index < codeArray.length; index++){
			billetLine = codeArray[index];
			if(billetLine.indexOf('[BILLET') >= 0) {
				found = true;
				break;
			}
		}

		if(!found){
			var errMessage = 'Billet size not found';
			console.log(errMessage);
			throw  errMessage;
		}

		var radiusPattern = /\sX\d+\s/;
		var radius = radiusPattern.exec(billetLine);

		if(!radius){
			var errMessage = 'Billet radius not found';
			console.log(errMessage);
			throw  errMessage;
		}

		var lengthPattern = /\sZ\d+\s?/;
		var length = lengthPattern.exec(billetLine);

		if(!length){
			var errMessage = 'Billet length not found';
			console.log(errMessage);
			throw  errMessage;
		}		

		var numberPattern = /\d+/;

		radius = numberPattern.exec(radius);
		length = numberPattern.exec(length);
		
		var billet = {'radius':radius[0], 'length': length[0], 'properties': config.billetProperties};

		return billet;
}
	return {
		
		reset: function(newProgram){
			if(!newProgram) return null;

			console.log('cncProgram: reset called');
			isTerminated = false;
			isStopped = false;
			// breakPoints = [];
			currentLine = -1;
			
			program = newProgram;
			codeLines = program.toUpperCase().split('\n');

			try {
				billet = getBillet(codeLines);	
			} catch (e) {
				console.log(e);
				billet = null;			
			}			
		},

		getBillet : function(){
			return billet;
		},

		getNextCodeLine : function(){

			if(currentLine >= codeLines.length) throw "Last Line";

			var data = {
				isCncCode: true,
				cncCode: codeLines[++currentLine].trim()
			}

			return data;
		},

		isBreakPoint : function(){

			return breakPoints[currentLine] || isStopped;
		},

		setBreakPoint : function(index){
			breakPoints[index] = true;
		},

		removeBreakPoint : function(index){
			breakPoints[index || currentLine] = false;
		},

		getAllCodeLinesAsArray : function(){
			return codeLines;
		},

		getCurrentLine : function(){
			return currentLine;
		},

		pauseProgram : function(){
			isStopped = true;
		},

		resumeProgram : function(){
			isStopped = false;
		},

		terminateProgram: function() {
			isTerminated = true;
		},

		isTerminated: function() {
			return isTerminated;
		},

		isProgramPaused : function(){
			return isStopped;
		}

	};
})();