/*

*/
var speedBreaker = (function() {
	var toolSpeed = 5;

	return {
		getSpeed: function() {return toolSpeed;},
		setSpeed: function(newSpeed) {
		 	newSpeed = newSpeed > 10 ? 10 : newSpeed;
		 	newSpeed = newSpeed < 1 ? 1 : newSpeed;
		 	toolSpeed = 11 - newSpeed;
		}
	};
})();
self.addEventListener('message', function(e){

	if(e.data && e.data.type === 'setSpeed') {
		speedBreaker.setSpeed(e.data.speed);
	} else if(e.data && e.data.type === 'toolDrawPoint') {
		for(var i =0; i < speedBreaker.getSpeed() * 100000; i++){}
		self.postMessage({type: 'toolDrawPointReady', position: e.data.position});
	}
	// self.postMessage(e.data);
}, false);