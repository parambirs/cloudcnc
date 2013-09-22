importScripts('gcodes.js');



function executeStatement(statement, fromPoint){

	switch (statement.cncCode){

		case "G00":
			return calculateG00(fromPoint.x, fromPoint.z, statement.X, statement.Z);
		break;

		case "G01":
			return calculateG01(fromPoint.x, fromPoint.z, statement.X, statement.Z);
		break;
		
		default:

	}
}


function start(code){
			
	var codeArray = code.split('\n');	

	var statement;
	var pathArray;

	var prevX = 100, prevZ=100, prevR, prevCNCCode;
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
			for(var i =0; i < 1000000; i++){}
			self.postMessage(pathArray[index]);
			// callBack(pathArray[index]);
		}

		prevX = statement.X;
		prevZ = statement.Z;
		prevR = statement.R;
		prevCNCCode = statement.cncCode;
	}
}

function getStatement(codeLine){
	var statement = {};

	var cncCodePattern = /[GM]\d+/;
	var cncCode = cncCodePattern.exec(codeLine);
	
 	statement.cncCode = cncCode && cncCode[0];

	var paramsPattern = /[XZRUWF]-?\d+\.?\d*/g;

	while(temp = paramsPattern.exec(codeLine)){
		 statement[temp[0].charAt(0)] = temp[0].substring(1);
	}

	return statement;				
}

self.addEventListener('message', function(e){
	start(e.data);
}, false);