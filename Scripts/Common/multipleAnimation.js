function MultipleAnimation(imgSrc, clipCountX, clipCountY, clipWidth, clipHeight) {
    this.image = new Image();
    this.image.src = imgSrc;
    this.clips = [];
    this.animations = [];
    
    for (var i = 0; i < clipCountY; i++) {
        for (var j = 0; j < clipCountX; j++) {
            this.clips.push({ x: clipWidth*j, y: clipHeight*i, w: clipWidth, h: clipHeight });
        }
    }

    this.applyAnim = function(x, y, i) {
        ctx.drawImage(this.image, this.clips[i].x, this.clips[i].y,
            this.clips[i].w, this.clips[i].h, x, y, this.clips[i].w, this.clips[i].h);
    }
}

function MultipleAnimator(animation, x, y, speed) {
    this.animation = animation;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.maxCyle = 100 / speed;
    
    this.currAnim = 0;
    this.currClip = 0;
    this.currCyle = 0;
    
    this.switchAnim = function(animIndex) {
        if (this.currAnim === animIndex) {
            return;
        }
        this.currAnim = animIndex;
        this.currCyle = 0;
        this.currClip = this.animation.animations[animIndex].from;
    }
    
    this.applyAnim = function() {
        this.animation.applyAnim(this.x, this.y, this.currClip);
        this.currCyle++;
        
        if (this.currCyle >= this.maxCyle) {
            this.currClip += this.animation.animations[this.currAnim].direction;	
            this.currCyle = 0;
            if (this.animation.animations[this.currAnim].direction === 1
                    && this.currClip > this.animation.animations[this.currAnim].to
                || this.animation.animations[this.currAnim].direction === -1
                    && this.currClip < this.animation.animations[this.currAnim].to) {
                if (this.animation.animations[this.currAnim].nextAnim !== null) {
                    this.currAnim = this.animation.animations[this.currAnim].nextAnim;
                }
                this.currClip = this.animation.animations[this.currAnim].from;
            }
        }
    }
}