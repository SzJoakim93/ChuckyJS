function Animation(img, x, y, imageWidth, imageHeight, clipCountX, clipCountY, clipWidth, clipHeight, speed) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.clipWidth = clipWidth;
    this.clipHeight = clipHeight;
    this.clips = [];
    this.currClip = 0;
	this.maxCyle = 100 / speed;
	this.currCyle = 0;
	
    for (var i = 0; i < clipCountY; i++) {
        for (var j = 0; j < clipCountX; j++) {
            this.clips.push({x: clipWidth*j, y: clipHeight*i});
        }
    }

    this.applyAnim = function() {
        ctx.drawImage(this.image, this.clips[this.currClip].x, this.clips[this.currClip].y,
            this.clipWidth, this.clipHeight, this.x, this.y, this.imageWidth, this.imageHeight);

		this.currCyle++;
		
		if (this.currCyle >= this.maxCyle) {
			this.currClip++;	
			this.currCyle = 0;
			if (this.currClip >= this.clips.length) {
				this.currClip = 0;
			}
		}
    }
}
