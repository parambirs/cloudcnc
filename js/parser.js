importScripts('gcodes.js');



function executeStatement(statement, fromPoint){

	switch (statement.cncCode){

		case "G00":
			return calculateG00(fromPoint.x, fromPoint.z, statement.X, statement.Z);
		break;

		case "G01":
			return calculateG01(fromPoint.x, fromPoint.z, statement.X, statement.Z);
		break;
		
		case "G02":
			return calculateG02(fromPoint.x, fromPoint.z, statement.X, statement.Z, statement.R);
		break;

		case "G03":
			return calculateG03(fromPoint.x, fromPoint.z, statement.X, statement.Z, statement.R);
		break;

		case "G28":
			return calculateG28(fromPoint.x, fromPoint.z, statement.X, statement.Z);
		break;

		case "G90":
			return calculateG90(fromPoint.x, fromPoint.z, statement.X, statement.Z, statement.R);
		break;

		case "G94":
			return calculateG94(fromPoint.x, fromPoint.z, statement.X, statement.Z, statement.R);
		break;

		default:

	}
}

var console = {
	log: function(){}
};


function start(code){
	
	console.log('Starting program');

	var codeArray = code.split('\n');	

	console.log('Number of lines of code: ' + codeArray.length);

	var statement;
	var pathArray;

	var prevX = 100, prevZ=100, prevR, prevCNCCode;

	var fromPoint = {x: prevX, z: prevZ};

	for(line in codeArray){

		if(!codeArray[line].trim()) continue;

		if(codeArray[line].trim().indexOf("[") === 0) continue;

		console.log("Statement: " + codeArray[line]);

		statement = getStatement(codeArray[line]);

		
		//setting default values
		statement.cncCode = statement.cncCode || prevCNCCode;
		statement.X = statement.X || prevX;
		statement.Z = statement.Z || prevZ;
		statement.R = statement.R || prevR;

		console.log("Statement object: " + statement.toString());

		pathArray = executeStatement(statement, fromPoint);

		for(index in pathArray){
			for(var i =0; i < 300000; i++){}
			self.postMessage(pathArray[index]);
			// callBack(pathArray[index]);
		}

		if(pathArray) {
			fromPoint.x = pathArray[pathArray.length - 1].x;
			fromPoint.z = pathArray[pathArray.length - 1].z;
		}

		prevX = statement.X;
		prevZ = statement.Z;
		prevR = statement.R;
		prevCNCCode = statement.cncCode;
	}

	self.postMessage("The End");
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

	statement.toString = function() {
		var prop, str = '';
		for(prop in this) {
			if(this.hasOwnProperty(prop) && typeof this.prop !== 'function') {
				str += prop + ": " + this[prop] + "\n";
			}
		}

		return str;
	}

	return statement;				
}

self.addEventListener('message', function(e){
	start(e.data);
}, false);
