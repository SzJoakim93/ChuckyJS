var plus_one = { x: -100, y: 0, img: new Image(), timeOut: new TimeoutEvent(40, function() { this.x = -100 }) };
plus_one.img.src = "GFX/PlusOne.png";
var plus_200 = { x: -100, y: 0, img: new Image(), timeOut: new TimeoutEvent(40, function() { this.x = -100 }) };
plus_200.img.src = "GFX/Plus200.png";

function Player() {
    this.x = 0;
    this.y = 0;
    this.jump_sound = new Sound("SFX/jump.wav");
    this.plantkill = new Sound("SFX/plantkill.wav");
    this.fire_sound = new Sound("SFX/flash_burn.wav");

    this.time = 1998;
    this.points = 0;
    this.lives = 3;
    this.bonus = 1000;
    this.direction = 0;

    this.gravity = false;
    this.jump = -11;
    this.dead = false;
    this.visible = true;

    this.deadImg = new Image();
    this.deadImg.src = "GFX/Dead.png";
    this.deadAnim = new Animation(this.deadImg, 0, 0, 24, 26, 6, 1, 24, 26, 20);
    this.deadAnim.visible = false;
    this.playerAnim = new MultipleAnimation('GFX/Player.png', 6, 2, 31, 38);
    this.playerAnim.clips.push({ x: 0, y: 76, w: 22, h: 50 });
    this.playerAnim.clips.push({ x: 22, y: 76, w: 22, h: 50 });
    this.playerAnim.clips.push({ x: 45, y: 76, w: 75, h: 86 });
    this.playerAnim.animations.push({ from: 0, to: 0, direction: 1, nextAnim: null }); //0: standing right
    this.playerAnim.animations.push({ from: 1, to: 5, direction: 1, nextAnim: null }); //1: running right
    this.playerAnim.animations.push({ from: 6, to: 6, direction: 1, nextAnim: null }); //2: standing left
    this.playerAnim.animations.push({ from: 7, to: 11, direction: 1, nextAnim: null }); //3: running left
    this.playerAnim.animations.push({ from: 12, to: 12, direction: 1, nextAnim: null }); //4: standing while cimpling
    this.playerAnim.animations.push({ from: 12, to: 13, direction: 1, nextAnim: null }); //5: cimpling
    this.playerAnim.animations.push({ from: 14, to: 14, direction: 1, nextAnim: null }); //6: dead
    this.animator = new MultipleAnimator(this.playerAnim, 0, 0, 40);

    this.handleEvents = function() {
        if (!this.dead) {
            if (keystates[KEY_LEFT]) {
                    this.direction = -8;

                if (this.gravity || this.jump > -11) {
                    this.animator.switchAnim(2);
                } else {
                    this.animator.switchAnim(3);
                }
            } else if (keystates[KEY_RIGHT]) {
                    this.direction = 8;
                    
                if (this.gravity || this.jump > -11) {
                    this.animator.switchAnim(0);
                } else {
                    this.animator.switchAnim(1);
                }
            } else if (this.jump === -11) {
                this.direction = 0;
                if (this.animator.currAnim === 3) {
                    this.animator.switchAnim(2);
                } else if (this.animator.currAnim === 1) {
                    this.animator.switchAnim(0);
                }
            }

            if (this.x > 620) {
                this.x -= 8;
            } else if (this.x < 0) {
                this.x += 8;
            }

            this.x += this.direction;

            if ((keystates[KEY_RSHIFT] || keystates[KEY_LSHIFT]) && this.jump === -11 && !this.gravity) {
                this.jump = 11;
                this.jump_sound.play();
            }
        }

        if (this.jump > -11) {
            this.y -= this.jump;
            this.jump -= 2;
        } else if (this.gravity) {
            this.y += 14;
        }

        this.gravity = true;

        if (!this.dead) {
            for (var i = 0; i < inGameScene.level.chickens.length; i++) {
                if (inGameScene.level.chickens[i].coord.x + 30 > this.x && inGameScene.level.chickens[i].coord.x < this.x + 23 && inGameScene.level.chickens[i].coord.y + 32 > this.y && inGameScene.level.chickens[i].coord.y < this.y + 35) {
                    this.setToDead();
                    inGameScene.chicken_kill.play();
                    if (inGameScene.level.chickens[i].dir === 1) {
                        inGameScene.level.chickens[i].animator.switchAnim(2);
                    } else {
                        inGameScene.level.chickens[i].animator.switchAnim(5);
                    }
                }
            }

            for (var i = 0; i < inGameScene.level.floors.length; i++) {
                if (isCollided(this.x, this.y + 34, 25, 4, inGameScene.level.floors[i].x, inGameScene.level.floors[i].y, inGameScene.level.floors[i].size, 14)) {
                    this.gravity = false;
                    if (this.y + 38 >= inGameScene.level.floors[i].y && this.animator.currAnim !== 5) {
                        this.y = inGameScene.level.floors[i].y - 38;
                    }
                }
            }

            for (var i = 0; i < inGameScene.level.floorsRuinable.length; i++) {
                if (inGameScene.level.floorsRuinable[i].isCollided(this)) {
                    this.gravity = false;
                    if (this.y + 38 >= inGameScene.level.floorsRuinable[i].y && this.animator.currAnim !== 5) {
                        this.y = inGameScene.level.floorsRuinable[i].y - 38;
                    }
                }
            }

            for (var i = 0; i < inGameScene.level.floorsPeriodic.length; i++) {
                if (inGameScene.level.floorsPeriodic[i].isCollided(this)) {
                    this.gravity = false;
                    if (this.y + 38 >= inGameScene.level.floorsPeriodic[i].y && this.animator.currAnim !== 5) {
                        this.y = inGameScene.level.floorsPeriodic[i].y - 38;
                    }
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.climpers.length; i++) {
                if (isCollided(this.x, this.y, 25, 1, inGameScene.level.levelData.climpers[i].x, inGameScene.level.levelData.climpers[i].y, 27, inGameScene.level.levelData.climpers[i].size)) {
                    this.gravity = false;
                    if (keystates[KEY_UP]) {
                        this.x = inGameScene.level.levelData.climpers[i].x + 2;
                        this.y -= 6;
                        this.animator.switchAnim(5);
                    } else if (keystates[KEY_DOWN]) {
                        this.x = inGameScene.level.levelData.climpers[i].x + 2;
                        this.y += 6;
                        this.animator.switchAnim(5);
                    } else if (this.animator.currAnim === 5) {
                        this.animator.switchAnim(4);
                    }
                }
            }

            for (var i = 0; i < inGameScene.level.lifts.length; i++) {
                if (isCollided(this.x, this.y + 34, 25, 4, inGameScene.level.lifts[i].x, inGameScene.level.lifts[i].y, 32, 14)) {
                    this.gravity = false;
                    if (this.y + 36 >= inGameScene.level.lifts[i].y) {
                        this.y = inGameScene.level.lifts[i].y - 36;
                    }
                    if (inGameScene.level.lifts[i].type === 0) {
                        this.y += inGameScene.level.lifts[i].direction;
                    } else {
                        this.x += inGameScene.level.lifts[i].direction;
                    }  
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.eggs.length; i++) {
                if (isCollided(this.x, this.y, 25, 37, inGameScene.level.levelData.eggs[i].x, inGameScene.level.levelData.eggs[i].y, 12, 10)) {
                    inGameScene.level.levelData.eggs[i].x = -100;
                    this.points += 2;
                    inGameScene.level.remaining--;
                    inGameScene.pickup_egg.play();
                    if (inGameScene.level.remaining <= 0) {
                        inGameScene.levelComplete();
                    }
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.lives.length; i++) {
                if (isCollided(this.x, this.y, 25, 37, inGameScene.level.levelData.lives[i].x, inGameScene.level.levelData.lives[i].y, 12, 10)) {
                    plus_one.timeOut.launch();
                    plus_one.x = inGameScene.level.levelData.lives[i].x;
                    plus_one.y = inGameScene.level.levelData.lives[i].y;
                    inGameScene.level.levelData.lives[i].x = -100;
                    this.lives++;
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.goldEggs.length; i++) {
                if (isCollided(this.x, this.y, 25, 37, inGameScene.level.levelData.goldEggs[i].x, inGameScene.level.levelData.goldEggs[i].y, 12, 10)) {
                    plus_200.timeOut.launch();
                    plus_200.x = inGameScene.level.levelData.goldEggs[i].x;
                    plus_200.y = inGameScene.level.levelData.goldEggs[i].y;
                    inGameScene.level.levelData.goldEggs[i].x = -100;
                    this.points += 4;
                }
            }

            for (var i = 0; i < inGameScene.level.sands.length; i++) {
                if (inGameScene.level.sands[i].currAnim === 0 && isCollided(this.x, this.y, 25, 37, inGameScene.level.sands[i].x, inGameScene.level.sands[i].y, 36, 10)) {
                    inGameScene.pickup_sand.play();
                    inGameScene.level.sands[i].switchAnim(1);
                    this.time += 10;
                    this.points += 1;
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.plants.length; i++) {
                if (isCollided(this.x + 3, this.y + 10, 25, 25, inGameScene.level.levelData.plants[i].x + 2, inGameScene.level.levelData.plants[i].y + 2, 21, 18)) {
                    this.setToDead();
                    this.visible = false;
                    this.initDeadAnim(inGameScene.level.levelData.plants[i].x, inGameScene.level.levelData.plants[i].y);
                    this.plantkill.play();
                    inGameScene.level.levelData.plants[i].isDead = true;
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.fires.length; i++) {
                if (isCollided(this.x, this.y + 10, 25, 25, inGameScene.level.levelData.fires[i].x, inGameScene.level.levelData.fires[i].y, 25, 15)) {
                    this.setToDead();
                    this.visible = false;
                    this.initDeadAnim(inGameScene.level.levelData.fires[i].x, inGameScene.level.levelData.fires[i].y);
                    this.fire_sound.play();
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.claws.length; i++) {
                if (isCollided(this.x, this.y + 10, 25, 25, inGameScene.level.levelData.claws[i].x, inGameScene.level.levelData.claws[i].y, 26, 33)) {
                    this.setToDead();
                    this.visible = false;
                    this.initDeadAnim(inGameScene.level.levelData.claws[i].x, inGameScene.level.levelData.claws[i].y);
                }
            }

            for (var i = 0; i < inGameScene.level.levelData.traps; i++) {
                if (isCollided(this.x, this.y + 10, 25, 25, inGameScene.level.levelData.traps[i].x + 33, inGameScene.level.levelData.levelData.traps[i].y + 50, 127, 62)) {
                    this.setToDead();
                    this.visible = false;
                    this.initDeadAnim(inGameScene.level.levelData.levelData.traps[i].x + 76, inGameScene.level.levelData.traps[i].y + 46);
                }
            }
        }

        if (this.y < -20) {
            this.y = 501;
        }

        if (this.y > 500) {
            if (!this.dead) {
                this.setToDead();
                inGameScene.fallout.play();
            }
            if (this.y > 1200) {
                inGameScene.resetGame();
            }
        }

        if (inGameScene.start && !inGameScene.player.dead) {
            if (this.time > 0) {
                this.time--;
            }
            if (this.time == 0) {
                this.setToDead();
            }
            if (this.time % 200 == 0 && this.bonus > 9) {
                this.bonus -= 10;
            }
        }

        plus_200.timeOut.handleEvent();
        plus_one.timeOut.handleEvent();
    }

    this.rendering = function() {
        if (this.deadAnim.visible) {
            this.deadAnim.applyAnim();
            if (this.deadAnim.currClip === this.deadAnim.clips.length-1) {
                this.deadAnim.visible = false;
            }
        }

        if (!this.visible) {
            return;
        }

        if (plus_one.timeOut.isLaunched()) {
            ctx.drawImage(plus_one.img, plus_one.x, plus_one.y);
        }
        if (plus_200.timeOut.isLaunched()) {
            ctx.drawImage(plus_200.img, plus_200.x, plus_200.y);
        }
        

        this.animator.x = this.x;
        this.animator.y = this.y;
        this.animator.applyAnim();
    }

    this.initDeadAnim = function(x, y) {
        this.deadAnim.x = x;
        this.deadAnim.y = y;
        this.deadAnim.visible = true;
        this.deadAnim.currClip = 0;
    }

    this.setToDead = function() {
        this.dead = true;
        this.animator.switchAnim(6);
    }

    this.kill = function() {
        this.lives--;

        if (this.lives > 0) {
            this.x = inGameScene.level.levelData.playerCoord.x;
            this.y = inGameScene.level.levelData.playerCoord.y;

            this.resetState();
            
            if (this.bonus > 9) {
                this.bonus -=10;
            }
        } else {
            scoreScene.currentScore = this.points;
            scoreScene.subScene = 2;
            screenChange.change(function() { scene = scoreScene; });
        }
        
    }

    this.setNewGame = function() {
        if (inGameScene.difficult[0] === 'e') {
            this.lives = 5;
        } else {
            this.lives = 3;
        }
        this.points = 0;
        this.bonus = 0;
        this.resetState();
    }

    this.resetState = function() {
        this.dead = false;
        this.direction = 0;
        this.time = 1998;
        this.visible = true;
        this.animator.switchAnim(0);
    }

}