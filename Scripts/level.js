function Level() {
    this.chickens = [];
    this.floors = [];
    this.floorsRuinable = [];
    this.floorsPeriodic = [];
    this.climpers = [];
    this.lifts = [];

    this.sands = [];
    this.fires = [];

    this.bigChicken = new BigChicken();
    this.gateState = 0;
    this.claw_state = 0;

    this.gateAnim = new MultipleAnimation("GFX/Gate.png", 4, 2, 55, 58);
    this.gateAnim.animations.push({ from: 0, to: 0, direction: 1, nextAnim: null }); //0: closed
    this.gateAnim.animations.push({ from: 0, to: 6, direction: 1, nextAnim: 2 }); //1: opening
    this.gateAnim.animations.push({ from: 7, to: 7, direction: 1, nextAnim: null }); //2: opened

    this.gate = new MultipleAnimator(this.gateAnim, 80, 25, 20);
    this.prison = new Image();
    this.prison.src = "GFX/Prison.png";
    this.prisonBottom = new Image();
    this.prisonBottom.src = "GFX/PrisonBottom.png";

    this.floor_graph = new MultipleImage("GFX/Level.png", 0, 0);
    for (var i = 0; i < 18; i++) {
        if (i % 3 == 0) {
            this.floor_graph.clip[i] = new Clip(0, Math.floor(i / 3) * 16, 12, 16);
        } else if (i % 3 == 1) {
            this.floor_graph.clip[i] = new Clip(10, Math.floor(i / 3) * 16, 32, 16);
        } else {
            this.floor_graph.clip[i] = new Clip(42, Math.floor(i / 3) * 16, 12, 16);
        }
    }

    this.climp_graph = new MultipleImage("GFX/Climper.png", 0, 0);
    for (var i = 0; i < 6; i++) {
        if (i % 3 == 0) {
            this.climp_graph.clip[i] = new Clip(Math.floor(i / 3) * 27, 0, 27, 12);
        } else if (i % 3 == 1) {
            this.climp_graph.clip[i] = new Clip(Math.floor(i / 3) * 27, 12, 27, 13);
        } else {
            this.climp_graph.clip[i] = new Clip(Math.floor(i / 3) * 27, 25, 27, 10);
        }
    }
    
    this.trap_graph = new Image();
    this.trap_graph.src = "GFX/Trap.png";

    this.egg_graph = new Image();
    this.egg_graph.src = "GFX/Egg.png";
    this.sand_anim = new MultipleAnimation("GFX/Sand.png", 1, 1, 22, 11);

    for (var i = 1; i < 11; i += 2) {
        this.sand_anim.clips.push({ x: 0, y: i, w: 22, h: 11-i });
    }

    this.sand_anim.animations.push({ from: 0, to: 0, direction: 1, nextAnim: null }); //0: idle
    this.sand_anim.animations.push({ from: 0, to: 5, direction: 1, nextAnim: 2 }); //1: picking up
    this.sand_anim.animations.push({ from: 5, to: 5, direction: 1, nextAnim: null }); //2: picked up

    this.gold_graph = new Image();
    this.gold_graph.src = "GFX/EggGold.png";
    this.life_graph = new Image();
    this.life_graph.src = "GFX/Life.png";

    this.plant_graph = new MultipleImage("GFX/Plant.png", 2, 1, 25, 22);
    this.fire_graph = new Image();
    this.fire_graph.src = "GFX/Fire.png";
    this.claw_graph = new Image();
    this.claw_graph.src = "GFX/Claw.png";

    this.handleEvents = function() {
        if (inGameScene.start && !inGameScene.player.dead) {
            for (var i = 0; i < this.chickens.length; i++) {
                this.chickens[i].handleEvents();
            }
            this.bigChicken.handleEvents();
        }

        for (var i = 0; i < this.lifts.length; i++) {
            this.lifts[i].handleEvents();
        }

        if (this.levelData.claws.length > 0) {
            this.claw_state++;
            if (this.claw_state > 59) {
                this.claw_state = 0;
            }

            if (this.claw_state % 2 === 0) {
                for (var i = 0; i < this.levelData.claws.length; i++) {
                    if (this.claw_state < 30) {
                        this.levelData.claws[i].y++;
                    } else {
                        this.levelData.claws[i].y--;
                    }
                }
            }
        }
    }

    this.rendering = function() {
        for (var i = 0; i < this.levelData.claws.length; i++) {
            ctx.drawImage(this.claw_graph, this.levelData.claws[i].x, this.levelData.claws[i].y);
        }

        for (var i = 0; i< this.levelData.traps.length; i++) {
            ctx.drawImage(this.trap_graph, this.levelData.traps[i].x, this.levelData.traps[i].y);
        }

        for (var i = 0; i < this.floors.length; i++) {
            this.floors[i].rendering();
        }

        for (var i = 0; i < this.floorsPeriodic.length; i++) {
            this.floorsPeriodic[i].rendering();
        }

        for (var i = 0; i < this.floorsRuinable.length; i++) {
            this.floorsRuinable[i].rendering();
        }

        for (var i = 0; i < this.levelData.climpers.length; i++) {
            var k = 0;
            for (var j = 0; j < this.levelData.climpers[i].size - 10; j += 12) {
                this.climp_graph.apply(this.levelData.climpers[i].x, this.levelData.climpers[i].y + j, this.levelData.levelStyle.climpers * 3);
            }
            this.climp_graph.apply(this.levelData.climpers[i].x, this.levelData.climpers[i].y + j, this.levelData.levelStyle.climpers * 3 + 2);
        }

        for (var i = 0; i < this.lifts.length; i++) {
            this.lifts[i].rendering();
        }

        for (var i = 0; i < this.levelData.plants.length; i++) {
            this.plant_graph.apply(this.levelData.plants[i].x, this.levelData.plants[i].y, this.levelData.plants[i].isDead ? 1: 0);
        }

        for (var i = 0; i < this.fires.length; i++) {
            this.fires[i].applyAnim();
        }

        for (var i = 0; i < this.chickens.length; i++) {
            this.chickens[i].rendering();
        }

        for (var i = 0; i< this.levelData.eggs.length; i++) {
            if (this.levelData.eggs[i].x > -1) {
                ctx.drawImage(this.egg_graph, this.levelData.eggs[i].x, this.levelData.eggs[i].y);
            }
        }

        for (var i = 0; i < this.sands.length; i++) {
            if (this.sands[i].x > -1) {
                this.sands[i].applyAnim();
                if (this.sands[i].currAnim === 1 && this.sands[i].currCyle === 0) {
                    this.sands[i].y += 2;
                    if (this.sands[i].currClip === 5) {
                        this.sands[i].x = -100;
                    }
                }
            }
        }

        for (var i = 0; i < this.levelData.goldEggs.length; i++) {
            if (this.levelData.goldEggs[i].x > -1) {
                ctx.drawImage(this.gold_graph, this.levelData.goldEggs[i].x, this.levelData.goldEggs[i].y);
            }
        }

        for (var i = 0; i < this.levelData.lives.length; i++) {
            if (this.levelData.lives[i].x > -1) {
                ctx.drawImage(this.life_graph, this.levelData.lives[i].x, this.levelData.lives[i].y);
            }
        }

        ctx.drawImage(this.prisonBottom, 10, 79);
        if (this.gate.currAnim > 0) {
            this.gate.applyAnim();
        }

        this.bigChicken.rendering();
        ctx.drawImage(this.prison, 10, 0);
    }

    this.load = function(level) {
        this.gate.switchAnim(0);
        this.chickens = [];
        this.levelData = levelData[level]();
        this.bigChicken.isActive = this.levelData.isBigChickenActive;
        this.bigChicken.reset();
        for (var i = 0; i < this.levelData.chickens.length; i++) {
            this.chickens[i] = new Chicken(
                this.levelData.chickens[i].x,
                this.levelData.chickens[i].y,
                1,
                this.levelData.chickens[i].speed,
                this.levelData.chickens[i].triggers
            );
        }
        for (var i = 0; i < this.levelData.floors.length; i++) {
            this.floors[i] = new FloorStatic(this.levelData.floors[i].x, this.levelData.floors[i].y, this.levelData.floors[i].size, this.levelData.levelStyle.floor);
        }

        for (var i = 0; i < this.levelData.dynamic_floors.length; i++) {
            if (this.levelData.dynamic_floors[i].type === 0) {
                this.floorsRuinable.push(new FloorRuinable(this.levelData.dynamic_floors[i].x, this.levelData.dynamic_floors[i].y, this.levelData.dynamic_floors[i].size, this.levelData.levelStyle.floor));
            } else {
                this.floorsPeriodic.push(new FloorPeriodic(this.levelData.dynamic_floors[i].x, this.levelData.dynamic_floors[i].y, this.levelData.dynamic_floors[i].size, this.levelData.levelStyle.floor));
            }
        }

        for (var i = 0; i < this.levelData.sands.length; i++) {
            this.sands[i] = new MultipleAnimator(this.sand_anim, this.levelData.sands[i].x, this.levelData.sands[i].y, 20);
        }

        for (var i = 0; i < this.levelData.fires.length; i++) {
            this.fires[i] = new Animation(this.fire_graph, this.levelData.fires[i].x, this.levelData.fires[i].y, 22, 15, 6, 1, 22, 15, 20);
        }

        for (var i = 0; i < this.levelData.lifts.length; i++) {
            this.lifts[i] = new Lift(this.levelData.lifts[i].x, this.levelData.lifts[i].y, this.levelData.lifts[i].size, this.levelData.lifts[i].type, this.levelData.lifts[i].direction);
        }

        this.remaining = this.levelData.eggs.length;
        inGameScene.player.x = this.levelData.playerCoord.x;
        inGameScene.player.y = this.levelData.playerCoord.y;
    }

    this.reset = function() {
        for (var i = 0; i < this.chickens.length; i++) {
            this.chickens[i].coord = { x: this.levelData.chickens[i].x, y: this.levelData.chickens[i].y };
            this.chickens[i].dir = 1;
            this.chickens[i].animator.switchAnim(0);
        }

        this.bigChicken.reset();

        for (var i = 0; i < this.levelData.plants.length; i++) {
            this.levelData.plants[i].isDead = false;
        }

        for (var i = 0; i < this.floorsRuinable.length; i++) {
            this.floorsRuinable[i].state = 0;
        }
    }
}