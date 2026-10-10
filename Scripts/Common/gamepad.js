function gamepadButtonDownHandler() {
    if (scene.selectPrev && isActionPressed("up", true)) {
        scene.selectPrev();
    } else if (scene.selectNext && isActionPressed("down", true)) {
        scene.selectNext();
    } else if (scene.select && isActionPressed("a", true)) {
        scene.select();
    }
}

function getActiveGamepads() {
    var gps = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    var actives = [];
    for (var i = 0; i < gps.length; i++) {
        if (gps[i]) {
            actives.push(gps[i]);
        }
    }
    return actives;
}

function getFirstGamepad() {
    var gps = getActiveGamepads();
    for (var i = 0; i < gps.length; i++) {
        if (gps[i]) {
            return gps[i];
        }
    }
    return null;
}

var prevActions = {};

function isActionPressed(action, checkEdge) {
    var pressed = false;
    var gp = getFirstGamepad();

    if (gp) {
        var b = gp.buttons;
        var a = gp.axes;
        if (action === "up") pressed = (b[12] && b[12].pressed) || (a[1] !== undefined && a[1] < -0.5);
        else if (action === "down") pressed = (b[13] && b[13].pressed) || (a[1] !== undefined && a[1] > 0.5);
        else if (action === "left") pressed = (b[14] && b[14].pressed) || (a[0] !== undefined && a[0] < -0.5);
        else if (action === "right") pressed = (b[15] && b[15].pressed) || (a[0] !== undefined && a[0] > 0.5);
        else if (action === "a") pressed = (b[0] && b[0].pressed);
        else if (action === "b") pressed = (b[1] && b[1].pressed) || (b[2] && b[2].pressed);
        else if (action === "x") pressed = (b[3] && b[3].pressed) || (b[4] && b[4].pressed);
    }

    if (checkEdge) {
        var key = action;
        if (pressed && !prevActions[key]) {
            prevActions[key] = true;
            return true;
        } else if (!pressed) {
            prevActions[key] = false;
        }
        return false;
    }

    return pressed;
}

function anyGamepadButtonPressed() {
    var gps = getActiveGamepads();
    for (var i = 0; i < gps.length; i++) {
        var gp = gps[i];
        if (!gp) {
            continue;
        }
        for (var b = 0; b < gp.buttons.length; b++) {
            if (gp.buttons[b].pressed) return true;
        }
    }
    return false;
}
