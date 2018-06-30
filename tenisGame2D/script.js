var canvas;
var canvasContext;
var ballX = 250;
var ballY = 0;
var ballSpeedX = 4;
var ballSpeedY = 4;
var balllRadius = 10;
var score = 0;
var gameState = false;
const WINNIG_SCORE = 2;
var playerWin = false;

//Posisi Y Paddle 1 & 2
var paddle1Y = 250;
var paddle2Y = 250;

//Panjang Paddle
const PADDLE_HEIGHT = 100;

function calculateMous(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  }
}

function handleMouseClick(evt){
  if(!gameState){
    score = 0;
    gameState = true;
    if(playerWin){
      playerWin = false;
    }
  }
}

window.onload = function(){
  console.log('== GAME START ==');

  //Ambil Object Canvas
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  //Event Listener Untuk Ambil Mouse Click
  canvas.addEventListener('mousedown',handleMouseClick);

  //Event Listener Untuk Ambil Posisi Mouse
  canvas.addEventListener('mousemove',function(evt){
    var mousePos = calculateMous(evt);
    paddle1Y = mousePos.y-PADDLE_HEIGHT/2;
  })

  //Menaikkan fps akan mempercepat pola permainan juga
  var fps =60;
  setInterval(wrapper, 1000/fps);
}

function wrapper(){
  moveStuff();
  drawStuff();
}

//Menggerakan Bola Dengan Button
function moveBall(){
  ballX = ballX + 100;
}


function gameScreen(){
  //Create Black Screen
  createShape(0,0,canvas.width,canvas.height,'black');
  //Conditional Winning Screen
  if(playerWin){
    createText('You Win!',200,150,'white');
    createText('Click to Play Again',200,170,'white');
  }else {
    createText('Click the Screen to Play',200,170,'white');
  }
}

//Reset Bola ke Tengah
function ballReset(){
  //When player score exceed winning condition
  if(score >= WINNIG_SCORE){
    gameState = false;
    playerWin = true;
  }

  //Memberi Value Minus, merubah dari Plus ke Minus dan Sebalik nya
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 4;

  ballX = canvas.width/2;
  ballY = canvas.height/2+Math.floor(Math.random()*149)+1;
}

//Gerakan Komputer
function computerMovement(){
  var padmid = paddle2Y+PADDLE_HEIGHT/2;
  if(padmid < ballY+30){
    paddle2Y+= 4;
  }

  if(padmid > ballY-30){
    paddle2Y-= 4;
  }
}

//Menggearakan Objek
function moveStuff(){
  if(!gameState){
    return;
  }
  computerMovement();
  //Mengatur X&Y Objeck
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

//Bounce X
  //Bounce Paddle Left
  if(ballX-balllRadius < 20 && ballX-balllRadius > 5){
    //When Ball between the paddle range
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY *0.20;
    }
  }

  //Bounce Paddle RIght
  if(ballX+balllRadius > canvas.width-20 && ballX-balllRadius < canvas.width-5 ){
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY *0.35;
    }
  }

  //Ball Goal Left Side
  if(ballX < 0){
    ballReset();
  }

  //Ball Goal Right Side
  if(ballX > canvas.width){
    score++;
    ballReset();
  }

//Bounce Y >> Ball will bounce when reach top / bottom boundry
  if(ballY < 0){
    ballSpeedY = -ballSpeedY;
  }
  if(ballY+balllRadius/2 >= canvas.height){
    ballSpeedY = -ballSpeedY;
  }
}

function drawStuff(){
  //Canvas Utama
  createShape(0,0,canvas.width,canvas.height,'black');
  // Validasi Winning Condition
  if (!gameState) {
    gameScreen();
    return;
  }
  //Bola
  createCircle(ballX, ballY,balllRadius,'white');
  //Padding left
  createShape(10,paddle1Y,10,PADDLE_HEIGHT,'white');
  //Padding Right
  createShape(canvas.width-20,paddle2Y,10,PADDLE_HEIGHT,'white');
  //Create score
  createText('Your Score : '+score,100,70,'white');
  //Create Net
    //Dis calculation is just adjusted as it needs
  for(var k = 15;k < canvas.height; k+=60){
  createShape(canvas.width/2,k,3,30,'white');
  }
}

//Fungsi Buat Box
function createShape(leftX,topY,width,height,drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY,width,height);
}

//Fungsi Buat Lingkaran
function createCircle(centerX,centerY,radius,color){
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY,radius,0,Math.PI*2,true);
  canvasContext.fill();
}

//Fungsi Buat Text
function createText(text,width,height,drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillText(text,width,height);
}
