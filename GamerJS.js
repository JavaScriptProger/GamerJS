/*GamerJS - js library for creating games
* Data - 2018 Russia
* I ((;
*/

//Canvas
var Canvas = function(){
	this.width;
	this.height;
	this.canvas;
	this.context = null;
}

var GJS_WIDTH, GJS_HEIGHT, GJS_CANVAS_ = null;
Canvas.prototype.initSize = function(w,h){
	this.width = w;
	this.height = h;

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	GJS_WIDTH = this.canvas.width;
	GJS_HEIGHT = this.canvas.height;
}


Canvas.prototype.initCanvas = function(){
	this.canvas = document.createElement("canvas");
	document.body.appendChild(this.canvas);
	GJS_CANVAS_ = this.canvas;
}

var GJS_CONTEXT = null;
Canvas.prototype.initContext = function(){
	this.context = this.canvas.getContext("2d");
	GJS_CONTEXT = this.context;
}

//Game window
var GameManadger = function(){
	this.ctx = GJS_CONTEXT;
	this.loop_ = null;
}

GameManadger.prototype.getCtxValue = function(){
	return this.ctx;
}

GameManadger.prototype.loop = function(gameloop_,fps){
	this.loop_ = setInterval(gameloop_,1000 / fps);
}

GameManadger.prototype.isRun = function(){
	return this.isRun;
}

GameManadger.prototype.fullScreen = function(){

}

//Game controller

var GameSystem = function(){
	this.ctx = GJS_CONTEXT;
};

GameSystem.prototype.clearDisplay = function(){
	GJS_CONTEXT.clearRect(0,0,GJS_WIDTH,GJS_HEIGHT);
}

GameSystem.prototype.setBackground = function(color = "black"){
	GJS_CANVAS_.style.backgroundColor = color;
}

GameSystem.prototype.setBackgroundImage = function(img = null){
	GJS_CANVAS_.style.backgroundImage = "url("+img+");";
}

//Camera
var Camera = function(){
	this.x = 0;
	this.y = 0;
};

Camera.prototype.move = function(dx,dy){
	this.x += dx;
	this.y += dy;
}

GJS_Camera = new Camera();

function getCameraName(){
	return GJS_Camera;
}

//Shapes
var Shape = function(){
	this.x = 0; this.y = 0;
	this.w = 0; this.h = 0;
	this.radius = 0;
	this.fillColor = "black";
	this.strokeColor = null;
	this.center = {
		x:0,y:0
	};
	this.show = 1;
	this.static = 0;	
	this.rotate_ = 0;
	this.angle = 0;
	this.lineWidth = 1;
	this.camera = GJS_Camera;
	this.rx = 0; ry = 0;
}

Shape.prototype.move = function(dx,dy){
	this.x += dx;
	this.y += dy;
}

Shape.prototype.getCenter = function(){
	this.center.x = this.w / 2;
	this.center.y = this.h / 2;
}

Shape.prototype.intersectByX = function(tmp){
	if(-this.camera.x + this.x > tmp.x - this.w && -this.camera.x + this.x < tmp.x + this.w){
		return 1;
	}else{
		return 0;
	}
}

Shape.prototype.intersectByY = function(tmp){
	if(-this.camera.y +this.y > tmp.y - this.h && -this.camera.y + this.y < tmp.y + this.h){
		return 1;
	}else{
		return 0;
	}
}

Shape.prototype.hover = function(){
	if(GJS_MOUSE.POS_X > this.x && GJS_MOUSE.POS_X < this.x + this.w){
		if(GJS_MOUSE.POS_Y > this.y - this.h && GJS_MOUSE.POS_Y < this.y + this.h){
			return 1;
		}
	}else{
		return 0;
	}
}

Shape.prototype.displayByAngle = function(deg){
	var dx = -this.camera.x + this.x + this.w / 2;
	var dy = -this.camera.y + this.y + this.h / 2;
	GJS_CONTEXT.save();
	GJS_CONTEXT.translate(dx,dy);
	GJS_CONTEXT.rotate(deg * Math.PI / 180);
	GJS_CONTEXT.translate(-dx,-dy);
	this.display();
	GJS_CONTEXT.restore();
}

Shape.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
}

Shape.prototype.setSize = function(w,h){
	this.w = w;
	this.h = h;
}

Shape.prototype.setLineWidth = function(w){
	this.lineWidth = w;
}

Shape.prototype.getDistance = function(tmp){
	var diffX = GJS_MOUSE.POS_X - tmp.x;
	var diffY = GJS_MOUSE.POS_Y - tmp.y;
	return Math.sqrt((diffX * diifX) + (diffY * diifY));
}

var Rect = function(){ Shape.call(this); };
var Circle = function(){ Shape.call(this); };
var Picture = function(){ 
	Shape.call(this); 
	this.src = null; 
	this.image;
};
var Ellipse = function(){ Shape.call(this); };

Rect.prototype.__proto__ = Shape.prototype;
Circle.prototype.__proto__ = Shape.prototype;
Picture.prototype.__proto__ = Shape.prototype;
Ellipse.prototype.__proto__ = Shape.prototype;

var DRAW_CIRCLE = function(x,y,r,fill){
	GJS_CONTEXT.beginPath();
	GJS_CONTEXT.arc(-this.camera.x + x,-this.camera.y + y, r, 0,Math.PI * 2, false);
	if(fill){
		GJS_CONTEXT.fill();
	}else{
		GJS_CONTEXT.stroke();
	}
}

Rect.prototype.display = function(){
	if(this.show){
		if(this.fillColor !== null){
			GJS_CONTEXT.fillStyle = this.fillColor;
			GJS_CONTEXT.fillRect(-this.camera.x + this.x,-this.camera.y + this.y,this.w,this.h);
		}

		if(this.strokeColor !== null){
			GJS_CONTEXT.strokeStyle = this.strokeColor;
			GJS_CONTEXT.strokeRect(-this.camera.x + this.x,-this.camera.y + this.y,this.w,this.h);
		}
	}
}

//Circle
Circle.prototype.display = function(){
	if(this.show){
		if(this.fillColor !== null){
			GJS_CONTEXT.fillStyle = this.fillColor;
			DRAW_CIRCLE(-this.camera.x + this.x,-this.camera.y + this.y,this.radius,true);
		}

		if(this.strokeColor !== null){
			GJS_CONTEXT.strokeStyle = this.strokeColor;
			DRAW_CIRCLE(-this.camera.x + this.x,-this.camera.y + this.y,this.radius,false);
		}
	}
}
//Images
Picture.prototype.display = function(){
	if(this.show){
		this.image = new Image();
		this.image.src = this.src;
		GJS_CONTEXT.drawImage(this.image,-this.camera.x + this.x,-this.camera.y + this.y, this.w, this.h);
	}
}
//Ellipse
Ellipse.prototype.display = function(){
	if(this.show){
		GJS_CONTEXT.ellipse(-this.camera.x + this.x,
			-this.camera.y + this.y,
			 this.rx,this.ry,0,0, 2 * Math.PI);
		if(this.fillColor !== null){
			GJS_CONTEXT.fillStyle = this.fillColor;
			GJS_CONTEXT.fill();
		}

		if(this.strokeColor !== null){
			GJS_CONTEXT.strokeStyle = this.strokeColor;
			GJS_CONTEXT.stroke();
		}
	}
}

//Points and Lines
var Line = function(points){
	this.points = points;
}

Line.prototype.display = function(){
	GJS_CONTEXT.beginPath();
	for(var i = 0;i < Object.keys(this.points).lenght;i++){
		for(var j = 0;j < 1;j++){
			GJS_CONTEXT.lineTo(this.points[i][j]);
		}
	}
}

//Text
var Text = function(){
	Shape.call(this);
	this.fontName;
	this.fontSize;
	this.text;
	this.baseLine;
	this.align;
}

Text.prototype.display = function(){
	GJS_CONTEXT.textBaseline = this.baseLine;
	GJS_CONTEXT.textAlign = this.align;
	GJS_CONTEXT.font = this.fontSize + "px " + this.fontName;

	if(this.show){
		if(this.fillColor !== null){
			GJS_CONTEXT.fillStyle = this.fillColor;
			GJS_CONTEXT.fillText(this.text,-this.camera.x + this.x,-this.camera.y + this.y,);
		}

		if(this.strokeColor !== null){
			GJS_CONTEXT.strokeStyle = this.strokeColor;
			GJS_CONTEXT.strokeText(this.text,-this.camera.x + this.x,-this.camera.y + this.y,);
		}
	}
}

//Keyboard
var keys = {
  0 : "That key has no keycode",3 : "break",8 : "backspace / delete",9 : "tab",12 : 'clear',
  13 : "enter",16 : "shift",17 : "ctrl",18 : "alt",19 : "pause/break",20 : "caps lock",
  21 : "hangul",25 : "hanja",27 : "escape",28 : "conversion",29 : "non-conversion",
  32 : "spacebar",33 : "page up",34 : "page down",35 : "end",36 : "home",37 : "left arrow",
  38 : "up arrow",39 : "right arrow",40 : "down arrow",41 : "select",42 : "print",
  43 : "execute",44 : "Print Screen",45 : "insert",46 : "delete",47 : "help",48 : "0",
  49 : "1",50 : "2",51 : "3",52 : "4",53 : "5",54 : "6",55 : "7",56 : "8",57 : "9",58 : ":",
  59 : "semicolon (firefox), equals",60 : "<", 61 : "equals (firefox)",63 : "ß",64 : "@ (firefox)",
  65 : "a",66 : "b",67 : "c",68 : "d",69 : "e",70 : "f",71 : "g",72 : "h",73 : "i",
  74 : "j",75 : "k",76 : "l",77 : "m",78 : "n",79 : "o",80 : "p",81 : "q",82 : "r",
  83 : "s",84 : "t",85 : "u",86 : "v",87 : "w",88 : "x",89 : "y",90 : "z",
  91 : "Windows Key / Left ⌘ / Chromebook Search key",92 : "right window key",
  93 : "Windows Menu / Right ⌘",95: "sleep",96 : "numpad 0",97 : "numpad 1",98 : "numpad 2",
  99 : "numpad 3", 100 : "numpad 4",101 : "numpad 5",102 : "numpad 6",103 : "numpad 7",
  104 : "numpad 8",105 : "numpad 9",106 : "multiply",107 : "add",108 : "numpad period (firefox)",
  109 : "subtract",110 : "decimal point",111 : "divide",112 : "f1",113 : "f2",114 : "f3",
  115 : "f4",116 : "f5",117 : "f6",118 : "f7",119 : "f8",120 : "f9",121 : "f10",122 : "f11",
  123 : "f12",124 : "f13",125 : "f14",126 : "f15",127 : "f16",128 : "f17",129 : "f18",130 : "f19",
  131 : "f20",132 : "f21",133 : "f22",134 : "f23",135 : "f24",144 : "num lock",145 : "scroll lock",
  160 : "^",161 : '!',163 : "#",164 : '$',165 : 'ù',166 : "page backward",167 : "page forward",
  168 : "refresh",169 : "closing paren (AZERTY)",170 : '*',171 : "~ + * key",172 : "home key",
  173 : "minus (firefox), mute/unmute",174 : "decrease volume level",175 : "increase volume level",
  176 : "next",177 : "previous",178 : "stop",179 : "play/pause",180 : "e-mail",181 : "mute/unmute (firefox)",
  182 : "decrease volume level (firefox)",183 : "increase volume level (firefox)",
  186 : "semi-colon / ñ",187 : "equal sign",188 : "comma", 189 : "dash",190 : "period",
  191 : "forward slash / ç",192 : "grave accent / ñ / æ / ö",193 : "?, / or °",194 : "numpad period (chrome)",
  219 : "open bracket",220 : "back slash",221 : "close bracket / å",222 : "single quote / ø / ä",
  223 : "`",224 : "left or right ⌘ key (firefox)",
  225 : "altgr",226 : "< /git >, left back slash",230 : "GNOME Compose Key",231 : "ç",
  233 : "XF86Forward",234 : "XF86Back",240 : "alphanumeric",242 : "hiragana/katakana",
  243 : "half-width/full-width",244 : "kanji",255 : "toggle touchpad"
}

var GJS_KEYBOARD = {
	DOWN_KEY:null
};

document.addEventListener("keydown",function(event){
	GJS_KEYBOARD.DOWN_KEY = keys[event.keyCode];
},false);

document.addEventListener("keyup",function(event){
	GJS_KEYBOARD.DOWN_KEY = undefined;
},false);

var Keyboard = function(){
	this.isDown = undefined;
	this.isPress = undefined;
}

Keyboard.prototype.getDown = function(){
	return GJS_KEYBOARD.DOWN_KEY;
}

//Mouse
var Mouse = function(){
	this.x; this.y;
	this.press = null;
}

GJS_MOUSE = {
	POS_X:0,
	POS_Y:0,
	CLICK_BTN:7
}

GJS_MOUSE_CODES = {
	1:"left",
	2:"center",
	3:"right"
}

document.addEventListener("mousemove",function(event){
	GJS_MOUSE.POS_X = event.clientX;
	GJS_MOUSE.POS_Y = event.clientY;
},false);

document.addEventListener("mousedown",function(event){
	GJS_MOUSE.CLICK_BTN = GJS_MOUSE_CODES[event.which];
},false);

document.addEventListener("mouseup",function(event){
	GJS_MOUSE.CLICK_BTN = 7;
},false);

Mouse.prototype.getPostion = function(){
	this.x = GJS_MOUSE.POS_X;
	this.y = GJS_MOUSE.POS_Y;

	return{
		x:this.x, 
		y:this.y
	}
}

Mouse.prototype.getDown = function(){
	return GJS_MOUSE.CLICK_BTN;
}

//Audio
var Sound = function(){
	this.src; this.repeat;
	this.audio = new Audio();
}

Sound.prototype.play = function(){
	this.audio.src = this.src;
	this.audio.play();
}

Sound.prototype.pause = function(){
	this.audio.pause();
}

//SVG
var GJS_SVG_GRAPHICS = '';
var SVG = function(){
	this.width;
	this.height;
	this.graphics;
}

SVG.prototype.draw = function(){
	this.graphics = "<svg width='"+this.width+"' height='"+this.height+"'>" + GJS_SVG_GRAPHICS + "</svg>";
	document.write(this.graphics);
}

var SVGRect = function(){
	Shape.call(this);
	this.rx = 0; this.ry = 0;
	this.id; this.class = "GJS_SVG_RECT";
};

SVGRect.prototype.display = function(){
	GJS_SVG_GRAPHICS += "<rect id='" + this.id + "' class='" + this.class + "' x='" + this.x + "' y='"+ this.x + "' width='"+ this.w +"' height='"+ this.h +"' rx='" + this.rx +"' ry='" + this.ry + "' fill='" + this.fillColor + "' stroke='" + this.strokeColor + "'/>";
}

var SVGCircle = function(){
	Shape.call(this);
	this.r = 0;
	this.id; this.class = "GJS_SVG_CIRCLE";
};

SVGCircle.prototype.display = function(){
	GJS_SVG_GRAPHICS += "<circle id='" + this.id + "' class='" + this.class + "' cx='" + this.x + "' cy='"+ this.x + "' r='" + this.r + "'/>";
}

var SVGOval = function(){
	Shape.call(this);
	this.rx = 0; this.ry = 0;
	this.id; this.class = "GJS_SVG_CIRCLE";
};

SVGOval.prototype.display = function(){
	GJS_SVG_GRAPHICS += "<ellipce id='" + this.id + "' class='" + this.class + "' x='" + this.x + "' y='"+ this.y + "' rx='" + this.rx + "' ry='" + this.ry + "'/>";
}

var SVGLine = function(){
	this.x1; this.x2;
	this.y1; this.y2;
}

Line.prototype.display = function(){
	GJS_SVG_GRAPHICS += "<line id='" + this.id + "' class='" + this.class + "' x1='" + this.x1 + "' y1='"+ this.y1 + "' x2='" + this.x2 + "' y2='" + this.y2 + "'/>";
}

//Physics
var Gravity = function(){
	this.object;
	this.velocity = 0;
}

Gravity.prototype.add = function(tmp){
	this.object = tmp;
}

Gravity.prototype.use = function(){
	this.velocity += 1;
	this.object.y += this.velocity;
}

//Touch
GJS_TOUCH = {
	x:0,
	y:0,
	floorX:0,
	floorY:0,
	down:0
}

var Touch = function(){
	this.x; this.y;
	this.down = 0;
}

document.addEventListener("touchstart",function(event){
    GJS_TOUCH.x = event.touches[0].clientX;
    GJS_TOUCH.y = event.touches[0].clientY;
}, false);

document.addEventListener("touchstart",function(event){
    GJS_TOUCH.floorX = Math.floor(event.touches[0].clientX);
    GJS_TOUCH.floorY = Math.floor(event.touches[0].clientY);
}, false);

document.addEventListener("touchstart",function(event){
	GJS_TOUCH.down = 1;
}, false);

document.addEventListener("touchend",function(event){
	GJS_TOUCH.down = 0;
}, false);

Touch.prototype.getPosition = function(){
	this.x = GJS_TOUCH.x;
	this.y = GJS_TOUCH.y;
	return { x : GJS_TOUCH.x, y : GJS_TOUCH.y }
}

Touch.prototype.getFloorPostion = function(){
	this.x = GJS_TOUCH.floorX;
	this.y = GJS_TOUCH.floorY;
	return { x : GJS_TOUCH.floorX, y : GJS_TOUCH.floorY }
}

Touch.prototype.getDown = function(event){
	return GJS_TOUCH.down;
}

//Accelerometer don't work!
var Accelerometer = function(){
	this.x = null; this.y = null;
	this.z = null;
}
//SM Shape Manadger
var SM = function(){};

SM.prototype.displayArray = function(array){
	for(var i = 0;i < Object.keys(array).length;i++){
		array[i].display();
	}
}

SM.prototype.intersectByX_Array = function(shape,array){
	for(var i = 0;i < Object.keys(array).length;i++){
		if(-array[i].camera.y +shape.x > array[i].x - shape.w && -array[i].camera.x +shape.x < array[i].x + shape.w){
			return 1;
		}else{
			return 0;
		}
	}
}

SM.prototype.intersectByY_Array = function(shape,array){
	for(var i = 0;i < Object.keys(array).length;i++){
		if(-array[i].camera.y + shape.y > array[i].y - shape.h && -array[i].camera.y + shape.y < array[i].y + shape.h){
			return 1;
		}else{
			return 0;
		}
	}
}

//Shadow
var Shadow = function(){
	this.w = 0;
	this.h = 0;
	this.color = "black";
	this.alpha = 0;
	this.blur = 0;
}

Shadow.prototype.use = function(){
	ctx.setShadow(this.w, this.h, this.blur,this.color, this.alpha);
}

//Fonts
var Font = function(){
	this.src = "";
	this.name = "font";
}

Font.prototype.load = function(src){
	this.src = src;
	document.write("@font-face { font-family: " + this.name + "; src: url("+this.rsc+");}");
}

//Timer
var Timer = function(){

}
//End