function InGame() {
    this.comp_table = new Image();
    this.comp_table.src = "GFX/CompTable.png";
    this.table = new Image();
    this.table.src = "GFX/Table.png";

    this.chicken_start = new Sound("SFX/chicken_start.wav");
    this.chicken2 = new Sound("SFX/chicken2.wav");
    this.chicken_kill = new Sound("SFX/chickenkill.wav");
    this.pickup_egg = new Sound("SFX/pickup.wav");
    this.pickup_sand = new Sound("SFX/sound2.wav");
    this.level_pass = new Sound("SFX/levelpass.wav");
    this.fallout = new Sound("SFX/fallout.wav");
    this.start_sound = new Sound("SFX/start.wav");

    this.frame = 1;
    this.start = false;
    this.completed = false;
    this.showCompPanel = false;
    this.completedTimeOut = new TimeoutEvent(120, function() { inGameScene.showCompPanel = true; });

    this.currentLevel = 0;
    this.level = new Level();
    this.player = new Player();

    this.difficult = "Easy";

    this.handleEvents = function() {
        if ((keystates[KEY_SPACE] || isActionPressed("a", false)) && this.completed) {
            this.currentLevel++;
            this.player.points += this.player.bonus;
            if (this.currentLevel > levelData.length) {
                this.player.points += this.player.lives * 50;
                scoreScene.currentScore = this.points;
                scoreScene.subScene = 3;
                screenChange.change(function() { scene = scoreScene; });
            } else {
                this.completed = false;
                this.showCompPanel = false;
                this.start = false;
                screenChange.change(function() { inGameScene.level.load(inGameScene.currentLevel); });
            }
        }

        if (!this.completed) {
            if (!this.player.dead) {
                if (keystates[KEY_LEFT] || keystates[KEY_RIGHT] || isActionPressed("left", false) || isActionPressed("right", false)) {
                    if (!this.start) {
                        this.start = true;
                        if (this.level.bigChicken.isActive && this.level.gate.currAnim === 0) {
                            this.level.gate.switchAnim(1);
                        }
                        this.chicken_start.play();
                    }
                } 
            }

            this.player.handleEvents();
            this.level.handleEvents();
        }

        this.completedTimeOut.handleEvent();
    }

    this.rendering = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.table, 80, 0);
        drawText(185, 32, "yellow", 18, this.player.lives.toString(), "right");
        drawText(358, 32, "lightblue", 18, this.player.points.toString(), "right");
        drawText(482, 32, "lightgreen", 18, this.player.bonus.toString(), "right");
        drawText(595, 32, "red", 18, Math.floor(this.player.time/2).toString(), "right");

        this.level.rendering();
        this.player.rendering();

        if (this.showCompPanel) {
            ctx.drawImage(this.comp_table, 152, 318);
        }
    }

    this.resetGame = function() {
        if (this.player.life === 0) {
            return;
        }

        this.level.reset();
        this.player.kill();

        this.start = false;
    }

    this.newGame = function() {
        this.currentLevel = 0;
        this.level.load(this.currentLevel);
        this.player.setNewGame();
    }

    this.levelComplete = function() {
        this.level_pass.play();
        this.completed = true;
        this.completedTimeOut.launch();
    }
}