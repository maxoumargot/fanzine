// Dark Mode
const toggleSwitch = document.querySelector('.theme-switch');
toggleSwitch.addEventListener('change', e => {
  if(e.target.checked) document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.setAttribute('data-theme','light');
  localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
  updateSnakeColors();
});

// Charger thème précédent
const currentTheme = localStorage.getItem('theme');
if(currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  toggleSwitch.checked = currentTheme === 'dark';
}

// Snake
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake, fruit;
let snakeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
let bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
canvas.style.backgroundColor = bgColor;

function setup() {
  snake = new Snake();
  fruit = new Fruit();
  fruit.pickLocation();

  setInterval(() => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fruit.draw();
    snake.update();
    snake.draw();
    if(snake.eat(fruit)) fruit.pickLocation();
    snake.checkCollision();
  }, 150);
}
setup();

// Clavier WASD + flèches
window.addEventListener('keydown', e => {
  const key = e.key;
  switch(key) {
    case 'ArrowUp': case 'w': case 'W': snake.changeDirection('Up'); e.preventDefault(); break;
    case 'ArrowDown': case 's': case 'S': snake.changeDirection('Down'); e.preventDefault(); break;
    case 'ArrowLeft': case 'a': case 'A': snake.changeDirection('Left'); e.preventDefault(); break;
    case 'ArrowRight': case 'd': case 'D': snake.changeDirection('Right'); e.preventDefault(); break;
  }
});

// Mettre à jour les couleurs du Snake
function updateSnakeColors(){
  snakeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
  canvas.style.backgroundColor = bgColor;
}

// Snake
function Snake() {
  this.x=0; this.y=0; this.xSpeed=scale; this.ySpeed=0; this.total=0; this.tail=[];
  this.draw=function(){
    ctx.fillStyle=snakeColor;
    for(let i=0;i<this.tail.length;i++){
      ctx.fillRect(this.tail[i].x,this.tail[i].y,scale,scale);
      ctx.strokeStyle=bgColor; ctx.strokeRect(this.tail[i].x,this.tail[i].y,scale,scale);
    }
    ctx.fillRect(this.x,this.y,scale,scale);
    ctx.strokeRect(this.x,this.y,scale,scale);
  }
  this.update=function(){
    for(let i=0;i<this.tail.length-1;i++) this.tail[i]=this.tail[i+1];
    if(this.total>=1) this.tail[this.total-1]={x:this.x,y:this.y};
    this.x+=this.xSpeed; this.y+=this.ySpeed;
    if(this.x>=canvas.width) this.x=0; if(this.y>=canvas.height) this.y=0;
    if(this.x<0) this.x=canvas.width-scale; if(this.y<0) this.y=canvas.height-scale;
  }
  this.changeDirection=function(dir){
    switch(dir){
      case 'Up': if(this.ySpeed===0){this.xSpeed=0; this.ySpeed=-scale;} break;
      case 'Down': if(this.ySpeed===0){this.xSpeed=0; this.ySpeed=scale;} break;
      case 'Left': if(this.xSpeed===0){this.xSpeed=-scale; this.ySpeed=0;} break;
      case 'Right': if(this.xSpeed===0){this.xSpeed=scale; this.ySpeed=0;} break;
    }
  }
  this.eat=function(f){ if(this.x===f.x && this.y===f.y){ this.total++; return true;} return false;}
  this.checkCollision=function(){ for(let i=0;i<this.tail.length;i++){ if(this.x===this.tail[i].x && this.y===this.tail[i].y){ alert("Game Over !"); this.total=0; this.tail=[]; this.x=0; this.y=0; this.xSpeed=scale; this.ySpeed=0; } } }
}

function Fruit() {
  this.pickLocation=function(){ this.x=Math.floor(Math.random()*columns)*scale; this.y=Math.floor(Math.random()*rows)*scale; }
  this.draw=function(){ ctx.fillStyle=snakeColor; ctx.fillRect(this.x,this.y,scale,scale); ctx.strokeStyle=bgColor; ctx.strokeRect(this.x,this.y,scale,scale); }
}