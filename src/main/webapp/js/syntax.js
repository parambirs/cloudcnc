var syntax = {
	spl: '#0f0;',
	variables: '#ff0;'
}

function billet(){
	var editorDiv = document.getElementById('editorDiv');

	// var reg = new RegExp("[\[]BILLET");
	
	var program = $('#editorDiv').html();

	program = program.replace("[BILLET", '<span style="color: ' + syntax.spl + '">[BILLET</span>');

	$('#editorDiv').html(program);
}

function variables(){

	var program = $('#editorDiv').html();

	program = program.replace(/ X/g, '<span style="color: ' + syntax.variables + '"> X</span>');
	program = program.replace(/[\r\nX]/g, '<span style="color: ' + syntax.variables + '">Z</span>');

	$('#editorDiv').html(program);
	
}