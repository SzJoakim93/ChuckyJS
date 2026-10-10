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

var focus = new Image();
focus.src = "GFX/Focus.png";

function sizeCanvas() {
    var scaleToFit = Math.min(innerWidth / canvas.width, innerHeight / canvas.height);

    canvas.style.position = "fixed";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.width = (canvas.width * scaleToFit).toString() + "px";
    canvas.style.height = (canvas.height * scaleToFit).toString() + "px";
    canvas.style.transform = "translate(-50%, -50%)";
}

function getCanvasCoordinates(e) {
    var canvasBounds = canvas.getBoundingClientRect();

    return {
        x: (e.clientX - canvasBounds.left) * canvas.width / canvasBounds.width,
        y: (e.clientY - canvasBounds.top) * canvas.height / canvasBounds.height
    };
}

sizeCanvas();
addEventListener("resize", sizeCanvas);

function drawText(x, y, color, size, text, aling) {
    ctx.font = size.toString() + "px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = aling;
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

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", clickHandler, false);

function mouseMoveHandler(e) {
    if (e.target && e.target.closest && e.target.closest(".touch-button")) {
        return;
    }

    if (scene.mouseMove) {
        scene.mouseMove(e);
    }
}

function clickHandler(e) {
    if (e.target && e.target.closest && e.target.closest(".touch-button")) {
        return;
    }
    if (scene.mouseClick) {
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
        gamepadButtonDownHandler();
        scene.rendering();
    }
}

limitLoop(main, 30);