

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
	$('#editorDiv').change(console.log('hi'));

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