var floorPeriodicAnim = new MultipleAnimation("GFX/LevelPeriodic.png", 0, 0, 0, 0);
for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 5; j++) {
        floorPeriodicAnim.clips.push({ x: j*54, y: i*16, w: 12, h: 16 });
    }
    for (j = 0; j < 5; j++) {
        floorPeriodicAnim.clips.push({ x: j*54 + 10, y: i*16, w: 32, h: 16 });
    }
    for (j = 0; j < 5; j++) {
        floorPeriodicAnim.clips.push({ x: j*54 + 42, y: i*16, w: 12, h: 16});
    }
}

for (i = 0; i < 7; i++) {
    for (j = 0; j < 3; j++) {
        floorPeriodicAnim.animations.push({ from: i*15 + j*5, to: i*15 + j*5 + 4, direction: 1, nextAnim: i*9 + j*3 + 1 }); //0: hiding
        floorPeriodicAnim.animations.push({ from: i*15 + j*5 + 4 , to: i*15 + j*5 + 4, direction: 1, nextAnim: i*9 + j*3 + 2 }); //1: hidden
        floorPeriodicAnim.animations.push({ from: i*15 + j*5 + 4, to: i*15 + j*5, direction: -1, nextAnim: i*9 + j*3 }); //2: raising
    }
}

function FloorPeriodic(x, y, size, levelStyle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.levelStyle = levelStyle;
    this.animators = [];

    this.animators.push(new MultipleAnimator(floorPeriodicAnim, x, y, 40));
    this.animators[0].switchAnim(levelStyle*9);
    
    for (var i = 12; i < size - 12; i += 32) {
        this.animators.push(new MultipleAnimator(floorPeriodicAnim, x + i, y, 40));
        this.animators[this.animators.length-1].switchAnim(levelStyle*9 + 3);
    }

    this.animators.push(new MultipleAnimator(floorPeriodicAnim, x + (size - 12), y, 40));
    this.animators[this.animators.length-1].switchAnim(levelStyle*9 + 6);

    this.rendering = function() {
        for (var i = 0; i < this.animators.length; i++) {
            this.animators[i].applyAnim();
        }
    }

    this.isCollided = function(player) {
        for (var i = 0; i < this.animators.length; i++) {
            if (this.animators[i].currAnim % 9 % 3 !== 1 && this.levelStyle && isCollided(player.x, player.y + 34, 25, 4, this.animators[i].x, this.animators[i].y, i === 0 || i === this.animators.length-1 ? 12 : 32, 14)) {
                return true;
            }
        }

        return false;
    }
}