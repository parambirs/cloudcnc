importScripts("gcodes.js")

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
	
	var billet = {'diameter':diameter, 'length': length};

	return billet;
}

function executeStatement(statement, fromPoint){

	switch (statement.cncCode){

		case "G00":
			return calculateG00(fromPoint.x, fromPoint.z, statement.X, statement.Z);
		break;
		
		default:

	}
}


function start(code){
	console.log("code: " + code);
	
	// var editor = $('#editor');
	// var code = editor.val();				
	var codeArray = code.split('\n');	

	// var billet = getBillet(codeArray);

	var statement;
	var pathArray;

	var prevX = 50, prevZ=30, prevR, prevCNCCode;
	var fromPoint = {};

	for(line in codeArray){

		statement = getStatement(codeArray[line]);
		
		//setting default values
		statement.cncCode = statement.cncCode || prevCNCCode;
		statement.X = statement.X || prevX;
		statement.Z = statement.Z || prevZ;
		statement.R = statement.R || prevR;

		fromPoint.x = prevX;
		fromPoint.z = prevZ;

		pathArray = executeStatement(statement, fromPoint);

		for(index in pathArray){
			self.postMessage(pathArray[index]);
		}

		prevX = statement.X;
		prevZ = statement.Z;
		prevR = statement.R;
		prevCNCCode = statement.cncCode;
	}
}

function getStatement(codeLine){
	var cncGCodePattern = /G\d+/;
	var cncMCodePattern = /M\d+/;

	var cncCode = cncGCodePattern.exec(codeLine) || cncMCodePattern.exec(codeLine);

	var statement = {};
 	
 	statement.cncCode = cncCode && cncCode[0];

	var paramsPattern = /[XZRUWF]-?\d+\.?\d+/g;

	while(temp = paramsPattern.exec(codeLine)){
		 statement[temp[0].charAt(0)] = temp[0].substring(1);
	}

	return statement;				
}

self.addEventListener('message', function(e){
	start(e.data);
}, false);