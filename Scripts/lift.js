var lift_ver_graph = new Image();
lift_ver_graph.src = "GFX/LinkVer.png";
var lift_hor_graph = new Image();
lift_hor_graph.src = "GFX/LinkHor.png";
var lift_graph = new Image();
lift_graph.src = "GFX/Lift.png";

function Lift(x, y, size, type, direction) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.direction = direction;
    this.startCoord = { x: this.x, y: this.y };

    this.handleEventsHorizontal = function() {
        this.x += this.direction;
            if (this.x < this.startCoord.x || this.x > this.startCoord.x + this.size - 40)
                this.direction *= -1;
    }

    this.handleEventsVerticalPartialLength = function() {
        this.y += this.direction;
        if (this.y < this.startCoord.y || this.y > this.startCoord.y + this.size)
            this.direction *= -1;
    }

    this.handleEventsVerticalFullLength = function() {
        this.y += this.direction;
        if (this.y < -20)
            this.y = 490;
        else if (this.y > 490)
            this.y = 0;
    }

    this.renderingHorizontal = function() {
        for (var j = 0; j < this.size; j += 8) {
            ctx.drawImage(lift_hor_graph, this.startCoord.x + j, this.startCoord.y + 2);
        }
        ctx.drawImage(lift_graph, this.x, this.y);
    }

    this.renderingVertical = function() {
        for (var j = 0; j < this.size; j += 8) {
            ctx.drawImage(lift_ver_graph, this.startCoord.x + 18, this.startCoord.y + j);
        }
        ctx.drawImage(lift_graph, this.x, this.y);
    }

    if (this.type === 0) {
        this.rendering = this.renderingVertical;
        if (this.size < 480) {
            this.handleEvents = this.handleEventsVerticalPartialLength;
        } else {
            this.handleEvents = this.handleEventsVerticalFullLength;
        }
    } else {
        this.handleEvents = this.handleEventsHorizontal;
        this.rendering = this.renderingHorizontal;
    }
}