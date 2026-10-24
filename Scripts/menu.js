function Menu() {
    this.main_scene = new Image();
    this.info_scene = new Image();
    this.main_scene.src = "GFX/Main.png";
    this.info_scene.src = "GFX/InfoScreen.png";
    this.difficultTitle = new MultipleImage("GFX/DifficultTitle.png", 1, 2, 70, 16);
    this.difficultTitle.src = "GFX/DifficultTitle.png";

    this.subScene = 0;

    this.menupoints = [
            { x: 122, y: 238, select: function(x) { x.startGame(); } },
            { x: 122, y: 289, select: function(x) { x.showInfo(); } },
            { x: 122, y: 340, select: function(x) { x.switchDifficulty(); } },
            { x: 122, y: 391, select: function(x) { x.quitGame(); } }
        ];
    this.selected = -1;

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
            this.difficultTitle.apply(375, 345, inGameScene.difficult);
            if (this.selected >= 0) {
                ctx.drawImage(focus, this.menupoints[this.selected].x, this.menupoints[this.selected].y);
            }
        } else {
            ctx.drawImage(this.info_scene, 0, 0);
        }
    }

    this.mouseClick = function(x, y) {
        this.select();
    }

    this.mouseMove = function(x, y) {
        this.selected = -1;

        if (this.subScene !== 0) {
            return;
        }

        for (var i = 0; i < this.menupoints.length; i++) {
            if (x > this.menupoints[i].x && x < this.menupoints[i].x + 75 &&
                y > this.menupoints[i].y && y < this.menupoints[i].y + 25) {
                this.selected = i;
                break;
            }
        }
    }

    this.startGame = function() {
        inGameScene.newGame();
        screenChange.change(function() { scene = inGameScene; });
    }

    this.showInfo = function() {
        screenChange.change(function() { menuScene.subScene = menuScene.subScene === 0 ? 1 : 0; });
    }

    this.switchDifficulty = function() {
        if (inGameScene.difficult === EASY) {
            inGameScene.difficult = HARDCORE;
        } else {
            inGameScene.difficult = EASY;
        }
    }

    this.quitGame = function() {
        screenChange.change(function() { window.close(); });
    }

    this.selectPrev = function() {
        this.selected--;
        if (this.selected < 0) {
            this.selected = 3;
        }
    }

    this.selectNext = function() {
        this.selected++;
        if (this.selected > 3) {
            this.selected = 0;
        }
    }
    this.select = function() {
        if (this.subScene === 0 && this.selected >= 0 && this.selected < this.menupoints.length) {
            this.menupoints[this.selected].select(this);
        }
    }
}
