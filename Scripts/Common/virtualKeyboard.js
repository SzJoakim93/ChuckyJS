var KEY_LAYOUT = [
    ["1","2","3","4","5","6","7", "8","9","0"],
    ["Q","W","E","R","T","Y","U", "I","O","P"],
    ["A","S","D","F","G","H","J", "K","L"],
    ["Z","X","C","V","B","N","M","BACK"],
    ["SHIFT","SPACE","OK"]
];

var KEY_SIZE_OVERRIDES = [
    { row: 3, col: 7, width: 2 }, // BACK
    { row: 4, col: 0, width: 2 }, // SHIFT
    { row: 4, col: 1, width: 5 }, // SPACE
    { row: 4, col: 2, width: 2 }  // OK
]

function VirtualKeyboard(x, y, keyWidth, keyHeight) {
    this.x = x;
    this.y = y;
    this.keyWidth = keyWidth;
    this.keyHeight = keyHeight;

    this.selectedRow = 0;
    this.selectedCol = 0;

    this.isShiftKeyPressed = false;
    this.rowOffsets = [0, 0, Math.floor(keyWidth / 2), keyWidth, Math.floor(keyWidth / 2)]; // Row offsets for the keys in KEY_LAYOUT
    this.visible = false;

    this.getKey = function() {
        return KEY_LAYOUT[this.selectedRow][this.selectedCol];
    };

    this.draw = function(focustitle) {
        if (!this.visible) {
            return;
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(this.x - 2, this.y - 2, this.keyWidth * KEY_LAYOUT[0].length + 4, this.keyHeight * KEY_LAYOUT.length + 4);
        if (focustitle) {
            drawText(this.x + 82, this.y - 8, gold, 15, focustitle);
        }

        ctx.save();
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (var i = 0; i < KEY_LAYOUT.length; i++) {
            var currentOffsetX = this.x + this.rowOffsets[i];
            for (var j = 0; j < KEY_LAYOUT[i].length; j++) {
                var keyWidth = this.getOverrideWidth(i, j);
                var x = currentOffsetX;
                var y = this.y + i * this.keyHeight;

                // Highlight selected
                if (i === this.selectedRow && j === this.selectedCol) {
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x, y, keyWidth - 4, this.keyHeight - 4);
                    ctx.fillStyle = "#000";
                } else {
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect(x, y, keyWidth - 4, this.keyHeight - 4);
                    ctx.fillStyle = "#fff";
                }

                ctx.fillText(KEY_LAYOUT[i][j], x + keyWidth/2, y + this.keyHeight/2);

                currentOffsetX += keyWidth;
            }
        }
        ctx.restore();
    };

    this.clear = function() {
        ctx.fillStyle = "#000";
        ctx.clearRect(this.x - 2, this.y - 2, this.keyWidth * KEY_LAYOUT[0].length + 4, this.keyHeight * KEY_LAYOUT.length + 4);
    }

    this.move = function(dx, dy) {
        this.selectedRow = Math.max(0, Math.min(KEY_LAYOUT.length - 1, this.selectedRow + dy));

        var rowLength = KEY_LAYOUT[this.selectedRow].length;
        this.selectedCol = Math.max(0, Math.min(rowLength - 1, this.selectedCol + dx));
    };

    this.select = function() {
        var key = this.getKey();

        if (key === "BACK" && scene.inputChar) {
            scene.inputChar("Backspace");
        } else if (key === "SPACE" && scene.inputChar) {
            scene.inputChar(" ");
        } else if (key === "OK" && scene.finishInput) {
            this.visible = false;
            scene.finishInput();
        } else if (scene.inputChar) {
            scene.inputChar(key);
        }
    };

    this.selectAt = function(x, y) {
        var row = Math.floor((y - this.y) / this.keyHeight);
        if (row < 0 || row >= KEY_LAYOUT.length || y >= this.y + (row + 1) * this.keyHeight - 4) {
            return false;
        }

        var col = -1;
        var currentOffsetX = this.x + this.rowOffsets[row];
        for (var j = 0; j < KEY_LAYOUT[row].length; j++) {
            var keyWidth = this.getOverrideWidth(row, j);
            if (x >= currentOffsetX && x < currentOffsetX + keyWidth - 4) {
                col = j;
                break;
            }
            currentOffsetX += keyWidth;
        }

        if (col < 0) {
            return false;
        }

        this.selectedRow = row;
        this.selectedCol = col;
        this.select();
        return true;
    };

    this.setVisibility = function(visible) {
        this.visible = visible &&
            (("ontouchstart" in window) || navigator.maxTouchPoints > 0 || isGamePadUsed);
    }

    this.getOverrideWidth = function(row, col) {
        for (var i = 0; i < KEY_SIZE_OVERRIDES.length; i++) {
            if (KEY_SIZE_OVERRIDES[i].row === row && KEY_SIZE_OVERRIDES[i].col === col) {
                return KEY_SIZE_OVERRIDES[i].width * this.keyWidth;
            }
        }
        return this.keyWidth;
    };
}