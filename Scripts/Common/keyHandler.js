var keystates = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
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
  } else if (keyCode === KEY_ESCAPE && scene.back) {
    scene.back();
  }
}

function keyUpHandler(e) {
  keystates[e.which] = false;
}
