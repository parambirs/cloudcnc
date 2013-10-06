
function m1(){
	return function(args){
		alert(args);
	}
}


function m2(){
	var m = m1();
	m('sumit');
}