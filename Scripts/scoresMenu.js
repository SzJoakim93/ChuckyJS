function ScoresMenu() {

    this.game_over = new Image();
    this.high_scene = new Image();
    this.win_graph = new Image();
    this.reset_graph = new Image();
    this.focus = new Image();
    this.game_over.src = "GFX/GameOver.png";
    this.high_scene.src = "GFX/HighScores.png";
    this.win_graph.src = "GFX/WinScreen.png";
    this.reset_graph.src = "GFX/ResetScore.png";
    this.focus.src = "GFX/Focus.png";
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
                break;
        }

        this.gameOverTimeOut.handleEvent();
    }

    this.rendering = function() {
        switch(this.subScene) {
            case 0:
                ctx.drawImage(this.high_scene, 0, 0);

                for (var i = 0; i < this.highScores.length; i++) {
                    drawText(248, 90 + (i*20), i === this.currentPos ? gold : white, 15, i+1);
                    drawText(280, 90 + (i*20), i === this.currentPos ? gold : white, 15, this.highScores[i].Name);
                    drawText(520, 90 + (i*20), i === this.currentPos ? gold : white, 15, this.highScores[i].Score);
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
                drawText(193, 316, white, 15, "Add high score and press enter");
                drawText(193, 336, white, 15, this.currentName);
                break;
            case 2:
                ctx.drawImage(this.game_over, 0, 0);
                break;
            case 3:
                ctx.drawImage(this.win_graph, 0, 0);
                break;
            case 4:
                ctx.drawImage(this.reset_graph, 226, 177);
                break;
        }
    }

    this.inputChar = function(c) {
        if (this.subScene === 1) {
            if (c === "Backspace") {
                this.currentName = this.currentName.slice(0, -1); 
            } else {
                this.currentName += c;
            }
        }
    }

    this.load = function() {
        this.currentPos = 16;
        //this.difficult = difficult;
        this.highScores = JSON.parse(loadData("chucky_high_scores"));
        if (this.highScores === null) {
            this.resetScore();
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
        //this.save();
    }

    this.mouseClick = function(e) {
        if (this.subScene === 0) {
            if (this.mouseCoord.y > 112 && this.mouseCoord.y < 136) {
                screenChange.change(function() { scene = menuScene; });
            } else if (this.mouseCoord.y > 199 && this.mouseCoord.y < 223) {
                screenChange.change(function() {
                    scene = inGameScene;
                    inGameScene.newGame();
                });
            } else if (this.mouseCoord.y > 285 && this.mouseCoord.y < 310) {
                quit = true;
            } else if (this.mouseCoord.y > 409 && this.mouseCoord.y < 434) {
                this.subScene = 4;
            }

        } else if (this.subScene === 1) {
            
        } else if (this.subScene === 4) {
            if (this.mouseCoord.x > 245 && this.mouseCoord.x < 309) {
                this.resetScore();
                this.subScene = 0;
            } else if (this.mouseCoord.x > 351 && this.mouseCoord.x < 415) {
                this.subScene = 0;
            }
        }
    }

    this.mouseMove = function(e) {
        this.mouseCoord.x = e.clientX - canvas.offsetLeft;
        this.mouseCoord.y = e.clientY - canvas.offsetTop;

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
}

function switchToScoresSubMenu() {
    if (scoreScene.currentScore > scoreScene.highScores[scoreScene.highScores.length-1].Score) {
        screenChange.change(function() { scoreScene.subScene = 1; });
    } else {
        screenChange.change(function() { scoreScene.subScene = 0; });
    }
}