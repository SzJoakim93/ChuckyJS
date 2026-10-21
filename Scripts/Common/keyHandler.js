var keystates = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (scene.isEnteringName && scene.isEnteringName()) {
    if (e.key === "Backspace") {
      e.preventDefault();
      scene.inputChar("Backspace");
      return;
    } else if (e.key === " ") {
      e.preventDefault();
      scene.inputChar(" ");
      return;
    } else if (e.key && e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
      e.preventDefault();
      scene.inputChar(e.key.toUpperCase());
      return;
    } else if (e.key === "Enter") {
      e.preventDefault();
      scene.finishNameEntry();
      return;
    }
  }
  processKeyDown(e.which);
}

function processKeyDown(keyCode) {
  keystates[keyCode] = true;

  if ((keyCode === KEY_RETURN || keyCode === KEY_SPACE || keyCode === KEY_LSHIFT) && scene.select) {
    scene.select();
  } else if (keyCode === KEY_UP && scene.selectPrev) {
    scene.selectPrev();
  } else if (keyCode === KEY_DOWN && scene.selectNext) {
    scene.selectNext();
  } else if (keyCode === KEY_LEFT && scene.selectLeft) {
    scene.selectLeft();
  } else if (keyCode === KEY_RIGHT && scene.selectRight) {
    scene.selectRight();
  } else if (keyCode === KEY_ESCAPE && scene.back) {
    scene.back();
  }
}

function keyUpHandler(e) {
  keystates[e.which] = false;
}
