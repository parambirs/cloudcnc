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
			// highlightEdge(cncCtx, billet);
			$("#btnStart").text("Start");
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
	
	var billet = {'radius':radius[0], 'length': length[0], 'properties': billetProperties};

	return billet;
}

function initScreen(){

	

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	// Setting toolbar
	$('#toolbar').css('height',  Settings.homeProperties.toolbarHeight + 'px');

	// Setting editor
	$('#editor').css('height', (windowHeight - Settings.homeProperties.toolbarHeight - Settings.homeProperties.footerHeight) + 'px');
	$('#editor').css('width', Settings.homeProperties.editorWidth + 'px');

	// Line numbers
	$('#lineNumbers').css('height', (windowHeight - Settings.homeProperties.toolbarHeight - Settings.homeProperties.footerHeight) + 'px');
	$('#lineNumbers').css('width' , (Settings.homeProperties.lineNumbersWidth) + 'px');

	// Setting editorDiv
	$('#editorDiv').css('height', (windowHeight - Settings.homeProperties.toolbarHeight - Settings.homeProperties.footerHeight) + 'px');
	$('#editorDiv').width((Settings.homeProperties.editorWidth - Settings.homeProperties.lineNumbersWidth) + 'px');
	// $('#editorDiv').css('padding-left', settings.leftPadding + 'px');
	// $('#editorDiv').css('padding-top', settings.topPadding + 'px');

	// Setting simulator
	$('#simulator').css('height', (windowHeight - Settings.homeProperties.toolbarHeight - Settings.homeProperties.footerHeight) + 'px');
	$('#simulator').css('width' , (windowWidth - Settings.homeProperties.editorWidth) + 'px');


	// Setting footer	
	$('#footer').css('height', Settings.homeProperties.footerHeight + 'px');

	// // Options overlay
	// $('#options').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');



	// Setting CNC
	$( "#cnc" ).remove();
	var cnc = document.createElement('canvas');
	cnc.setAttribute('id', 'cnc');
	cnc.height = (windowHeight - Settings.homeProperties.toolbarHeight - Settings.homeProperties.footerHeight);
	cnc.width = (windowWidth - Settings.homeProperties.editorWidth);
	var simulator = document.getElementById('simulator');
	simulator.appendChild(cnc);

}