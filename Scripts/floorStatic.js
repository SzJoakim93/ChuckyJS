var floor_graph = new MultipleImage("GFX/Level.png", 0, 0);
for (var i = 0; i < 7; i++) {
        floor_graph.clip.push({ x: 0, y: i*16, w: 12, h: 16 });
        floor_graph.clip.push({ x: 10, y: i*16, w: 32, h: 16 });
        floor_graph.clip.push({ x: 42, y: i*16, w: 12, h: 16});
}

function FloorStatic(x, y, size, levelStyle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.levelStyle = levelStyle;

    this.rendering = function() {
        floor_graph.apply(this.x, this.y, this.levelStyle * 3);

            for (var j = 12; j < this.size - 12; j += 32) {
                floor_graph.apply(this.x + j, this.y, this.levelStyle * 3 + 1);
            }

            floor_graph.apply( this.x + this.size - 12, this.y, this.levelStyle * 3 + 2);
    }
}