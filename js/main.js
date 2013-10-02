$(document).ready(function(){ 
	$( "#editorDiv").load( "examples/complete.cnc" );

	initScreen();

	setTimeout(function(){
		run();
	}, 500);

	$(window).resize(function () { 
		initScreen();
	});

	$("#btnStart").click(function (){

		if($(this).text() === "Start"){
			run();
			$(this).text("Stop");
		} else {
			stop();
			$(this).text("Start");
		}
	});
});

function stop(){
	context.codeRunner && context.codeRunner.terminate();
}

function run(){
	delete context.prevPoint;
	
	initSimulation();

	// codeRunner is a worker thread that parses the CNC program and executes the code
	context.codeRunner = new Worker('js/parser.js');

	var codeLines = $('#editorDiv').val().toUpperCase().split('\n');
	var billet = getBillet(codeLines);

	// Event handler for the run button
	context.codeRunner.addEventListener('message', function(e){
		
		if(context.prevPoint) {
			drawGhostTool(cncCtx, tool, context.prevPoint);
		}

		if(e.data === "The End"){
			$("#btnStart").text("Start");
			
		} else {
			drawTool(cncCtx, tool, e.data);
			context.prevPoint = e.data;	
		}

	}, false);

	// to reset canvas
	cnc.width = cnc.width;
	
	cncCtx.translate(billet.length, Math.ceil(cnc.height/2));
	drawBillet(billet);
	context.codeRunner.postMessage($('#editorDiv').val().toUpperCase());
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