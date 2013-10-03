// Returns 'path array' for G00 motion
function calculateG00(fromX, fromZ, toX, toZ) {
	var zInc, xInc;
	var i, numSteps;
	var Z1, Z2, X1, X2;

	Z1 = parseInt(fromZ);	// starting x coordinate = starting z position
	Z2 = parseInt(toZ);	// ending x coordinate
	X1 = parseInt(fromX);	// starting y coordinate = starting x position
	X2 = parseInt(toX);	// ending y coordinate

	// calculate number of steps required
	numSteps = Math.max(Math.abs(Z1 - Z2), Math.abs(X1 - X2));

	zInc = (Z2 === Z1) ? 0 : (Z2 - Z1) / Math.abs(Z2 - Z1);
	xInc = (X2 === X1) ? 0 : (X2 - X1) / Math.abs(X2 - X1);

	var zxArray = [];

	// starting point
	zxArray[0] = {};
	zxArray[0].z = Z1;
	zxArray[0].x = X1;

	for(i = 1; i <= numSteps; i += 1) {
		if(Z1 !== Z2) {
			Z1 += zInc;
		}
		if(X1 !== X2) {
			X1 += xInc;
		}
		zxArray[i] = {};
		zxArray[i].z = Z1;
		zxArray[i].x = X1;
	}

	return zxArray;
}

function calculateG01(fromX, fromZ, toX, toZ) {
	var zInc, xInc;
    var i, numSteps, DZ, DX;
    var Z1, Z2, X1, X2;

    Z1 = parseInt(fromZ); // starting x coordinate = starting z position
    Z2 = parseInt(toZ);   // ending x coordinate
    X1 = parseInt(fromX); // starting y coordinate = starting x position
    X2 = parseInt(toX);   // ending y coordinate

    DZ = Z2 - Z1;
    DX = X2 - X1;

    // calculate number of steps required
    numSteps = Math.max(Math.abs(Z1 - Z2), Math.abs(X1 - X2));
    if(numSteps === 0) return [];

    zInc = DZ / numSteps;
    xInc = DX / numSteps;

    var zxArray = [];

    // starting point
    zxArray[0] = {};
    zxArray[0].z = Z1;
    zxArray[0].x = X1;

    for(i = 1; i <= numSteps; i += 1) {
        Z1 = (Z1 + zInc);
        X1 = (X1 + xInc);
        
        zxArray[i] = {};
        zxArray[i].z = Math.round(Z1);
        zxArray[i].x = Math.round(X1);
    }

    return zxArray;
}

// clockwise arc	
// calculateG02(100, 0, 100, -100, 200)
function calculateG02(fromX, fromZ, toX, toZ, radius, IVal, KVal) {
	var X1, X2, Y1, Y2;
    var m, theta, Theta1, Theta2;
    var Xm, Ym, B, L, Xc, Yc, X0, Y0, R, DX, DY;
    
    X1 = parseFloat(fromZ);  //starting x coordinate = starting z position
    X2 = parseFloat(toZ);  //end x coordinate
    Y1 = parseFloat(fromX);  //start y coordinate = starting x position
    Y2 = parseFloat(toX);   //end y coordinate
    
    if(!radius) {
        Xc = X1 + IVal;
        Yc = Y1 + KVal;
        R = Math.sqrt(Math.pow((Xc - X1), 2) + Math.pow((Yc - Y1), 2));
    } else {
        R = radius;
    }
    //RFound = False
    
    if(Math.abs(Y2 - Y1) < 0.1) {
        Y1 = Y1 - 0.01;
        B = 0.5 * Math.sqrt(Math.pow((X1 - X2), 2));
        m = (X1 - X2) / 0.01;
    } else {
        B = 0.5 * Math.sqrt(Math.pow((X1 - X2), 2) + Math.pow((Y1 - Y2), 2));
        m = (X1 - X2) / (Y2 - Y1);
    }
    theta = Math.atan(m);
    
    Xm = (X1 + X2) / 2;
    Ym = (Y1 + Y2) / 2;

    if (Math.abs(R) < Math.abs(B)) {
        alert("Value of Radius is too small to draw");
        return;
    }

    L = Math.sqrt(Math.pow(R, 2) - Math.pow(B, 2));
    
    DY = Y2 - Y1;
    DX = X2 - X1;
    
    if(DX < 0) {DX = -DX;}
    Xc = Xm + L * Math.cos(theta) * (R * DY * DX / (Math.abs(R) * Math.abs(DY) * Math.abs(DX))); //multiply by sign of r*y
    Yc = Ym + L * Math.sin(theta) * (R * DY * DX / (Math.abs(DX) * Math.abs(R) * Math.abs(DY))); //multiple by inverse sign of R
    
    if (Math.abs(X1 - Xc) < 0.1)  {X1 = X1 + 0.1;}
    Theta1 = Math.atan(Math.abs(Y1 - Yc) / Math.abs(X1 - Xc));
    //decide the quadrant
    DX = X1 - Xc;
    DY = Y1 - Yc;
    if (DX > 0 && DY > 0) 
        Theta1 = Theta1;
    else if (DX < 0 && DY > 0)
        Theta1 = 3.14159 - Theta1;
    else if(DX < 0 && DY < 0)
        Theta1 = 3.14159 + Theta1;
    else
        Theta1 = 3.14159 * 2 - Theta1;

    if (Math.abs(X2 - Xc) < 0.1) X2 = X2 + 0.1;
    Theta2 = Math.atan(Math.abs(Y2 - Yc) / Math.abs(X2 - Xc));
    DX = X2 - Xc;
    DY = Y2 - Yc;

    if(DX >= 0 && DY >= 0)
        Theta2 = Theta2;
    else if (DX < 0 && DY >= 0)
        Theta2 = 3.14159 - Theta2;
    else if (DX < 0 && DY < 0)
        Theta2 = 3.14159 + Theta2;
    else
        Theta2 = 3.14159 * 2 - Theta2; 
    
    var angle, X, Y, step;
   
    var XYArray = [];
    X = X1;
    Y = Y1;
    XYArray[0] = {};
    XYArray[0].z = parseInt(X);
    XYArray[0].x = parseInt(Y);
    
    var i = 1;
    
    if (Theta2 > Theta1) Theta2 = Theta2 - 2 * 3.14159;
    
    X = X1;
    Y = Y1;
    for(angle = Theta1; angle >= Theta2; angle -= 0.002) {
        X = Math.abs(R) * Math.cos(angle) + Xc;
        Y = Math.abs(R) * Math.sin(angle) + Yc;
        
        XYArray[i] = {};
        XYArray[i].z = parseInt(X);
        XYArray[i].x = parseInt(Y);
        i = i + 1;
    }
  	
  	return XYArray;
}

// anti-clockwise arc    
// calculateG03(100, 0, 100, -100, 200)
function calculateG03(fromX, fromZ, toX, toZ, radius, IVal, KVal) {
    var X1, X2, Y1, Y2;
    var m, theta, Theta1, Theta2;
    var Xm, Ym, B, L, Xc, Yc, X0, Y0, R, DX, DY;
    
    X1 = parseFloat(fromZ);  //starting x coordinate = starting z position
    X2 = parseFloat(toZ);  //end x coordinate
    Y1 = parseFloat(fromX);  //start y coordinate = starting x position
    Y2 = parseFloat(toX);   //end y coordinate
    
    if(!radius) {
        Xc = X1 + IVal;
        Yc = Y1 + KVal;
        R = Math.sqrt(Math.pow((Xc - X1), 2) + Math.pow((Yc - Y1), 2));
    } else {
        R = radius;
    }
    //RFound = False
    
    if(Math.abs(Y2 - Y1) < 0.1) {
        Y1 = Y1 - 0.01;
        B = 0.5 * Math.sqrt(Math.pow((X1 - X2), 2));
        m = (X1 - X2) / 0.01;
    } else {
        B = 0.5 * Math.sqrt(Math.pow((X1 - X2), 2) + Math.pow((Y1 - Y2), 2));
        m = (X1 - X2) / (Y2 - Y1);
    }
    theta = Math.atan(m);
    
    Xm = (X1 + X2) / 2;
    Ym = (Y1 + Y2) / 2;

    if (Math.abs(R) < Math.abs(B)) {
        alert("Value of Radius is too small to draw");
        return;
    }

    L = Math.sqrt(Math.pow(R, 2) - Math.pow(B, 2));
    
    DY = Y2 - Y1;
    DX = X2 - X1;
    
    if(DX > 0) {DX = -DX;}
    Xc = Xm + L * Math.cos(theta) * (R * DY * DX / (Math.abs(R) * Math.abs(DY) * Math.abs(DX))); //multiply by sign of r*y
    Yc = Ym + L * Math.sin(theta) * (R * DY * DX / (Math.abs(DX) * Math.abs(R) * Math.abs(DY))); //multiple by inverse sign of R
    
    if (Math.abs(X1 - Xc) < 0.1)  {X1 = X1 + 0.1;}
    Theta1 = Math.atan(Math.abs(Y1 - Yc) / Math.abs(X1 - Xc));
    //decide the quadrant
    DX = X1 - Xc;
    DY = Y1 - Yc;
    if (DX > 0 && DY > 0) 
        Theta1 = Theta1;
    else if (DX < 0 && DY > 0)
        Theta1 = 3.14159 - Theta1;
    else if(DX < 0 && DY < 0)
        Theta1 = 3.14159 + Theta1;
    else
        Theta1 = 3.14159 * 2 - Theta1;

    if (Math.abs(X2 - Xc) < 0.1) X2 = X2 + 0.1;
    Theta2 = Math.atan(Math.abs(Y2 - Yc) / Math.abs(X2 - Xc));
    DX = X2 - Xc;
    DY = Y2 - Yc;

    if(DX >= 0 && DY >= 0)
        Theta2 = Theta2;
    else if (DX < 0 && DY >= 0)
        Theta2 = 3.14159 - Theta2;
    else if (DX < 0 && DY < 0)
        Theta2 = 3.14159 + Theta2;
    else
        Theta2 = 3.14159 * 2 - Theta2; 
    
    var angle, X, Y, step;
   
    var XYArray = [];
    X = X1;
    Y = Y1;
    XYArray[0] = {};
    XYArray[0].z = parseInt(X);
    XYArray[0].x = parseInt(Y);
    
    var i = 1;
    
    if (Theta2 < Theta1) Theta1 = Theta1 - 2 * 3.14159;
    
    for(angle = Theta1; angle <= Theta2; angle += 0.002) {
        X = Math.abs(R) * Math.cos(angle) + Xc;
        Y = Math.abs(R) * Math.sin(angle) + Yc;
        
        XYArray[i] = {};
        XYArray[i].z = parseInt(X);
        XYArray[i].x = parseInt(Y);
        i = i + 1;
    }
    
    return XYArray;
}

function calculateG28(fromX, fromZ, toX, toZ) {
    //go to intermediate point
    // 'check for case U0 W0
    // If FromX <> ToX Or FromZ <> ToZ Then
    //     ExecuteG01
    // End If
    
    return calculateG00(fromX, fromZ, toX, toZ);
}

function calculateG28(fromX, fromZ, intermediateX, intermediateZ, toX, toZ) {
    //go to intermediate point
    var firstPath = calculateG00(fromX, fromZ, intermediateX, intermediateZ);
    var secondPath = calculateG00(intermediateX, intermediateZ, toX, toZ);
    return firstPath.concat(secondPath);
}

function calculateG90(fromX, fromZ, toX, toZ, rVal) {
    var X1, Z1, X2, Z2, R;
    
    X1 = parseFloat(fromX);
    Z1 = parseFloat(fromZ);
    X2 = parseFloat(toX);
    Z2 = parseFloat(toZ);
    
    if(!rVal) 
        R = 0;
    else
        R = parseFloat(rVal);
    
    //first point
    toX = X2 + R;
    toZ = Z1;
//'    frmMain.StatusBar.Panels(2).Text = "Feed: Maximum"
    var path1 = calculateG00(fromX, fromZ, toX, toZ);
    
    //second point
    fromX = toX;
    fromZ = toZ;
    toX = X2;
    toZ = Z2;
 //'   frmMain.StatusBar.Panels(2).Text = "Feed: " & FeedRate
    var path2 = calculateG01(fromX, fromZ, toX, toZ);
    
    //third point
    fromX = toX;
    fromZ = toZ;
    toX = X1;
    toZ = Z2;
  // '  frmMain.StatusBar.Panels(2).Text = "Feed: " & FeedRate
    var path3 = calculateG01(fromX, fromZ, toX, toZ);
    
    // final point
    fromX = toX;
    fromZ = toZ;
    toX = X1;
    toZ = Z1;
// '    frmMain.StatusBar.Panels(2).Text = "Feed: Maximum"
    var path4 = calculateG00(fromX, fromZ, toX, toZ);

    return path1.concat(path2).concat(path3).concat(path4);
}

function calculateG94(fromX, fromZ, toX, toZ, rVal) {
    var X1, Z1, X2, Z2, R;
    
    X1 = parseFloat(fromX);
    Z1 = parseFloat(fromZ);
    X2 = parseFloat(toX);
    Z2 = parseFloat(toZ);
    
    if(!rVal)
        R = 0;
    else
        R = parseFloat(rVal);
    
    //first point
    toX = X1;
    toZ = Z2 + R;
    // frmMain.StatusBar.Panels(2).Text = "Feed: Maximum"
    var path1 = calculateG00(fromX, fromZ, toX, toZ);
    
    //second point
    fromX = toX;
    fromZ = toZ;
    toX = X2;
    toZ = Z2;
 // '   frmMain.StatusBar.Panels(2).Text = "Feed: " & FeedRate
    var path2 = calculateG01(fromX, fromZ, toX, toZ);
    
    //third point
    fromX = toX;
    fromZ = toZ;
    toX = X2;
    toZ = Z1;
  // '  frmMain.StatusBar.Panels(2).Text = "Feed: " & FeedRate
    var path3 = calculateG01(fromX, fromZ, toX, toZ);
    
    //final point
    fromX = toX;
    fromZ = toZ;
    toX = X1;
    toZ = Z1;
   // ' frmMain.StatusBar.Panels(2).Text = "Feed: Maximum"
    var path4 = calculateG00(fromX, fromZ, toX, toZ);
    
    return path1.concat(path2).concat(path3).concat(path4);    
}
