var PlatformState = new Kiwi.State('PlatformState');

/**
* The PlatformState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*
* @class PlatformState
* @extends State
* @constructor
*/

/**
* This create method is executed when Kiwi Game reaches the boot stage of the game loop.
* @method create
* @public
*/
PlatformState.create = function () {

    //Switch the background colour back to white from purple
    this.game.stage.color = 'ffffff';

    //Tile map
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this, 'tilemap', this.textures.tiles);
    this.addChild(this.tilemap.layers[0]);
    this.addChild(this.tilemap.layers[1]);
    this.addChild(this.tilemap.layers[2]);

    /*
    //The starting coordinates of the bird.
    this.startX = 100;
    this.startY = 100;

    this.gameStarted = false;
    this.gameEnded = false;

    //Values pertaining to physics based logic 
    this.gravity = 1;
    this.onGround = false;
    this.xSpeed = 10;
    this.ySpeed = 0;
    this.jumpSpeed = 15;
    this.jumpHoldMax = 16;
    this.jumpHoldCount = 0;
    this.maxYSpeed = 16;

    //Add the background to the stage.
    this.bg = new Kiwi.GameObjects.Sprite(this, this.textures.background, 0, 0);
    this.addChild(this.bg);

    //Terrain
    //type, xOffset, yOffset, xSpeed (additional), ySpeed (additional)
    //The additional speed makes the tiles move while scrolling
    this.terrainData = [
        [2, 0, 400, 0, 0],
        [2, 0, 360, 0, 0],
        [2, 250, 360, 0, 0],
        [2, 250, 400, 0, 0],
        [2, 250, 380, 0, 0],
        [2, 0, 360, 0, 0],
        [2, 250, 400, 0, 1]
    ];

    //Create a lot of terrain that the character will run on.
    for (var i = 0; i < this.terrainData.length; i++) {
        var data = this.terrainData[i];
        var t = new Kiwi.GameObjects.Sprite(this, this.textures['t' + data[0]], this.game.stage.width + data[1], data[2]);
        t.active = false;
        t.xStart = data[1];
        t.yStart = data[2];
        t.xSpeed = data[3];
        t.ySpeed = data[4];
        t.name = 't' + i;
        this.addChild(t);
    }

    //Add the character to the screen.
    this.player = new Kiwi.GameObjects.Sprite(this, this.textures.player, this.startX, this.startY);
    this.player.animation.add('flap', [0, 1, 2], 0.1, true);
    this.player.animation.play('flap');
    this.addChild(this.player);

    this.playerWidth = this.player.width;
    this.playerHeight = this.player.height;

    //Add some mouse events to make the character jump/e.t.c.
    this.game.input.onDown.add(this.jump, this);
    this.game.input.onUp.add(this.releaseInput, this);

    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, '0', 50, 50, '#FFF');
    this.addChild(this.scoreText);*/
}


/**
* This method is the main update loop. Move scrolling items here
* @method update
* @public
*/
PlatformState.update = function () {
    
    Kiwi.State.prototype.update.call(this);

    //All the collision detection/in game logic will only be active as the game is running or hasn't ended.
    /*if (this.gameStarted && !this.gameEnded) {
        this.moveTerrain();

        //if player has fallen to their demise
        if (this.player.transform.y >= this.game.stage.height) {
            this.killPlayer();
            return;
        }

        //Check wall hit
        var bx = this.player.transform.x + this.player.width;
        if (this.pointSolid(bx, this.player.transform.y + 5) || this.pointSolid(bx, this.player.transform.y + this.player.height - 5)) {
            this.killPlayer();
            return;
        }

        //Holding down input for increased jump
        var held = false;
        if (!this.inputReleased) {
            this.jumpHoldCount++;
            if (this.jumpHoldCount < this.jumpHoldMax) {
                held = true;
            }
        }
        if (!held) this.ySpeed += this.gravity;

        //Check floor
        if (this.ySpeed >= 0) {
            for (var i = 0; i < this.ySpeed; i++) {
                if (this.pointSolid(this.player.transform.x, (this.player.transform.y + this.player.height)) || this.pointSolid((this.player.transform.x + this.player.width), (this.player.transform.y + this.player.height))) {
                    this.ySpeed = 0;
                    this.onGround = true;
                } else {
                    this.onGround = false;
                    this.player.y++;
                }
            }
        } else {
            this.player.y += this.ySpeed;
        }

        //update player rotation based on speed (in radians)
        if (this.ySpeed > 14) {
            this.player.transform.rotation = Math.PI / 2;
        } else if (this.ySpeed > 6) {
            this.player.transform.rotation = Math.PI / 6;
        } else {
            this.player.transform.rotation = -Math.PI / 6;
        }

        //score
        this.score++;
        this.scoreText.text = this.score;
    }*/
}

