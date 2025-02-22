function Level() {
    this.chickens = [];
    this.floors = [];
    this.climpers = [];
    this.dynamic_floors = [];

    this.sands = [];

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
    this.lift_ver_graph = new Image();
    this.lift_ver_graph.src = "GFX/LinkVer.png";
    this.lift_hor_graph = new Image();
    this.lift_hor_graph.src = "GFX/LinkHor.png";
    this.lift_graph = new Image();
    this.lift_graph.src = "GFX/Lift.png";

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

    this.floor_ruined_graph = new Image();
    this.floor_ruined_graph.src = "GFX/LevelRuined.png";
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

        for (var i = 0; i < this.levelData.lifts.length; i++) {
            if (this.levelData.lifts[i].type === 0) {
                this.levelData.lifts[i].y += this.levelData.lifts[i].direction;
                if (this.levelData.lifts[i].size < 480) {
                    if (this.levelData.lifts[i].y < this.levelData.lifts[i].startCoord.y || this.levelData.lifts[i].y > this.levelData.lifts[i].startCoord.y + this.levelData.lifts[i].size)
                    this.levelData.lifts[i].direction *= -1;
                } else {
                    if (this.levelData.lifts[i].y < 0)
                        this.levelData.lifts[i].y = 490;
                    else if (this.levelData.lifts[i].y > 490)
                        this.levelData.lifts[i].y = 0;
                }
            } else {
                this.levelData.lifts[i].x += this.levelData.lifts[i].direction;
                if (this.levelData.lifts[i].x < this.levelData.lifts[i].startCoord.x || this.levelData.lifts[i].x > this.levelData.lifts[i].startCoord.x + this.levelData.lifts[i].size - 40)
                    this.levelData.lifts[i].direction *= -1;
            }
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
            ctx.drawImage(this.trap_graph, this.levelData.traps[i].x, this.level.traps[i].y);
        }

        for (var i = 0; i < this.levelData.floors.length; i++) {
            this.floor_graph.apply(this.levelData.floors[i].x, this.levelData.floors[i].y, this.levelData.levelStyle.floor * 3);

            for (var j = 12; j < this.levelData.floors[i].size - 12; j += 32) {
                this.floor_graph.apply(this.levelData.floors[i].x + j, this.levelData.floors[i].y, this.levelData.levelStyle.floor * 3 + 1);
            }

            this.floor_graph.apply( this.levelData.floors[i].x + this.levelData.floors[i].size - 12, this.levelData.floors[i].y, this.levelData.levelStyle.floor * 3 + 2);
        }

        /*for (var i = 0; i < this.dynamic_floors.length; i++) {
            var coord;
            x = this.dynamic_floors[i].x;
            y = this.dynamic_floors[i].y;
            if (this.dynamic_floors[i].type == 0 && this.dynamic_floors[i].state < 24)
                SDL_BlitSurface(floor_ruined_graph, ruined_rect[0][this.dynamic_floors[i].state], screen, coord);
            else if (this.dynamic_floors[i].type == 1)
            {
                if (this.dynamic_floors[i].state < 16)
                    SDL_BlitSurface(floor_graph, dynamic_floor_rect[0][this.dynamic_floors[i].state], screen, coord);
                else if (this.dynamic_floors[i].state > 23)
                    SDL_BlitSurface(floor_graph, dynamic_floor_rect[0][39-this.dynamic_floors[i].state], screen, coord);
            }

            for (var j = 0; j < this.dynamic_floors[i].size-32; j+=32)
            {
                if (this.dynamic_floors[i].type == 0 && this.dynamic_floors[i].state < 24)
                    SDL_BlitSurface(floor_ruined_graph, ruined_rect[1][this.dynamic_floors[i].state], screen, coord);
                else if (this.dynamic_floors[i].type == 1)
                {
                    if (this.dynamic_floors[i].state < 16)
                        SDL_BlitSurface(floor_graph, dynamic_floor_rect[1][this.dynamic_floors[i].state], screen, coord);
                    else if (this.dynamic_floors[i].state > 23)
                        SDL_BlitSurface(floor_graph, dynamic_floor_rect[1][39-this.dynamic_floors[i].state], screen, coord);
                }

                x += 32;
            }

            if (this.dynamic_floors[i].type == 0 && this.dynamic_floors[i].state < 24)
                SDL_BlitSurface(floor_ruined_graph, ruined_rect[2][this.dynamic_floors[i].state], screen, coord);
            else if (this.dynamic_floors[i].type == 1)
            {
                if (this.dynamic_floors[i].state < 16)
                    SDL_BlitSurface(floor_graph, dynamic_floor_rect[2][this.dynamic_floors[i].state], screen, coord);
                else if (this.dynamic_floors[i].state > 23)
                    SDL_BlitSurface(floor_graph, dynamic_floor_rect[2][39-this.dynamic_floors[i].state], screen, coord);
            }
        }*/

        for (var i = 0; i < this.levelData.climpers.length; i++) {
            var k = 0;
            for (var j = 0; j < this.levelData.climpers[i].size - 10; j += 12) {
                this.climp_graph.apply(this.levelData.climpers[i].x, this.levelData.climpers[i].y + j, this.levelData.levelStyle.climpers * 3);
                /*if (i % 2 === 0) {
                    this.climp_graph.apply(this.levelData.climpers[i].x, this.levelData.climpers[i].y + k, this.levelData.levelStyle.climpers * 3);
                    k += 12;
                } else {
                    this.climp_graph.apply(this.levelData.climpers[i].x, this.levelData.climpers[i].y + k, this.levelData.levelStyle.climpers * 3 + 1);
                    k += 13;
                }*/
            }
            this.climp_graph.apply(this.levelData.climpers[i].x, this.levelData.climpers[i].y + j, this.levelData.levelStyle.climpers * 3 + 2);
        }

        for (var i = 0; i < this.levelData.lifts.length; i++) {
            if (this.levelData.lifts[i].type === 0) {
                for (var j = 0; j < this.levelData.lifts[i].size; j += 8) {
                    ctx.drawImage(this.lift_ver_graph, this.levelData.lifts[i].startCoord.x + 18, this.levelData.lifts[i].startCoord.y + j);
                }
            } else {
                for (var j = 0; j < this.levelData.lifts[i].size; j += 8) {
                    ctx.drawImage(this.lift_hor_graph, this.levelData.lifts[i].startCoord.x + j, this.levelData.lifts[i].startCoord.y + 2);
                }
            }
            ctx.drawImage(this.lift_graph, this.levelData.lifts[i].x, this.levelData.lifts[i].y);
        }

        for (var i = 0; i < this.levelData.plants.length; i++) {
            this.plant_graph.apply(this.levelData.plants[i].x, this.levelData.plants[i].y, this.levelData.plants[i].isDead ? 1: 0);
        }

        for (var i = 0; i < this.levelData.fires.length; i++) {
            ctx.drawImage(this.fire_graph, this.levelData.fires[i].x, this.levelData.fires[i].y);
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

        for (var i = 0; i < this.levelData.sands.length; i++) {
            this.sands[i] = new MultipleAnimator(this.sand_anim, this.levelData.sands[i].x, this.levelData.sands[i].y, 20);
        }

        for (var i = 0; i < this.levelData.lifts.length; i++) {
            this.levelData.lifts[i].startCoord = { x: this.levelData.lifts[i].x, y: this.levelData.lifts[i].y };
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

        /*for (var i = 0; i < this.dynamic_floors.length; i++) {
            if (this.dynamic_floors[i].type == 0) {
                this.dynamic_floors[i].state = 0;
            }
        }*/
    }
}