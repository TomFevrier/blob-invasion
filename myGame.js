var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var scale = 10;

var nbFood = 10;
var nbEnnemies = 20;

var b = new Bob();

var f = [];
for (var i = 0; i < nbFood; i++) {
	f[i] = new Food();
}

var e = [];
for (var i = 0; i < nbEnnemies; i++) {
	e[i] = new Ennemy();
}

var lasers = [];

var particles = [];

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;
var spacePressedLong = false;

var timer = 20;

function Bob() {
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.radius = 20;
	
	this.move = function(x,y) {
		if (leftPressed) {
			this.x -= 1;
		}
		if (upPressed) {
			this.y -= 1;
		}
		if (rightPressed) {
			this.x += 1;
		}
		if (downPressed) {
			this.y += 1;
		}
	}
	
	this.shoot = function() {
		for (var i=0; i < 8; i++) {
			lasers.push(new Laser());
			lasers[lasers.length - 1].x = this.x;
			lasers[lasers.length - 1].y = this.y;
			
			switch (i) {
				
				case 0:
					lasers[lasers.length - 1].xspeed = 0;
					lasers[lasers.length - 1].yspeed = -1;
					break;
					
				case 1:
					lasers[lasers.length - 1].xspeed = 1/Math.sqrt(2);
					lasers[lasers.length - 1].yspeed = -1/Math.sqrt(2);
					break;
					
				case 2:
					lasers[lasers.length - 1].xspeed = 1;
					lasers[lasers.length - 1].yspeed = 0;
					break;
					
				case 3:
					lasers[lasers.length - 1].xspeed = 1/Math.sqrt(2);
					lasers[lasers.length - 1].yspeed = 1/Math.sqrt(2);
					break;
					
				case 4:
					lasers[lasers.length - 1].xspeed = 0;
					lasers[lasers.length - 1].yspeed = 1;
					break;
					
				case 5:
					lasers[lasers.length - 1].xspeed = -1/Math.sqrt(2);
					lasers[lasers.length - 1].yspeed = 1/Math.sqrt(2);
					break;
					
				case 6:
					lasers[lasers.length - 1].xspeed = -1;
					lasers[lasers.length - 1].yspeed = 0;
					break;
					
				case 7:
					lasers[lasers.length - 1].xspeed = -1/Math.sqrt(2);
					lasers[lasers.length - 1].yspeed = -1/Math.sqrt(2);
					break;
					
			}
		
		}                                             
	}
	
	this.eat = function(food) {
		if ( Math.sqrt(Math.pow((this.x - food.x), 2) + Math.pow((this.y - food.y), 2)) < this.radius + scale) {
			this.radius *= 1.05;
			return true;
		}
		return false;
	}

	this.getHurt = function(ennemy) {
		if ( Math.sqrt(Math.pow((this.x - ennemy.x), 2) + Math.pow((this.y - ennemy.y), 2)) < this.radius + scale*2) {
			this.radius /= 1.2;
			ennemy.explode();
			return true;
		}
		return false;
	}
	
	this.update = function() {
		this.move();
		if (this.radius > 80) {
			alert('GAGNE !');
			document.location.reload();
		}
	}
	
	this.show = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fillStyle="#1ED8B1";
		ctx.fill();
		ctx.closePath();
	}
	
}

function Food() {
	this.x = Math.floor(Math.random() * canvas.width);
	this.y = Math.floor(Math.random() * canvas.height);
	this.xspeed = (Math.random() > 0.5) ? 0.5 : -0.5;
	this.yspeed = (Math.random() > 0.5) ? 0.5 : -0.5;
	
	this.move = function() {
		if ((this.x + this.xspeed > canvas.width - scale/2) || (this.x + this.xspeed < scale/2)) {
			this.xspeed = - this.xspeed;
		}
		if ((this.y + this.yspeed > canvas.height - scale/2) || (this.y + this.yspeed < scale/2)) {
			this.yspeed = - this.yspeed;
		}
		this.x += this.xspeed;
		this.y += this.yspeed;
	}
	
	this.show = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, scale, 0, Math.PI*2);
		ctx.fillStyle="#FFC300";
		ctx.fill();
		ctx.closePath();
	}

}

function Laser() {
	this.x;
	this.y;
	this.xspeed;
	this.yspeed;
	
	this.move = function() {
		this.x += this.xspeed;
		this.y += this.yspeed;
	}
	
	this.toDel = function() {
		if ((this.x - scale/1.5 > canvas.width)||(this.x + scale/1.5 < 0) || (this.y - scale/1.5 > canvas.height)||(this.y + scale/1.5 < 0)) {
			return true;
		}
		return false;
	}
	
	this.show = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, scale/1.5, 0, Math.PI*2);
		ctx.fillStyle="#30b300";
		ctx.fill();
		ctx.closePath();
	}
}
		

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
	var rot = Math.PI/2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI/spikes;

	ctx.beginPath();
	ctx.moveTo(cx, cy - outerRadius);
	
	for(var i = 0; i < spikes; i++) {
		x = cx + Math.cos(rot) * outerRadius;
		y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot+=step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot+=step;
     }

	ctx.fillStyle="#C70039";
	ctx.fill();
	ctx.closePath();
    }

function Ennemy() {
	if (Math.random() < 0.5) {
		this.x = (Math.random() < 0.5) ? (Math.floor(Math.random() * 50) + canvas.width) : (Math.floor(Math.random() * 50) - 50);
		this.y = Math.floor(Math.random() * canvas.height);
	}
	else {
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = (Math.random() < 0.5) ? (Math.floor(Math.random() * 50) + canvas.height) : (Math.floor(Math.random() * 50) - 50);
	this.xspeed;
	this.yspeed;
	}
	
	this.move = function(bob) {
		this.xspeed = (bob.x - this.x) / Math.max(Math.abs(bob.x - this.x), Math.abs(bob.y - this.y)) * 0.1;
		this.yspeed = (bob.y - this.y) / Math.max(Math.abs(bob.x - this.x), Math.abs(bob.y - this.y)) * 0.1;
		this.x += this.xspeed;
		this.y += this.yspeed;
	}
	
	this.die = function() {
		for (var i = 0; i < lasers.length; i++) {
			if ( Math.sqrt(Math.pow((this.x - lasers[i].x), 2) + Math.pow((this.y - lasers[i].y), 2)) < scale*2 + scale/1.5) {
				this.explode();
				lasers.splice(i,1);
				return true;
			}
		}
	}
	
	this.explode = function() {
		for (var i = 0; i < 30; i++) {
			particles.push(new Particle());
			particles[particles.length-1].x = this.x;
			particles[particles.length-1].y = this.y;
		}
	}
	
	this.show = function() {
		drawStar(this.x, this.y, 12, scale*2, scale);
	}

}

function Particle() {
	this.x;
	this.y;
	this.xspeed = (Math.random()*6) - 3;
	this.yspeed = (Math.random()*6) - 3;
	this.lifespan = 300;
	
	this.move = function(index) {
		this.x += this.xspeed;
		this.y += this.yspeed;
		this.lifespan--;
	}
	
	this.toDel = function() {
		if ((this.x - scale/5 > canvas.width) || (this.x + scale/5 < 0) || (this.y - scale/5 > canvas.height) || (this.y + scale/5 < 0) || (this.lifespan < 0)) {
			return true;
		}
		return false;
	}
	
	this.show = function() {
		var color;
		
		if (Math.random() < 0.2) {
			color = "#1ED8B1";
		}
		else if (Math.random() < 0.4) {
			color = "#D81ECD";
		}
		else if (Math.random() < 0.6) {
			color = "#FFF116";
		}
		else if (Math.random() < 0.8) {
			color = "#35EB00";
		}
		else {
			color = "#EB0000";
		}
			
		ctx.beginPath();
		ctx.arc(this.x, this.y, scale/5, 0, Math.PI*2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();
	}
}

function keyDownHandler(e) {
	if (e.keyCode == 37) {
		leftPressed = true;
	}
	else if (e.keyCode == 38) {
		upPressed = true;
	}
	else if (e.keyCode == 39) {
		rightPressed = true;
	}
	else if (e.keyCode == 40) {
		downPressed = true;
	}
	else if (e.keyCode == 32) {
		spacePressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 37) {
		leftPressed = false;
	}
	else if (e.keyCode == 38) {
		upPressed = false;
	}
	else if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 40) {
		downPressed = false;
	}
	else if (e.keyCode == 32) {
		spacePressed = false;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	b.update();
	
	if (spacePressed && !spacePressedLong) {
		b.shoot();
		spacePressedLong = true;
	}
	if (!spacePressed && spacePressedLong) {
		spacePressedLong = false;
	}
	
	for (var i = 0; i < nbFood; i++) {
		f[i].move();
		f[i].show();
		if (b.eat(f[i])) {
			f[i].x = Math.floor(Math.random() * canvas.width);
			f[i].y = Math.floor(Math.random() * canvas.height);
		}
	}	
	
	for (var i = 0; i < nbEnnemies; i++) {
		if (e[i].die()) {
			e[i] = new Ennemy();
		}
		e[i].move(b);
		e[i].show();
		if (b.getHurt(e[i])) {
			e[i] = new Ennemy();
		}                                                                                                                             
	}
	
	for (var i = 0; i < lasers.length; i++) {
		lasers[i].show();
		lasers[i].move();
		if (lasers[i].toDel()) {
			lasers.splice(i, 1);
		}
	}
	
	for (var i = 0; i < particles.length; i++) {
		particles[i].show();
		particles[i].move();
		if (particles[i].toDel()) {
			particles.splice(i, 1);
		}
	}
	b.show();

}

setInterval(draw, 5);
