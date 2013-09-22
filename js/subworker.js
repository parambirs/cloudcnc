var list = [];
var firstTime = true;

function pooler(){
	var temp = list.pop();
	
	if(temp){
		self.postMessage(temp);
	}

	setTimeout(function(){pooler()},2);
}

function add(data){
	list.unshift(data);
}

self.addEventListener('message', function(e){
	add(e.data);
	if(firstTime){
		firstTime = false;
		pooler();
	}
}, false);