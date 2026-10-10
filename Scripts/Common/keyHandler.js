var keystates = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  keystates[e.which] = true;

  if (e.which === KEY_RETURN) {
    scene.select();
  } else if (e.which === KEY_UP) {
    scene.selectPrev();
  } else if (e.which === KEY_DOWN) {
    scene.selectNext();
  } else if (e.which === KEY_ESCAPE) {
    scene.back();
  }
}

function keyUpHandler(e) {
  keystates[e.which] = false;
}
