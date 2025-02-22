function Font(img, clipCountX, clipCountY, clipWidth, clipHeight) {
    this.fontImage = new MultipleImage(img, clipCountX, clipCountY, clipWidth, clipHeight);

    this.apply = function(word, x, y) {
        for (var i = 0; i < word.length; i++) {
            this.fontImage.apply(x + i*16, y, parseInt(word[i]));
        }
    }
}