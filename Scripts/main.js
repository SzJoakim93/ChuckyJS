var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var white = "#FFFFFF";
var gold = "#E4C42C"

var menuScene = new Menu();
var scoreScene = new ScoresMenu();
var inGameScene = new InGame();
var scene = menuScene;
scoreScene.load();

canvas.width = 640;
canvas.height = 480;

function sizeCanvas() {
    var scaleX = (innerWidth - 20) / canvas.width;
    var scaleY = (innerHeight - 20) / canvas.height;

    var scaleToFit = Math.min(scaleX, scaleY);

    myCanvas.style.transformOrigin = "50% 0 0"; //scale from top left
    myCanvas.style.transform = "translateX(" + (innerWidth / 2 - canvas.width / 2).toString() + "px) scale("+ scaleToFit.toString() + ")";
}

sizeCanvas();
addEventListener("resize", sizeCanvas);

function drawText(x, y, color, size,text) {
    ctx.font = size.toString() + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text.toString(), x, y);
}

window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
       	window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(f) {
			window.setTimeout(f,1e3/60);
		}
}();

function goFullScreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", clickHandler, false);

function keyDownHandler(e) {
    if (scene === scoreScene) {
        if (e.key >= "a" && e.key <= "z" || e.key === "Backspace") {
            scene.inputChar(e.key)
        }
    }
}

function mouseMoveHandler(e) {
    if (scene === scoreScene) {
        scene.mouseMove(e);
    }
}

function clickHandler(e) {
    if (scene === scoreScene) {
        scene.mouseClick(e);
    }
}

var quit = false;

function main() {
gameloop: {
    if (screenChange.isChanging) {
        screenChange.changing();
        break gameloop;
    }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.handleEvents();
        scene.rendering();
    }
    //_requestAnimationFrame(main);
}

limitLoop(main, 30);