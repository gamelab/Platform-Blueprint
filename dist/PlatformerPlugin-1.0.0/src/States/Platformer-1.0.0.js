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

    this.generateTileMap();

    //individual tile dimensions
    this.tileWidth = 48;
    this.tileHeight = 48;

    //total allowed jumps in succession
    this.jumpCount = 2;
    //variable to count how many jumps you have made in succession
    this.jumps = 0;
    //catch if up key is still down
    this.jumpReleased = true;
    this.sloping = true;
    //catch if left button is currently pressed
    this.leftDown = false;
    //catch if right button is currently pressed
    this.rightDown = false;

    this.player = new PlayerSprite(this, this.textures.player, 0, 0);
    this.player.animation.add('walking', [1, 2, 3, 4, 5, 6], 0.1, true);
    this.player.animation.add('idle', [0], 0.1, false, true);
    this.player.animation.add('goingUp', [8], 0.1, false);
    this.player.animation.add('goingDown', [9], 0.1, false);
    this.player.physics.acceleration.y = 30;

    //Add to the screen.
    this.addChild(this.player);

    this.px = this.player.x + this.player.box.bounds.width / 2;
    this.py = this.player.y + this.player.height;

    this.generateForegroundTileMap();

    /*
    //TEMP: Developer saving some old code for reference
     //Add some mouse events to make the character jump/e.t.c.
    this.game.input.onDown.add(this.jump, this);
    this.game.input.onUp.add(this.releaseInput, this);

    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, '0', 50, 50, '#FFF');
    this.addChild(this.scoreText);*/
}

/**
* The generateTileMap method outputs and organizes tile map data
* @method generateTileMap
* @public
*/
PlatformState.generateTileMap = function(){
    //Tile map
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this, 'tilemap', this.textures.tiles);

    //ground
    this.groundLayer = this.tilemap.getLayerByName('Ground');
    this.addChild(this.groundLayer);

    this.objectLayer = this.tilemap.getLayerByName('Objects');
    this.addChild(this.objectLayer);

    this.slopeLeftLayer = this.tilemap.getLayerByName('SlopeLeft');
    this.addChild(this.slopeLeftLayer);

    this.slopeRightLayer = this.tilemap.getLayerByName('SlopeRight');
    this.addChild(this.slopeRightLayer);
    
    //allow all tile layers to interact/not interact
    for (var i = 1; i < this.tilemap.tileTypes.length; i++) {
        this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    }
}

/**
* The generateForegroundTileMap method generates tile map data in front of the player
* @method generateForegroundTileMap
* @public
*/
PlatformState.generateForegroundTileMap = function () {
    //foreground assets
    this.foregroundRightLayer = this.tilemap.getLayerByName('Foreground');
    this.addChild(this.foregroundRightLayer);
}

/**
* This method is the main update loop. Move scrolling items here
* @method update
* @public
*/
PlatformState.update = function () {
    
    Kiwi.State.prototype.update.call(this);

    //reset key movement
    this.leftDown = false;
    this.rightDown = false;
    //move character via keyboard input
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.LEFT)) {
        this.player.scaleX = -1;
        this.player.physics.velocity.x = -40;
        this.player.animation.switchTo('walking');
    } else if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.RIGHT)) {
        this.player.scaleX = 1;
        this.player.physics.velocity.x = 40;
        this.player.animation.switchTo('walking');
    } else {
        this.player.physics.velocity.x = 0;
    }

    //check sloping collisions
    this.sloping = false;

    //CHECK TILES
    //round the player position to make tile calculation easier
    this.player.x = Math.round(this.player.x);
    this.player.y = Math.round(this.player.y);

    //bottom middle point of player to check against sloping tiles
    this.px = Math.round(this.player.x + this.player.box.bounds.width / 2);
    this.py = this.player.y + this.player.height;

    //check sloping tiles
    this.checkLeftSlope();
    this.checkRightSlope();
    
    //if the player is not on a slope, check for regular tile collision
    if (!this.sloping) {
        //overlap ground
        this.groundLayer.physics.overlapsTiles(this.player, true);
        //Are we on the ground?
        if (this.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
            //console.log('ground')
            this.jumps = 0;
        } else if (this.jumps == 0) {
            //if the player walks off an edge, call it a jump
            this.jumps = 1;
        }
    } else {
        //on ground anyway, so reset jumps
        this.jumps = 0;
    }
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.UP)) {
        this.jump();
    } else {
        this.jumpReleased = true;
    }
}

/**
* This method makes the player jump when the Up key is pressed. Can jump multiple times based on the variable 'jumpCount'
* @method jump
* @public
*/
PlatformState.jump = function () {
    if (this.jumps < this.jumpCount && this.jumpReleased) {
        this.player.physics.velocity.y = -100;
        this.jumps++;
        this.player.animation.switchTo('goingUp');
        this.jumpReleased = false;
    }
}


/**
* This method checks to see if a player is on a leftSlope.
*
* Please note, "leftSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing left.
* Also note, this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkLeftSlope
* @public
*/
PlatformState.checkLeftSlope = function () {
    var tx = Math.floor(this.px / this.tileWidth);
    var ty = Math.floor(this.py / this.tileHeight);

    //basic slope tile collision, entering a slope from the top
    var slope = this.slopeLeftLayer.getTileFromXY(tx, ty);
    if (slope != null) {
        //if a tile exists, check collision
        if (slope.index != 0) {
            //get the slope postion
            var slopeX = tx * this.tileWidth;
            var slopeY = ty * this.tileHeight;
            this.sloping = true;

            //get the difference of player position ad slope 0,0 co-ordinates
            var diffX = this.px - slopeX;
            var diffY = this.py - slopeY;

            //if you're within the solid part of a sloping tile
            //OR if youve just entered a tile from the right, snap down into the tile
            if ((diffY >= this.tileHeight - diffX)
            || (this.px - (this.player.physics.velocity.x / 10) >= slopeX + this.tileWidth)) {
                var destY = slopeY + this.tileHeight - diffX;

                this.player.y = Math.ceil(destY - this.player.height);
                this.player.physics.velocity.y = 40;

                //already sloping, so no need for further checking
                return;
            }
        }
    }

    //check when entering onto a sloping tile, and also when between two, or when you'ce fallen "into" the tile
    var aboveSlope = this.slopeLeftLayer.getTileFromXY(tx, ty-1);
    if (aboveSlope != null) {
        //if a tile exists, check collision
        if (aboveSlope.index != 0) {
            var aboveSlopeX = tx * this.tileWidth;
            var aboveSlopeY = (ty-1) * this.tileHeight;

            //flag to ignore remaining map collision in the update loop
            this.sloping = true;

            var diffX = this.px - aboveSlopeX;
            var destY = (aboveSlopeY + this.tileHeight) - diffX;

            this.player.y = destY - this.player.height;
            this.player.physics.velocity.y = 40;
        }
    }
}

/**
* This method checks to see if a player is on a rightSlope.
*
* Please note, "rightSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing right.
* Also note this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkRightSlope
* @public
*/
PlatformState.checkRightSlope = function () {
    if (this.sloping) {
        //console.log('Already sloping on left slope')
        return;
    }
    //get the bottom centre point ofthe character to calculate position from
    //tile based location
    var tx = Math.floor(this.px / this.tileWidth);
    var ty = Math.floor(this.py / this.tileHeight);

    var slope = this.slopeRightLayer.getTileFromXY(tx, ty);
    if (slope != null) {
        //if a tile exists, check collision
        if (slope.index != 0) {
            //get the slope postion
            var slopeX = tx * this.tileWidth;
            var slopeY = ty * this.tileHeight;

            //flag to ignore remaining map collision in the update loop
            this.sloping = true;

            //get the difference of player position ad slope 0,0 co-ordinates
            var diffX = this.px - slopeX;
            var diffY = this.py - slopeY;

            //if you're within the solid part of a sloping tile
            //OR if youve just entered a tile from the left, snap down into the tile
            if ((diffY >= diffX)
            || (this.px - (this.player.physics.velocity.x / 10) <= slopeX)) {
                this.player.y = Math.ceil(slopeY + diffX - this.player.height);
                this.player.physics.velocity.y = 40;

                //already sloping, so no need for further checking
                return;
            }
        }
    }

    //check when entering onto a sloping tile, or when you've fallen "into" the tile
    var aboveSlope = this.slopeRightLayer.getTileFromXY(tx, ty - 1);
    if (aboveSlope != null) {
        //if a tile exists, check collision
        if (aboveSlope.index != 0) {
            //flag to ignore remaining map collision in the update loop
            this.sloping = true;

            var aboveSlopeX = tx * this.tileWidth;
            var aboveSlopeY = (ty - 1) * this.tileHeight;
            var diffX = this.px - aboveSlopeX;

            this.player.y = Math.ceil(aboveSlopeY + diffX - this.player.height);
            this.player.physics.velocity.y = 40;
        }
    }
}