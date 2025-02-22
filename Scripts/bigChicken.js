var bigChickenAnim = new MultipleAnimation("GFX/ChickenBig.png", 3, 2, 60, 61);
bigChickenAnim.animations.push({ from: 0, to: 0, direction: 1, nextAnim: null }); //0: standing right
bigChickenAnim.animations.push({ from: 0, to: 1, direction: 1, nextAnim: null }); //1: flying right
bigChickenAnim.animations.push({ from: 2, to: 2, direction: 1, nextAnim: null }); //2: attacked right
bigChickenAnim.animations.push({ from: 3, to: 3, direction: 1, nextAnim: null }); //3: standing left
bigChickenAnim.animations.push({ from: 3, to: 4, direction: 1, nextAnim: null }); //4: flying left
bigChickenAnim.animations.push({ from: 5, to: 5, direction: 1, nextAnim: null }); //5: attacked left

function BigChicken() {
    this.isActive = false;
    this.startCoords = { x: 18, y: 25 };
    this.x = this.startCoords.x;
    this.y = this.startCoords.y;
    this.animator = new MultipleAnimator(bigChickenAnim, this.x, this.y, 20);

    this.handleEvents = function() {
        if (!this.isActive) {
            return;
        }

        if (this.x < 90 && this.y < 31)
            this.x += 2;
        else {
            if (this.x > inGameScene.player.x) {
                this.x--;
                this.animator.switchAnim(4);
            } else if (this.x < inGameScene.player.x) {
                this.x++;
                this.animator.switchAnim(1);
            }

            if (this.y > inGameScene.player.y) {
                this.y--;
            }
            else if (this.y < inGameScene.player.y) {
                this.y++;
            }
        }

        if (inGameScene.player.x + 25 > this.x && inGameScene.player.x < this.x + 54 && inGameScene.player.y + 36 > this.y && inGameScene.player.y < this.y + 50) {
            inGameScene.player.setToDead();
            inGameScene.chicken_kill.play();
            if (this.animator.currAnim === 4) {
                this.animator.switchAnim(5);
            } else {
                this.animator.switchAnim(2);
            }
        }
    }

    this.rendering = function() {
        this.animator.x = this.x;
        this.animator.y = this.y;
        this.animator.applyAnim();
    }
    this.reset = function() {
        if (this.isActive) {
            this.x = this.startCoords.x;
            this.y = this.startCoords.y;
            this.animator.switchAnim(this.isActive ? 1 : 0);
            this.dir = 0;
        }
    }
}