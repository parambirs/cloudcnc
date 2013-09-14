

window.onload = function(){
	initScreen()
	initSimulation();
}


function initScreen(){

	document.body.style.height = window.innerHeight +'px';

	var windowHeight = window.innerHeight;

	var settings = {
		toolbarHeight: 30,
		footerHeight: 30,
		editorWidth: 300,
	}
	// Setting toolbar
	$('#toolbar').css('height',  settings.toolbarHeight + 'px');
	
	// Setting footer	
	$('#footer').css('height', settings.footerHeight + 'px');

	// Setting editor
	$('#editor').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');
	$('#editor').css('width', settings.editorWidth + 'px');

	// Setting simulator
	$('#simulator').css('height', (window.innerHeight - settings.toolbarHeight - settings.footerHeight) + 'px');
	$('#simulator').css('width' , (window.innerWidth - settings.editorWidth) + 'px');

	// Setting CNC
	var cnc = document.createElement('canvas');
	cnc.setAttribute('id', 'cnc');
	cnc.height = (window.innerHeight - settings.toolbarHeight - settings.footerHeight);
	cnc.width = (window.innerWidth - settings.editorWidth);
	var simulator = document.getElementById('simulator');
	simulator.appendChild(cnc);

}