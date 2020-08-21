const container = document.querySelector('.container'); // this selects the container.
let conDim = container.getBoundingClientRect(); // this alows you to add and change style.

// this is the start screen and game over screen.
const gameover = document.createElement('div');
gameover.textContent = "Start Game";
gameover.style.position = "absolute";
gameover.style.color = "white";
gameover.style.lineHeight = "60px";
gameover.style.height = '250px';
gameover.style.textAlign = "center";
gameover.style.fontSize = "3em";
gameover.style.textTransform = "uppercase";
gameover.style.backgroundColor = "red";
gameover.style.width = "100%";
gameover.addEventListener('click',startGame);
container.appendChild(gameover);     // all the above is style and layout. The appendChild section creates the element on the page.

// this creates the ball.
const ball = document.createElement('div');
ball.style.position = "absolute";
ball.style.width = "20px";
ball.style.height= "20px";
ball.style.backgroundColor ="red";
ball.style.borderRadius = '25px';
ball.style.top = "70%";
ball.style.left ="50%";
ball.style.display = "none";
container.appendChild(ball); // all the above is style of the ball. The appendChild section creates the ball element on the page.

// this creates the paddle. 
const paddle = document.createElement('div');
paddle.style.position = "absolute";
paddle.style.backgroundColor = "white";
paddle.style.height = "20px";
paddle.style.width = "100px";
paddle.style.borderRadius = "25px";
paddle.style.bottom = "30px";
paddle.style.left = "50%";
container.appendChild(paddle); // all the above is style and layout of paddle. The appendChild section creates the paddle element on the page.

document.addEventListener('keydown',function(e){  //This is key control setup, senses when key is pressed.
    if(e.keyCode===37)paddle.left = true;
    if(e.keyCode===39)paddle.right = true;
    if(e.keyCode===38 &&!player.inPlay)player.inPlay = true;
});

document.addEventListener('keyup',function(e){    //This senses when key is released.
    if(e.keyCode===37)paddle.left = false;
    if(e.keyCode===39)paddle.right = false;
});

const player = {
    gameover: true
};
function startGame(){                          // This starts the game when start is preesed.
    if(player.gameover){
        player.gameover = false;
        gameover.style.display = 'none';
        player.score = 0;
        player.lives = 3;
        player.inPlay = false;
        ball.style.display = "block";
        ball.style.left = paddle.offsetLeft + 50 +'px';
        ball.style.top = paddle.offsetTop + -30 +'px';
        player.ballDir = [5,-5];
        player.num = 30;
        setupBricks(20);
        scoreUpdater();
        player.ani = window.requestAnimationFrame(update);
     }
}

function setupBricks(num){                     // This sets up the bricks when game is started.
    let row = {
        x:((conDim.width % 100)/2),
        y: 50
    }
    let skip = false;
    for(let x=0;x<num;x++){                      // This sets the size of bricks. 
        if(row.x >(conDim.width - 100)){
            row.y += 50;
            if(row.y > (conDim.height/2)){
                skip = true;
            }
            row.x = ((conDim.width % 100)/2); 
        }
        row.count =x;
        if(!skip) {createBrick(row);}
        row.x += 100;
    }
}

function createBrick(pos){                        // This sets the postion of bricks.
    const div = document.createElement('div');
    div.setAttribute('class','brick');
    div.style.backgroundColor = rColor();
    div.textContent = pos.count + 1;
    div.style.left = pos.x +'px';
    div.style.top = pos.y +'px';
    container.appendChild(div);
}

function isCollide(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.right < bRect.left)||
        (aRect.left > bRect.right)||
        (aRect.bottom < bRect.top)||
        (aRect.top > bRect.bottom));
}

function rColor(){
    return '#' + Math.random().toString(16).substr(-6);  //This creates a random color.
}

function scoreUpdater(){
    document.querySelector('.score').textContent = player.score;  // This updates the score and the number lives left.
    document.querySelector('.lives').textContent = player.lives;
}

function update(){      
if(!player.gameover) {                                        // This updates paddles postion when its moved.
    let pCurrent = paddle.offsetLeft;
    
    if(paddle.left && pCurrent > 0){
        pCurrent -= 5;
    }
    if(paddle.right && (pCurrent < (conDim.width - paddle.offsetWidth))){
     pCurrent += 5;
    }
    
    paddle.style.left = pCurrent +'px';

    if(!player.inPlay){
        waitingOnPaddle();
    }else{
        moveBall();
    }
    player.ani = window.requestAnimationFrame(update);
    } 
}

function waitingOnPaddle(){
    ball.style.top =(paddle.offsetTop -22) +'px';
        ball.style.left =(paddle.offsetLeft+ 40) +'px';
}

function fallOff(){
    player.lives --;
    if(player.lives<0){
        endGame();
        player.lives = 0;
    }
    scoreUpdater();
    stopper();
}

function endGame(){
    gameover.style.display = 'block';
    gameover.innerHTML = 'Game Over<br>Your score'+player.score;
    player.gameover = true;
    ball.style.display = 'none';
    let tempBricks = document.querySelectorAll('.brick');
    for(let tBrick of tempBricks){
        tBrick.parentNode.removeChild(tBrick);
    }
}
function stopper(){
    player.inPlay = false;
    player.ballDir[0,-5];
    waitingOnPaddle();
    window.cancelAnimationFrame(player.ani);

}

function moveBall(){
    let posBall = {
        x:ball.offsetLeft,
        y:ball.offsetTop
    }

    if(posBall.y >(conDim.height-20)||posBall.y < 0){
        if(posBall.y > (conDim.height -20)){
            fallOff();
        }
        else{

        player.ballDir[1]*= -1;
        }
    }
    if(posBall.x >(conDim.width-20)||posBall.x < 0){
        player.ballDir[0]*= -1;
    }
    if(isCollide(paddle,ball)){
    let temp = ((posBall.x - paddle.offsetLeft)-
        (paddle.offsetWidth/ 2))/ 10;    
        console.log('hit');
        player.ballDir[0] = temp;
        player.ballDir[1] *= -1;
    };

    let bricks = document.querySelectorAll('.brick');
    if(bricks.length == 0){
        stopper();
        setupBricks(player.num)
    }
    for(let tBrick of bricks){
        if(isCollide(tBrick,ball)){
            player.ballDir[1]*= -1;
            tBrick.parentNode.removeChild(tBrick);
            player.score++;
            scoreUpdater();
        }
    }
    posBall.y += player.ballDir[1];
    posBall.x += player.ballDir[0];
    ball.style.top = posBall.y +'px';
    ball.style.left = posBall.x +'px';

}
