function Menu() {
    this.main_scene = new Image();
    this.info_scene = new Image();
    this.main_scene.src = "GFX/Main.png";
    this.info_scene.src = "GFX/InfoScreen.png";

    this.subScene = 0;
    this.handleEvents = function() {
        if (this.subScene === 0) {
            if (keystates[KEY_SPACE] || isActionPressed("x", false)) {
                inGameScene.newGame();
                screenChange.change(function() { scene = inGameScene; });
            }
        }

        if (keystates[KEY_LSHIFT] || keystates[KEY_RSHIFT] || isActionPressed("b", false)) {
            screenChange.change(function() { menuScene.subScene = menuScene.subScene === 0 ? 1 : 0; });
        }
    }

    this.rendering = function() {
        if (this.subScene === 0) {
            ctx.drawImage(this.main_scene, 0, 0);
            drawText(320, 430, white, 15, inGameScene.difficult, "center");
        } else {
            ctx.drawImage(this.info_scene, 0, 0);
        }
    }

    this.select = function() {
        if (this.subScene === 0) {
            if (inGameScene.difficult === 'Easy') {
                inGameScene.difficult = "HardCore";
            } else {
                inGameScene.difficult = "Easy";
            }
        }
    }
}
