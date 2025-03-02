var floorRuinedAnim = new MultipleAnimation('GFX/LevelRuined.png', 0, 0, 0, 0);

for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 12; j++) {
        floorRuinedAnim.clips.push({ x: 0, y: i*25, w: 12, h: 25-(j*2) });
    }
    for (j = 0; j < 12; j++) {
        floorRuinedAnim.clips.push({ x: 11, y: i*25, w: 32, h: 25-(j*2) });
    }
    for (j = 0; j < 12; j++) {
        floorRuinedAnim.clips.push({ x: 44, y: i*25, w: 12, h: 25-(j*2) });
    }
}

for (i = 0; i < 6; i++) {
    for (j = 0; j < 3; j++) {
        floorRuinedAnim.animations.push({ from: i*36 + j*12, to: i*36 + j*12, direction: 1, nextAnim: null }); //0 + i * 3: idle
        floorRuinedAnim.animations.push({ from: i*36 + j*12, to: i*36 + j*12 + 11, direction: 1, nextAnim: i*9 + j*3 + 2}); //1: ruining
        floorRuinedAnim.animations.push({ from: i*36 + j*12 + 11 , to: i*36 + j*12 + 11, direction: 1, nextAnim: null }); //2: ruined
    }
}

function FloorRuinable(x, y, size, levelStyle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = 0;
    this.levelStyle = levelStyle;
    this.animators = [];

    this.animators.push(new MultipleAnimator(floorRuinedAnim, x, y, 40));
    this.animators[0].switchAnim(levelStyle*9);
    
    for (var i = 12; i < size - 12; i += 32) {
        this.animators.push(new MultipleAnimator(floorRuinedAnim, x + i, y, 40));
        this.animators[this.animators.length-1].switchAnim(levelStyle*9 + 3);
    }

    this.animators.push(new MultipleAnimator(floorRuinedAnim, x + (size - 12), y, 40));
    this.animators[this.animators.length-1].switchAnim(levelStyle*9 + 6);

    this.rendering = function() {
        for (var i = 0; i < this.animators.length; i++) {
            if (this.animators[i].currAnim % 9 % 3 < 2)
            this.animators[i].applyAnim();
        }
    }

    this.isCollided = function(player) {
        isCollision = false;
        for (var i = 0; i < this.animators.length; i++) {
            if (this.animators[i].currAnim % 9 % 3 < 2 && this.levelStyle && isCollided(player.x, player.y + 34, 25, 4, this.animators[i].x, this.animators[i].y, i === 0 || i === this.animators.length-1 ? 12 : 32, 14)) {
                if (i === 0)
                    this.animators[i].switchAnim(this.levelStyle*9 + 1);
                else if (i === this.animators.length-1) {
                    this.animators[i].switchAnim(this.levelStyle*9 + 7);
                } else {
                    this.animators[i].switchAnim(this.levelStyle*9 + 4);
                }
                isCollision = true;
            }
        }

        return isCollision;
    }
}