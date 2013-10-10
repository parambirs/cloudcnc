$(document).ready(function(){ 
	// $( "#editorDiv").load( "examples/simple.cnc" );
	$( "#editorDiv").load( "examples/complete.cnc" );

	initScreen();

	$(window).resize(function () { 
		initScreen();
	});

	$("#btnStart").click(function (){

		if($(this).text() === "Start"){
			executeProgram();
			$(this).text("Stop");
		} else {
			stop();
			$(this).text("Start");
		}
	});

	context.codeRunner = new Worker('js/parser.js');
	context.speedBreaker = new Worker('js/speedbreaker.js');
	context.codeRunner.addEventListener('message', function(e){
		
		context.speedBreaker.postMessage(e.data);
	}, false);

	$("#speedSlider").change(function(){
		// console.log("slider value = " + $(this).val());
		context.speedBreaker.postMessage({type: 'setSpeed', speed: $(this).val()});
	});
	context.speedBreaker.postMessage({type: 'setSpeed', speed: $('#speedSlider').val()});

});

function stop(){
	context.codeRunner && context.codeRunner.terminate();
}

function resume(){
			programHandler.removeBreakPoint();
}

function setBreakPoint(e){
	programHandler.setBreakPoint($(e).data("index"));
	$(e).parent().addClass("breakPoint");
}

function createRunTimeEditor(codeLineArray){
	
	var editorWidth =  $("#editorDiv").width();
	var editorHeight =  $("#editorDiv").height();
	var lineNumbersWidth = $("#lineNumbers").width();

	$("#lineNumbers").hide();
	$("#editorDiv").hide();

	var editor = document.getElementById('editor');
	var runtimeEditor = document.createElement('div');

	runtimeEditor.setAttribute('class', 'runtimeEditor');
	runtimeEditor.setAttribute('id', 'runtimeEditor');
	
	$(runtimeEditor).width(editorWidth + lineNumbersWidth);
	$(runtimeEditor).height(editorHeight);

	for(var index = 0; index < codeLineArray.length; index++){
		var rowDiv = document.createElement('div');
		rowDiv.setAttribute('id', 'row-' + index);
		rowDiv.setAttribute('class', 'row');
		
		var breakPointDiv = document.createElement('div');
		breakPointDiv.setAttribute('id', 'breakPointDiv-' + index);
		
		breakPointDiv.setAttribute('class', 'breakPointArea');
		breakPointDiv.setAttribute('onClick', 'setBreakPoint(this)');
		$(breakPointDiv).data("index", index);

		rowDiv.appendChild(breakPointDiv);

		var codeText = document.createElement('div');
		codeText.setAttribute('id', 'codeText-' + index);
		$(codeText).html(highlight(codeLineArray[index]));

		rowDiv.appendChild(codeText);
		runtimeEditor.appendChild(rowDiv);
	}

	editor.appendChild(runtimeEditor);
}


function highlight(code){
	var text = code.replace('G', "<span id='gcode'>G</span>");
	text = text.replace('M', "<span id='gcode'>M</span>");
	text = text.replace('W', "<span id='gcode'>W</span>");
	text = text.replace('U', "<span id='gcode'>U</span>");
	text = text.replace('F', "<span id='gcode'>F</span>");
	text = text.replace('X', "<span id='variables'>X</span>");
	text = text.replace('Z', "<span id='variables'>Z</span>");
	text = text.replace('R', "<span id='variables'>R</span>");
	return text;
}

function executeProgram (){
	var handler = programHandler;
	var scrollPosition = 20;
	var scrollValue = 20;
	
	handler.reset($('#editorDiv').val());

	createRunTimeEditor(handler.getAllCodeLinesAsArray());

	var billet = handler.getBillet();
	
	if(!billet) return;

	graphics.initSimulation();
	graphics.reset();
	graphics.drawBillet(billet);

	var codeLine = handler.getNextCodeLine();

	console.log('Now executing: ' + codeLine.cncCode);

	context.codeRunner.postMessage(codeLine);

	context.speedBreaker.addEventListener('message', function(e){

		// Draw tool
		if(e.data.type === "toolDrawPoint") {
			if(context.prevPoint) {
				graphics.drawGhostTool(context.prevPoint);
			}

			graphics.drawTool(e.data.position);
			context.prevPoint = e.data.position;
			return;
		}

		if(e.data.type === 'BreakPoint' || handler.isBreakPoint()) {

			if(handler.isBreakPoint()){
				context.codeRunner.postMessage({type: "BreakPoint"});
				return;
			}
		}

		if(e.data.type === 'parsingComplete' || e.data.type === 'BreakPoint'){

			try {
				context.codeRunner.postMessage(handler.getNextCodeLine());

				var currentLine = handler.getCurrentLine();

				$("#row-" + (currentLine -1)).removeClass("currentLine");
				$("#row-" + currentLine).addClass("currentLine");

				scrollScrollbar(currentLine);

			} catch (err){
				var currentLine = handler.getCurrentLine();
				$("#row-" + (currentLine -1)).removeClass("currentLine");
				$("#runtimeEditor").animate({scrollTop : 0}, 700);
				console.log(err);
				return;
			}
		}		
	});
}

function scrollScrollbar(currentLineNumber){
	var topDistance = currentLineNumber * config.homeProperties.lineHeight;
	var editorHeight = $("#editorDiv").height();
	var scrollValue = topDistance - editorHeight;
	if(scrollValue > $("#runtimeEditor").scrollTop())
		$("#runtimeEditor").scrollTop(scrollValue + config.homeProperties.lineHeight);
}

function run(){
	test();
	var cnc = document.getElementById(context.getCncCanvasId());
	var cncCtx = cnc.getContext("2d");

	delete context.prevPoint;
	
	graphics.initSimulation();

	// codeRunner is a worker thread that parses the CNC program and executes the code
	// context.codeRunner = new Worker('js/parser.js');

	var codeLines = $('#editorDiv').val().toUpperCase().split('\n');
	var billet = getBillet(codeLines);

	// to reset canvas

	cnc.width = cnc.width;

	cncCtx.translate(billet.length, Math.ceil(cnc.height/2));
	graphics.drawBillet(billet);

	var code =  $('#editorDiv').val().toUpperCase();
	var codeArray = code.split('\n');	

	console.log('Number of lines of code: ' + codeArray.length);

	var currentIndex = 0;
	var preIndex = 0;
	var editorHeight = $("#runtimeEditor").height();
	var scrollPosition = 20;
	var scrollValue = 20;
	var data = {
		isCncCode: true,
		cncCode: codeArray[currentIndex].trim()
	}	

	console.log('Now executing: ' + data.cncCode);
	context.codeRunner.postMessage(data);

	// Event handler for the run button
	context.codeRunner.addEventListener('message', function(e){
		// if(e.data.type === 'toolDrawPoint' || e.data.type === 'parsingComplete') {
			context.speedBreaker.postMessage(e.data);
		// }
		// else if(e.data.type === 'lineSimulationComplete'){
		// 	if(currentIndex < codeArray.length - 1) {
		// 		data.cncCode = codeArray[++currentIndex].trim();
		// 		context.codeRunner.postMessage(data);
		// 		console.log('Now executing: ' + data.cncCode);
		// 	}			
		// }

	}, false);

	// Event handler for the run button
	context.speedBreaker.addEventListener('message', function(e){

		if(e.data.type === 'BreakPoint') {
			if(breakPoints[currentIndex]){
				context.codeRunner.postMessage({type: "BreakPoint"});
				return;
			}
			
		}
		// console.log(e.data);
		if(context.prevPoint) {
			graphics.drawGhostTool(cncCtx, context.prevPoint);
		}

		// if(e.data.type === 'toolDrawPointReady') {
				
		// } else 
		
		

		if(e.data.type === 'parsingComplete' || e.data.type === 'BreakPoint') {
			if(currentIndex < codeArray.length - 1) {
				if(breakPoints[currentIndex]){
					currentBreakPoint = currentIndex;
					graphics.drawTool(cncCtx, context.prevPoint);
					context.codeRunner.postMessage({type: "BreakPoint"});
					return;
				} else {
					data.cncCode = codeArray[++currentIndex].trim();
					scrollPosition = scrollPosition + 20;
				}
				
				context.codeRunner.postMessage(data);
				$("#c-" + preIndex).removeClass("currentLine");
				$("#c-" + currentIndex).addClass("currentLine");
				console.log('Now executing: ' + data.cncCode);
				preIndex = currentIndex;
				

				if(scrollPosition > editorHeight){
					if($("#runtimeEditor").scrollTop() < scrollValue){
						$("#runtimeEditor").scrollTop(scrollValue);
					}
					
					scrollValue += 20;
				}
			} else {
				graphics.drawTool(cncCtx, context.prevPoint);
				$("#line-" + preIndex).css("background-color", "#A1A194");
				$("#runtimeEditor").animate({scrollTop : 0}, 700);
			}	
		} else {
			graphics.drawTool(cncCtx, e.data.position);
			context.prevPoint = e.data.position;
		}

	}, false);
}

// input: array of code lines
// returns: Billet object {radius: value, length: value}
// throws: exception if [BILLET, X\d or Z\d not found
function getBillet(codeArray){
	
	var billetLine;
	var found = false;
	

	for(line in codeArray){
		billetLine = codeArray[line];
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

function initScreen(){

	

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	// Setting toolbar
	$('#toolbar').css('height',  config.homeProperties.toolbarHeight + 'px');

	// Setting editor
	$('#editor').css('height', (windowHeight - config.homeProperties.toolbarHeight - config.homeProperties.footerHeight) + 'px');
	$('#editor').css('width', config.homeProperties.editorWidth + 'px');

	// Line numbers
	$('#lineNumbers').css('height', (windowHeight - config.homeProperties.toolbarHeight - config.homeProperties.footerHeight) + 'px');
	$('#lineNumbers').css('width' , (config.homeProperties.lineNumbersWidth) + 'px');

	// Setting editorDiv
	$('#editorDiv').css('height', (windowHeight - config.homeProperties.toolbarHeight - config.homeProperties.footerHeight) + 'px');
	$('#editorDiv').width((config.homeProperties.editorWidth - config.homeProperties.lineNumbersWidth) + 'px');
	// $('#editorDiv').css('padding-left', config.leftPadding + 'px');
	// $('#editorDiv').css('padding-top', config.topPadding + 'px');

	// Setting simulator
	$('#simulator').css('height', (windowHeight - config.homeProperties.toolbarHeight - config.homeProperties.footerHeight) + 'px');
	$('#simulator').css('width' , (windowWidth - config.homeProperties.editorWidth) + 'px');


	// Setting footer	
	$('#footer').css('height', config.homeProperties.footerHeight + 'px');

	// // Options overlay
	// $('#options').css('height', (window.innerHeight - config.toolbarHeight - config.footerHeight) + 'px');



	// Setting CNC
	$( "#cncCanvas" ).remove();
	var cnc = document.createElement('canvas');
	cnc.setAttribute('id', 'cncCanvas');
	cnc.height = (windowHeight - config.homeProperties.toolbarHeight - config.homeProperties.footerHeight);
	cnc.width = (windowWidth - config.homeProperties.editorWidth);
	var simulator = document.getElementById('simulator');
	simulator.appendChild(cnc);

}