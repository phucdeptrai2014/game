const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

const scoreText=document.getElementById("score");
const highText=document.getElementById("high");

const grid=30;

let snake=[
{x:10,y:10}
];

let food=randomFood();
let foodAngle = 0;
let particles = [];
let wave = 0;

let dx=1;
let dy=0;

let score=0;

let high=localStorage.getItem("snakeHigh")||0;

highText.innerHTML=high;

document.addEventListener("keydown",keyControl);

function keyControl(e){

const k=e.key.toLowerCase();

if((k==="arrowup"||k==="w")&&dy!==1){

dx=0;
dy=-1;

}

if((k==="arrowdown"||k==="s")&&dy!==-1){

dx=0;
dy=1;

}

if((k==="arrowleft"||k==="a")&&dx!==1){

dx=-1;
dy=0;

}

if((k==="arrowright"||k==="d")&&dx!==-1){

dx=1;
dy=0;

}

}

function game(){

let head={

x:snake[0].x+dx,
y:snake[0].y+dy

};

if(

head.x<0||

head.y<0||

head.x>=20||

head.y>=20

){

restart();

return;

}

for(let s of snake){

if(head.x===s.x&&head.y===s.y){

restart();

return;

}

}

snake.unshift(head);

if(head.x===food.x&&head.y===food.y){

score++;

scoreText.innerHTML=score;

if(score>high){

high=score;

localStorage.setItem("snakeHigh",high);

highText.innerHTML=high;

}

food=randomFood();

}else{

snake.pop();

}

draw();

}

function draw(){

ctx.clearRect(0,0,600,600);
wave += 0.15;

drawBoard();

function drawFood(){

    foodAngle += 0.08;

    let x = food.x * grid + 15;
    let y = food.y * grid + 15;

    // ===== Ánh sáng =====
    ctx.shadowColor = "#ff4444";
    ctx.shadowBlur = 35;

    // ===== Quả bóng 3D =====
    let ball = ctx.createRadialGradient(
        x-5,
        y-5,
        2,
        x,
        y,
        15
    );

    ball.addColorStop(0,"#ffffff");
    ball.addColorStop(.25,"#ffaaaa");
    ball.addColorStop(.65,"#ff3333");
    ball.addColorStop(1,"#990000");

    ctx.fillStyle = ball;

    ctx.beginPath();
    ctx.arc(x,y,12,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // ===== Hiệu ứng quay =====
    let hx = x + Math.cos(foodAngle)*6;
    let hy = y + Math.sin(foodAngle)*6;

    ctx.fillStyle="rgba(255,255,255,.85)";

    ctx.beginPath();
    ctx.arc(hx,hy,3,0,Math.PI*2);
    ctx.fill();

    // ===== Tạo Particle =====
    if(Math.random()<0.35){

        particles.push({

            x:x,
            y:y,

            vx:(Math.random()-0.5)*1.6,
            vy:(Math.random()-0.5)*1.6,

            life:25,

            size:2+Math.random()*3

        });

    }

    drawParticles();

}
drawFood()
function drawParticles(){

    for(let i=particles.length-1;i>=0;i--){

        let p=particles[i];

        p.x+=p.vx;
        p.y+=p.vy;

        p.life--;

        ctx.fillStyle="rgba(255,120,120,"+(p.life/25)+")";

        ctx.beginPath();
        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );
        ctx.fill();

        if(p.life<=0){

            particles.splice(i,1);

        }

    }

}

drawSnake();

}

function drawBoard(){

for(let x=0;x<20;x++){

for(let y=0;y<20;y++){

ctx.fillStyle=(x+y)%2==0?"#34495e":"#3d566e";

ctx.fillRect(

x*grid,

y*grid,

grid,

grid

);

}

}

}



function drawSnake() {

    snake.forEach((part, index) => {

        let offsetX = 0;
let offsetY = 0;

// Chỉ thân rắn mới uốn
if(index>0){

    let angle = wave - index * 0.5;

    if(dx!==0){

        offsetY = Math.sin(angle)*3;

    }

    if(dy!==0){

        offsetX = Math.sin(angle)*3;

    }

}

let x = part.x * grid + offsetX;
let y = part.y * grid + offsetY;

        // ===== Đổ bóng =====
        ctx.shadowColor = "rgba(0,255,120,0.8)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // ===== Hiệu ứng 3D =====
        let body = ctx.createLinearGradient(
            x,
            y,
            x + grid,
            y + grid
        );

        body.addColorStop(0, "#9CFF57");
        body.addColorStop(0.5, "#2ECC71");
        body.addColorStop(1, "#0B6623");

        ctx.fillStyle = body;

 ctx.beginPath();

ctx.arc(
    x+15,
    y+15,
    15,
    0,
    Math.PI*2
);

ctx.fill();

ctx.save();

ctx.translate(x+15,y+15);

ctx.rotate(Math.sin(wave-index*0.4)*0.08);

ctx.translate(-(x+15),-(y+15));

if(index>0){

    let prev=snake[index-1];

    let px=prev.x*grid+15;
    let py=prev.y*grid+15;

    let body=ctx.createLinearGradient(
        px,
        py,
        x+15,
        y+15
    );

    body.addColorStop(0,"#55ff55");
    body.addColorStop(1,"#006600");

    ctx.strokeStyle=body;

    ctx.lineWidth=22;

    ctx.lineCap="round";

    ctx.beginPath();

    ctx.moveTo(px,py);

    ctx.lineTo(x+15,y+15);

    ctx.stroke();

}


        ctx.fill();
ctx.restore();

        // ===== Ánh sáng phản chiếu =====
        ctx.shadowBlur = 0;

        let light = ctx.createLinearGradient(
            x,
            y,
            x,
            y + 18
        );

        light.addColorStop(0, "rgba(255,255,255,0.75)");
        light.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = light;

        roundRect(
            x + 6,
            y + 4,
            14,
            8,
            4
        );

        ctx.fill();

        // ===== Đầu rắn =====
        if(index===0){
            // ===== ĐẦU RẮN 3D =====

ctx.shadowColor="#00ff66";
ctx.shadowBlur=30;

let headGradient=ctx.createRadialGradient(
    x+10,
    y+10,
    2,
    x+15,
    y+15,
    16
);

headGradient.addColorStop(0,"#d8ffb0");
headGradient.addColorStop(.4,"#7CFC00");
headGradient.addColorStop(.75,"#32CD32");
headGradient.addColorStop(1,"#0B6623");

ctx.fillStyle=headGradient;

ctx.beginPath();
ctx.arc(
    x+15,
    y+15,
    18,
    0,
    Math.PI*2
);
ctx.fill();

ctx.shadowBlur=0;

ctx.fillStyle="rgba(30,120,20,.6)";

ctx.beginPath();

ctx.ellipse(
    x+15,
    y+22,
    12,
    7,
    0,
    0,
    Math.PI*2
);

ctx.fill();
// ===== Phản chiếu ánh sáng =====

ctx.fillStyle="rgba(255,255,255,.45)";

ctx.beginPath();
ctx.arc(
    x+9,
    y+8,
    5,
    0,
    Math.PI*2
);
ctx.fill()

            // ===== Mắt trái =====

ctx.shadowColor="#99ff00";
ctx.shadowBlur=10;

ctx.fillStyle="#ffffcc";

ctx.beginPath();
ctx.arc(
    x+10,
    y+11,
    4,
    0,
    Math.PI*2
);
ctx.fill();
            
// ===== Mắt phải =====

ctx.beginPath();
ctx.arc(
    x+20,
    y+11,
    4,
    0,
    Math.PI*2
);
ctx.fill();

           // ===== Đồng tử =====

ctx.fillStyle="black";

ctx.beginPath();
ctx.arc(
    x+11,
    y+12,
    2,
    0,
    Math.PI*2
);
ctx.fill();

ctx.beginPath();
ctx.arc(
    x+21,
    y+12,
    2,
    0,
    Math.PI*2
);
ctx.fill();

       // ===== Mũi =====

ctx.fillStyle="#145A32";

ctx.beginPath();
ctx.arc(
    x+15,
    y+18,
    2,
    0,
    Math.PI*2
);
ctx.fill();
            // ===== Lưỡi =====

            ctx.strokeStyle="#ff0033";
            ctx.lineWidth=2;

            ctx.beginPath();

            if(dx===1){

                ctx.moveTo(x+30,y+15);
                ctx.lineTo(x+38,y+15);

                ctx.moveTo(x+38,y+15);
                ctx.lineTo(x+42,y+12);

                ctx.moveTo(x+38,y+15);
                ctx.lineTo(x+42,y+18);

            }

            if(dx===-1){

                ctx.moveTo(x,y+15);
                ctx.lineTo(x-8,y+15);

                ctx.moveTo(x-8,y+15);
                ctx.lineTo(x-12,y+12);

                ctx.moveTo(x-8,y+15);
                ctx.lineTo(x-12,y+18);

            }

            if(dy===-1){

                ctx.moveTo(x+15,y);
                ctx.lineTo(x+15,y-8);

                ctx.moveTo(x+15,y-8);
                ctx.lineTo(x+12,y-12);

                ctx.moveTo(x+15,y-8);
                ctx.lineTo(x+18,y-12);

            }

            if(dy===1){

                ctx.moveTo(x+15,y+30);
                ctx.lineTo(x+15,y+38);

                ctx.moveTo(x+15,y+38);
                ctx.lineTo(x+12,y+42);

                ctx.moveTo(x+15,y+38);
                ctx.lineTo(x+18,y+42);

            }

            ctx.stroke();

if(index==snake.length-1){

    ctx.fillStyle="#006600";

    ctx.beginPath();

    ctx.moveTo(x+15,y+15);

    ctx.lineTo(x+4,y+26);

    ctx.lineTo(x+26,y+26);

    ctx.closePath();

    ctx.fill();

}



        }

    });
}

function drawFood(){

let x=food.x*grid+15;

let y=food.y*grid+15;

let g=ctx.createRadialGradient(

x-5,

y-5,

2,

x,

y,

14

);

g.addColorStop(0,"#fff");

g.addColorStop(.3,"#ff8888");

g.addColorStop(1,"red");

ctx.fillStyle=g;

ctx.beginPath();

ctx.arc(x,y,12,0,Math.PI*2);

ctx.fill();

}

function roundRect(x,y,w,h,r){

ctx.beginPath();

ctx.moveTo(x+r,y);

ctx.lineTo(x+w-r,y);

ctx.quadraticCurveTo(x+w,y,x+w,y+r);

ctx.lineTo(x+w,y+h-r);

ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);

ctx.lineTo(x+r,y+h);

ctx.quadraticCurveTo(x,y+h,x,y+h-r);

ctx.lineTo(x,y+r);

ctx.quadraticCurveTo(x,y,x+r,y);

ctx.closePath();

}

function randomFood(){

let f;

while(true){

f={

x:Math.floor(Math.random()*20),

y:Math.floor(Math.random()*20)

};

let ok=true;

for(let s of snake){

if(s.x===f.x&&s.y===f.y){

ok=false;

break;

}

}

if(ok) return f;

}

}

function restart(){

alert("Game Over!\nĐiểm của bạn: "+score);

snake=[{x:10,y:10}];

dx=1;

dy=0;

score=0;

scoreText.innerHTML=0;

food=randomFood();

draw();

}

draw();

setInterval(game,120);