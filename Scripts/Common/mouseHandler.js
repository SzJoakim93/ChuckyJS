document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    if (e.target && e.target.closest && e.target.closest(".touch-button")) {
        return;
    }

    var rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        var x = (e.clientX - rect.left) * canvas.width / rect.width;
        var y = (e.clientY - rect.top) * canvas.height / rect.height;

        if (scene.mouseMove) {
            scene.mouseMove(x, y);
        }
    }
}

function clickHandler(e) {
    if (e.target && e.target.closest && e.target.closest(".touch-button")) {
        return;
    }
    var rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        var x = (e.clientX - rect.left) * canvas.width / rect.width;
        var y = (e.clientY - rect.top) * canvas.height / rect.height;
        if (virtualKeyboard.visible) {
            virtualKeyboard.selectAt(x, y);
        } else if (scene.mouseClick) {
            scene.mouseClick(x, y);
        }
    }
}
