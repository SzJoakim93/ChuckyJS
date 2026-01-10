function ScoresMenu() {

    this.game_over = new Image();
    this.high_scene = new Image();
    this.win_graph = new Image();
    this.focus = new Image();
    this.popPupPanel = new Image();
    this.inputBox = new Image();
    this.game_over.src = "GFX/GameOver.png";
    this.high_scene.src = "GFX/HighScores.png";
    this.win_graph.src = "GFX/WinScreen.png";
    this.focus.src = "GFX/Focus.png";
    this.popPupPanel.src = "GFX/PopUpPanel.png";
    this.inputBox.src = "GFX/InputBox.png";
    this.highScores = [];

    this.currentName = "";
    this.currentScore = 0;
    this.currentPos = 0;

    this.subScene = 0;
    this.selected = 0;
    this.gameOverTimeOut = new TimeoutEvent(40, switchToScoresSubMenu);

    this.mouseCoord = { x: canvas.width / 2, y: canvas.height / 2 }

    this.handleEvents = function() {
        switch(this.subScene) {
            case 0:
                if (keystates[KEY_ESCAPE]) {
                    quit = true;
                }
                break;
            case 1:
                if (keystates[KEY_RETURN]) {
                    this.insert();
                    this.subScene = 0;
                }
                break;
            case 2:
                this.gameOverTimeOut.launch();
                break;
            case 3:
                if (keystates[KEY_RETURN]) {
                    switchToScoresSubMenu();
                }
                break;
            case 4:
                if (keystates[KEY_Y]) {
                    this.resetScore();
                    this.subScene = 0;
                } else if (keystates[KEY_N]) {
                    this.subScene = 0;
                }
                break;
        }

        this.gameOverTimeOut.handleEvent();
    }

    this.rendering = function() {
        switch(this.subScene) {
            case 0:
                ctx.drawImage(this.high_scene, 0, 0);

                for (var i = 0; i < this.highScores.length; i++) {
                    drawText(255, 90 + (i*20), i === this.currentPos ? gold : white, 15, i + 1, "left");
                    drawText(280, 90 + (i*20), i === this.currentPos ? gold : white, 15, this.highScores[i].Name, "left");
                    drawText(580, 90 + (i*20), i === this.currentPos ? gold : white, 15, this.highScores[i].Score, "right");
                }

                if (this.selected === 0) {
                    ctx.drawImage(this.focus, 86, 112);
                } else if (this.selected === 1) {
                    ctx.drawImage(this.focus, 86, 199);
                } else if (this.selected === 2) {
                    ctx.drawImage(this.focus, 86, 286);
                } else if (this.selected === 3) {
                    ctx.drawImage(this.focus, 86, 409);
                }
                break;
            case 1:
                ctx.drawImage(this.popPupPanel, 148, 200);
                ctx.drawImage(this.inputBox, 201, 261);
                drawText(148 + 171, 240, gold, 15, "Add name of high score and press enter", "center");
                drawText(205, 275, white, 15, this.currentName + "|", "left");
                break;
            case 2:
                ctx.drawImage(this.game_over, 0, 0);
                break;
            case 3:
                ctx.drawImage(this.win_graph, 0, 0);
                break;
            case 4:
                ctx.drawImage(this.popPupPanel, 148, 200);
                drawText(148 + 171, 250, gold, 15, "Reset scores?", "center");
                drawText(148 + 171, 270, gold, 15, "(Y/N)", "center");
                break;
        }
    }

    this.inputChar = function(c) {
        if (this.subScene === 1) {
            if (c === "Backspace") {
                this.currentName = this.currentName.slice(0, -1); 
            } else if (this.currentName.length < 16) {
                this.currentName += c;
            }
        }
    }

    this.load = function() {
        this.currentPos = 16;
        this.highScores = JSON.parse(loadData("chucky_high_scores"));
        if (this.highScores === null) {
            this.resetScore();
        }
    }

    this.save = function() {
        if (this.highScores) {
            saveData("chucky_high_scores", JSON.stringify(this.highScores));
        }
    }

    this.resetScore = function() {
        this.highScores = [
            { Name: '', Score: 1500, Level: 15 },
            { Name: '', Score: 1400, Level: 15 },
            { Name: '', Score: 1300, Level: 15 },
            { Name: '', Score: 1200, Level: 15 },
            { Name: '', Score: 1100, Level: 15 },
            { Name: '', Score: 1000, Level: 15 },
            { Name: '', Score: 900, Level: 15 },
            { Name: '', Score: 800, Level: 15 },
            { Name: '', Score: 700, Level: 15 },
            { Name: '', Score: 600, Level: 15 },
            { Name: '', Score: 500, Level: 15 },
            { Name: '', Score: 400, Level: 15 },
            { Name: '', Score: 300, Level: 15 },
            { Name: '', Score: 200, Level: 15 },
            { Name: '', Score: 100, Level: 15 }
        ]
    }

    this.insert = function() {
        for (var i = 0; i < this.highScores.length; i++) {
            if (this.currentScore > this.highScores[i].Score) {
                this.highScores.splice(i, 0, { Name: this.currentName, Score: this.currentScore, Level: inGameScene.currentLevel });
                this.highScores.length -= 1;
                this.currentPos = i;
                break;
            }
        }
        this.save();
    }

    this.mouseClick = function(e) {
        this.select();
    }

    this.mouseMove = function(e) {
        this.mouseCoord.x = (e.clientX - canvas.offsetLeft) / scaleX;
        this.mouseCoord.y = (e.clientY - canvas.offsetTop) / scaleY;

        if (this.mouseCoord.y > 112 && this.mouseCoord.y < 136) {
            this.selected = 0;
        } else if (this.mouseCoord.y > 199 && this.mouseCoord.y < 223) {
            this.selected = 1
        } else if (this.mouseCoord.y > 285 && this.mouseCoord.y < 310) {
            this.selected = 2;
        } else if (this.mouseCoord.y > 409 && this.mouseCoord.y < 434) {
            this.selected = 3;
        } else {
            this.selected = -1;
        }
    }
    
    this.selectPrev = function() {
        this.selected--;
        if (this.selected < 0) {
            this.selectPrev = 3;
        }
    }

    this.selectNext = function() {
        this.selected++;
        if (this.selected > 3) {
            this.selected = 0;
        }
    }

    this.select = function() {
        if (this.subScene === 0) {
            switch (this.selected) {
                case 0:
                    screenChange.change(function() { scene = menuScene; });
                    break;
                case 1:
                    screenChange.change(function() {
                        scene = inGameScene;
                        inGameScene.newGame();
                    });
                    break;
                case 2:
                    quit = true;
                    break;
                case 3:
                    this.subScene = 4;
                    break;
            }
        }
    }
}

function switchToScoresSubMenu() {
    if (scoreScene.currentScore > scoreScene.highScores[scoreScene.highScores.length-1].Score) {
        screenChange.change(function() { scoreScene.subScene = 1; });
    } else {
        screenChange.change(function() { scoreScene.subScene = 0; });
    }
}