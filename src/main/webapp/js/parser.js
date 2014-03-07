
importScripts('gcodes.js');


var parser = (function() {
	// console is not available inside webworker
	var console = {
		log: function(){}
	};

	var prevX = 100, prevZ=100, prevR, prevCNCCode;
	var fromPoint = {x: prevX, z: prevZ};

	var executeStatement = function(statement, fromPoint){

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
		}
	};

	var getStatement = function (codeLine){
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
	};

	

	return {
	
		reset: function() {
			prevX = 200; 
			prevZ=600;
			prevR = 0;
			prevCNCCode = undefined;
			fromPoint = {x: prevX, z: prevZ};
		},
		start : function (code){
			// for(var i = 0; i < this.toolSpeed; i++);
			// self.postMessage(this.toolSpeed);

			console.log('Starting program');

			var codeArray = code.split('\n');	

			console.log('Number of lines of code: ' + codeArray.length);

			var statement;
			var pathArray;

			for(line in codeArray){

				if(!codeArray[line].trim()) continue;

				if(codeArray[line].trim().indexOf("[") === 0) continue;

				console.log("Statement: " + codeArray[line]);

				statement = getStatement(codeArray[line]);
				
				//setting default values
				statement.cncCode = statement.cncCode || prevCNCCode;

				prevX = statement.U ? (parseInt(statement.U) + prevX): prevX;
				prevZ = statement.W ? (parseInt(statement.W) + prevZ): prevZ;
				
				statement.X = statement.X || prevX; //statement.U ? (statement.U + prevX) : prevX;
				statement.Z = statement.Z || prevZ; //statement.W ? (statement.W + prevZ) : prevZ;
				statement.R = statement.R || prevR;

				// throw ("Statement object: " + statement.toString());

				pathArray = executeStatement(statement, fromPoint);

				for(index in pathArray){
					// self.postMessage(getToolSpeed());
					self.postMessage({type: 'toolDrawPoint', position: pathArray[index]});
					// self.postMessage(getSpeed());
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

			// throw 'parsingComplete';
			self.postMessage({type: 'parsingComplete'});
		}, // end of start()

		execute : function(data){
			// self.postMessage(data);
			// self.postMessage({isConsoleLog: true, msg: 'toolSpeed = ' + data});
			// self.postMessage('hi');
			if(data.isCncCode){
				this.start(data.cncCode);
			} else if(data.isToolSettings){
				setSpeed(Math.abs(parseInt(data.toolSpeed) - 49) * 100000);				
			} else if(data.type === "BreakPoint"){
				for(var index=0; index<100000; index++){}
				self.postMessage(data);
			} else if(data.type === "reset") {
				this.reset();
			}
		}
	}; // end of return
})();

self.addEventListener('message', function(e){
	parser.execute(e.data);
}, false);
