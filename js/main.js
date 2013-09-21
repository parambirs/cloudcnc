// Global variables for the application
var MYAPP = {};

// codeRunner is a worker thread that parses the CNC program and 
// executes the code
MYAPP.codeRunner = new Worker('parser.js');
MYAPP.codeRunner.addEventListener('message', function(e){
	console.log("codeRunner received message: " + e.data.x + "-" + e.data.z);
	
	if(MYAPP.prevPoint) {
		// drawGhostTool(cncCtx, tool, prevPoint);
	}

	// drawTool(cncCtx, tool, e.data);
	cncCtx.fillStyle = "#0f0";
	cncCtx.fillRect(e.data.z, e.data.x, 20, 20);
	MYAPP.prevPoint = e.data;
}, false);

// Event handler for the run button
function run(){
	MYAPP.codeRunner.postMessage($('#editorDiv').val());
}

window.onload = function(){
	initScreen()
	initSimulation();
	billet();
	variables();
}

function initScreen(){

	document.body.style.height = window.innerHeight +'px';

	var windowHeight = window.innerHeight;

	var settings = {
		toolbarHeight: 30,
		footerHeight: 30,
		editorWidth: 300,
		topPadding: 10,
		leftPadding: 10,
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
	$('#editorDiv').css('padding-left', settings.leftPadding + 'px');
	$('#editorDiv').css('padding-top', settings.topPadding + 'px');

	// Setting simulator
	$('#simulator').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');
	$('#simulator').css('width' , (window.innerWidth - settings.editorWidth) + 'px');

	// Line numbers
	$('#lineNumbers').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight - settings.topPadding) + 'px');
	$('#lineNumbers').css('width' , (settings.lineNumbersWidth - 4) + 'px');
	$('#lineNumbers').css('padding-top', settings.topPadding + 'px');

	// Setting CNC
	var cnc = document.createElement('canvas');
	cnc.setAttribute('id', 'cnc');
	cnc.height = (window.innerHeight - settings.toolbarHeight - settings.footerHeight);
	cnc.width = (window.innerWidth - settings.editorWidth);
	var simulator = document.getElementById('simulator');
	simulator.appendChild(cnc);

}