/*
	Web worker to control the speed of simulation.
*/
var speedBreaker = (function() {
	// tool Speed can be in the range of 1-10 inclusive.
	var toolSpeed = 5;

	return {
		getSpeed: function() {return toolSpeed;},
		setSpeed: function(newSpeed) {

		 	newSpeed = newSpeed > 10 ? 10 : newSpeed;
		 	newSpeed = newSpeed < 1 ? 1 : newSpeed;
		 	toolSpeed = 11 - newSpeed;	// Less newSpeed value means more delay required during simulation.
		}
	};
})();

// Event listener for web worker
self.addEventListener('message', function(e){
	// setSpeed event for simulation speed
	if(e.data.type === 'setSpeed') {
		speedBreaker.setSpeed(e.data.speed);
	}
	// event for drawing tool at a particular position. Simply add delay
	// before bouncing back the event to the caller
	else if(e.data.type === 'toolDrawPoint'){
		for(var i =0; i < speedBreaker.getSpeed() * 100000; i++){}
		self.postMessage(e.data);
	} 
	// bounce back rest of the events as it is
	else {
		self.postMessage(e.data);	
	} 	
}, false);