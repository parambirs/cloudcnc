$(document).ready(function(){ 
	$( "#editorDiv").load( "examples/simple.cnc" );
	initScreen();
});

function test(){
	if ($('#options').right < 0){
		$('#options').animate({"right": -300}, "fast");	
	} else {
		$('#options').animate({"right": 0}, "fast");
	}
	
}
// Global variables for the application
var MYAPP = {};

// codeRunner is a worker thread that parses the CNC program and 
// executes the code


// Event handler for the run button

// function callBack(data){
// 		console.log("codeRunner received message: " + data.x + "-" + data.z);
// 	if(MYAPP.prevPoint) {
// 		drawGhostTool(cncCtx, tool, MYAPP.prevPoint);
// 	}

// 	drawTool(cncCtx, tool, data);
// 	MYAPP.prevPoint = data;
// }

function stop(){
	MYAPP.codeRunner && MYAPP.codeRunner.terminate();
}

function run(){
	delete MYAPP.prevPoint;
	initSimulation();
	MYAPP.codeRunner = new Worker('js/parser.js');

	var codeA = $('#editorDiv').val().toUpperCase().split('\n');
	var billet = getBillet(codeA);
	var that = this;
	MYAPP.codeRunner.addEventListener('message', function(e){
		// console.log("codeRunner received message: " + e.data.x + "-" + e.data.z);
		
		if(MYAPP.prevPoint) {
			drawGhostTool(cncCtx, tool, MYAPP.prevPoint);
		}

		if(e.data === "The End"){
			// get3DData(cnc, cncCtx, billet);
			return;
		}

		drawTool(cncCtx, tool, e.data);
		MYAPP.prevPoint = e.data;
	}, false);

	
	cnc.width = cnc.width;
	cncCtx.translate(billet.length, Math.ceil(cnc.height/2));
	drawBillet(billet);
	// start($('#editorDiv').val().toUpperCase());
	MYAPP.codeRunner.postMessage($('#editorDiv').val().toUpperCase());
}

// input: array of code lines
// returns: Billet object {diameter: value, length: value}
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

	var diameterPattern = /\sX\d+\s/;
	var diameter = diameterPattern.exec(billetLine);

	if(!diameter){
		var errMessage = 'Billet diameter not found';
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

	diameter = numberPattern.exec(diameter);
	length = numberPattern.exec(length);
	
	var billet = {'diameter':diameter[0], 'length': length[0], 'properties': billetProperties};

	return billet;
}

function initScreen(){

	document.body.style.height = window.innerHeight +'px';

	var windowHeight = window.innerHeight;

	var settings = {
		toolbarHeight: 40,
		footerHeight: 30,
		editorWidth: 300,
		topPadding: 3,
		leftPadding: 4,
		lineNumbersWidth: 30
	}
	
	// Setting toolbar
	$('#toolbar').css('height',  settings.toolbarHeight + 'px');
	
	// Setting footer	
	$('#footer').css('height', settings.footerHeight + 'px');

	// Setting editor
	$('#editor').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');
	$('#editor').css('width', settings.editorWidth + 'px');

	// Setting editorDiv
	$('#editorDiv').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight - settings.topPadding) + 'px');
	$('#editorDiv').css('width', (settings.editorWidth - settings.leftPadding - settings.lineNumbersWidth) + 'px');
	// $('#editorDiv').css('padding-left', settings.leftPadding + 'px');
	// $('#editorDiv').css('padding-top', settings.topPadding + 'px');

	// Setting simulator
	$('#simulator').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');
	$('#simulator').css('width' , (window.innerWidth - settings.editorWidth) + 'px');

	// Line numbers
	$('#lineNumbers').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight - settings.topPadding) + 'px');
	$('#lineNumbers').css('width' , (settings.lineNumbersWidth - 4) + 'px');
	$('#lineNumbers').css('padding-top', settings.topPadding + 'px');

	// Options overlay
	$('#options').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');


	// Setting CNC
	var cnc = document.createElement('canvas');
	cnc.setAttribute('id', 'cnc');
	cnc.height = (window.innerHeight - settings.toolbarHeight - settings.footerHeight);
	cnc.width = (window.innerWidth - settings.editorWidth);
	var simulator = document.getElementById('simulator');
	simulator.appendChild(cnc);

}