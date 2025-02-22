function Menu() {
    this.main_scene = new Image();
    this.info_scene = new Image();
    this.main_scene.src = "GFX/Main.png";
    this.info_scene.src = "GFX/InfoScreen.png";

    this.subScene = 0;
    this.handleEvents = function() {
        if (this.subScene === 0) {
            if (keystates[KEY_SPACE]) {
                inGameScene.newGame();
                screenChange.change(function() { scene = inGameScene; });
            } else if (keystates[KEY_RETURN]) {
                if (inGameScene.difficult === 'Easy') {
                    inGameScene.difficult = "HardCore";
                } else {
                    inGameScene.difficult = "Easy";
                }
            }
        }

        if (keystates[KEY_LSHIFT] || keystates[KEY_RSHIFT]) {
            screenChange.change(function() { menuScene.subScene = menuScene.subScene === 0 ? 1 : 0; });
        }
    }

    this.rendering = function() {
        if (this.subScene === 0) {
            ctx.drawImage(this.main_scene, 0, 0);
            drawText(310, 412, white, 15, inGameScene.difficult);
        } else {
            ctx.drawImage(this.info_scene, 0, 0);
        }
    }
}
