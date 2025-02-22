var chickenAnim = new MultipleAnimation('GFX/Chicken.png', 4, 3, 33, 35);
chickenAnim.animations.push({ from: 0, to: 0, direction: 1, nextAnim: null }); //0: standing right
chickenAnim.animations.push({ from: 1, to: 2, direction: 1, nextAnim: null }); //1: running right
chickenAnim.animations.push({ from: 3, to: 3, direction: 1, nextAnim: null }); //2: attacked right
chickenAnim.animations.push({ from: 4, to: 4, direction: 1, nextAnim: null }); //3: standing left
chickenAnim.animations.push({ from: 5, to: 6, direction: 1, nextAnim: null }); //4: running left
chickenAnim.animations.push({ from: 7, to: 7, direction: 1, nextAnim: null }); //5: attacked left
chickenAnim.animations.push({ from: 8, to: 9, direction: 1, nextAnim: null }); //6: climping

function Chicken(x, y, dir, speed, triggers) {
    this.coord = { x: x, y: y };
    this.dir = dir;
    this.speed = speed;
    this.triggers = triggers;
    this.animator = new MultipleAnimator(chickenAnim, x, y, 10);
    //this.animator.switchAnim(dir === 0 || dir === 2 ? 3 : 0);

    this.handleEvents = function() {
        switch(this.dir) {
            case 0:
                this.coord.x -= this.speed;
                this.animator.switchAnim(4);
                break;
            case 1:
                this.coord.x += this.speed;
                this.animator.switchAnim(1);
                break;
            case 2:
                this.coord.y -= this.speed;
                this.animator.switchAnim(6);
                break;
            case 3:
                this.coord.y += this.speed;
                this.animator.switchAnim(6);
                break;
        }

        for (var i = 0; i < this.triggers.length; i++) {
            if (isCollided(this.coord.x, this.coord.y, 0, 0, this.triggers[i].x, this.triggers[i].y, this.speed - 1, this.speed - 1)) {
                if (this.dir > 1) {
                    this.dir = 0;
                } else {
                    if (this.triggers[i].direction === 0) {
                        if (this.dir === 0)
                            this.dir = 1;
                        else if (this.dir === 1)
                            this.dir = 0;
                    } else if (this.dir === 0) {
                        if (this.triggers[i].direction === 1 || this.triggers[i].direction === 3) {
                            this.dir = 3;
                            if (this.triggers[i].direction === 3)
                                this.triggers[i].direction = 4;
                        } else if (this.triggers[i].direction === 2 || this.triggers[i].direction === 4) {
                            this.dir = 2;
                            if (this.triggers[i].direction === 4)
                                this.triggers[i].direction = 3;
                        }
                    }
                }
                this.coord.x = this.triggers[i].x;
                this.coord.y = this.triggers[i].y;
            }
        }

        for (var i = 0; i < inGameScene.level.sands.length; i++) {
            if (inGameScene.level.sands[i].currAnim == 0 && isCollided(this.x, this.y, 32, 35, inGameScene.level.sands[i].x, inGameScene.level.sands[i].y, 12, 10)) {
                inGameScene.level.sands[i].switchAnim(1);
            }
        }
    }

    this.rendering = function() {
        this.animator.x = this.coord.x;
        this.animator.y = this.coord.y;
        this.animator.applyAnim();
    }
};