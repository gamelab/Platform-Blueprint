var PlatformState = new Kiwi.State('PlatformState');

/**
* The PlatformState in the core state that is used in the game. 
*
* It is the state where the majority of the functionality occurs 'in-game'.
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
    //camera to follow movement of player
    this.camera = this.game.cameras.defaultCamera;

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

    this.player = new PlayerSprite(this, this.textures.player, 0, 0);
    this.player.animation.add('walking', [1, 2, 3, 4, 5, 6], 0.1, true, true);
    this.player.animation.add('idle', [0], 0.1, true, true);
    this.player.animation.add('goingUp', [8], 0.1, true, true);
    this.player.animation.add('goingDown', [9], 0.1, true, true);
    this.player.physics.acceleration.y = 30;

    //Add to the screen.
    this.addChild(this.player);

    this.px = this.player.x + this.player.box.bounds.width / 2;
    this.py = this.player.y + this.player.height;

    this.generateForegroundTileMap();

    /*
    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, '0', 50, 50, '#FFF');
    this.addChild(this.scoreText);
    */

    //on stage movement controls
    this.controllerActive = true;
    if (this.controllerActive) this.generateController();
}

/**
* The generateController method displays control buttons onto the stage, and uses the TouchButton plugin
* @method generateController
* @public
*/
PlatformState.generateController = function () {
    this.upButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['upButton'], 81, 300);
    this.upButton.posX = this.upButton.x;
    this.upButton.posY = this.upButton.y;
    this.addChild(this.upButton);

    this.downButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['downButton'], 81, 441);
    this.downButton.posX = this.downButton.x;
    this.downButton.posY = this.downButton.y;
    this.addChild(this.downButton);

    this.leftButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['leftButton'], 26, 360);
    this.leftButton.posX = this.leftButton.x;
    this.leftButton.posY = this.leftButton.y;
    this.addChild(this.leftButton);

    this.rightButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['rightButton'], 162, 360);
    this.rightButton.posX = this.rightButton.x;
    this.rightButton.posY = this.rightButton.y;
    this.addChild(this.rightButton);
}

/**
* The updateController method moves the controller graphics to stay in position.
* @method updateController
* @public
*/
PlatformState.updateController = function () {
    this.upButton.x = this.upButton.posX - this.camera.transform.x;
    this.upButton.y = this.upButton.posY - this.camera.transform.y;

    this.downButton.x = this.downButton.posX - this.camera.transform.x;
    this.downButton.y = this.downButton.posY - this.camera.transform.y;

    this.leftButton.x = this.leftButton.posX - this.camera.transform.x;
    this.leftButton.y = this.leftButton.posY - this.camera.transform.y;

    this.rightButton.x = this.rightButton.posX - this.camera.transform.x;
    this.rightButton.y = this.rightButton.posY - this.camera.transform.y;
}

/**
* The generateTileMap method outputs and organizes tile map data in individual layers
* @method generateTileMap
* @public
*/
PlatformState.generateTileMap = function () {
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
* This method is the main update loop. Move scrolling items and update player here
* @method update
* @public
*/
PlatformState.update = function () {
    
    Kiwi.State.prototype.update.call(this);

    //move character via keyboard input
    if (this.leftDown()) {
        this.player.scaleX = -1;
        this.player.physics.velocity.x = -40;
    } else if (this.rightDown()) {
        this.player.scaleX = 1;
        this.player.physics.velocity.x = 40;
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
    
    var onGround = false;

    //if the player is not on a slope, check for regular tile collision
    if (!this.sloping) {
        //overlap ground
        this.groundLayer.physics.overlapsTiles(this.player, true);
        //Are we on the ground?
        if (this.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
            this.jumps = 0;
            onGround = true;
        }
    } else {
        //on ground anyway, so reset jumps
        if (this.player.physics.velocity.y >= 0) {
            this.jumps = 0;
            onGround = true;
        }
    }

    //set animation
    if (onGround) {
        if (this.player.physics.velocity.x == 0) {
            this.animatePlayer('idle');
        } else {
            this.animatePlayer('walking');
        }
    }

    if (this.upDown()) {
        this.jump();
    } else {
        this.jumpReleased = true;
    }

    this.updateCamera();
    this.updateController();
}

/**
* This method moves the game camera dynamically via the player, but restrained on game borders
* @method updateCamera
* @public
*/
PlatformState.updateCamera = function () {
    if (this.player.x < this.game.stage.width / 2) {
        this.camera.transform.x = 0;
    } else if (this.player.x > (this.groundLayer.widthInPixels - (this.game.stage.width / 2))) {
        this.camera.transform.x = -(this.groundLayer.widthInPixels - this.game.stage.width);
    } else {
        this.camera.transform.x = -this.player.x + this.game.stage.width / 2;
    }
    
    if (this.player.y < this.game.stage.height / 2) {
        this.camera.transform.y = 0;
    } else if (this.player.y > (this.groundLayer.heightInPixels - (this.game.stage.height / 2))) {
        this.camera.transform.y = -(this.groundLayer.heightInPixels - this.game.stage.height);
    } else {
        this.camera.transform.y = -this.player.y + this.game.stage.height / 2;
    }
}

/**
* This method calls an animation frame, when you are currently on another
* @method animatePlayer
* @public
*/
PlatformState.animatePlayer = function (anim) {
    if (this.player.animation.currentAnimation.name != anim) {
        this.player.animation.switchTo(anim);
        this.player.animation.play();
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
        this.animatePlayer('goingUp');
        this.jumpReleased = false;
    }
}

/**
* The leftDown method returns whether the left key, or the controller left button is down (when active)
* @method leftDown
* @public
*/
PlatformState.leftDown = function () {
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.LEFT)) return true;
    if (this.controllerActive) {
        if (this.leftButton.isDown) return true;
    }
    return false;
}

/**
* The rightDown method returns whether the right key, or the controller right button is down (when active)
* @method rightDown
* @public
*/
PlatformState.rightDown = function () {
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.RIGHT)) return true;
    if (this.controllerActive) {
        if (this.rightButton.isDown) return true;
    }
    return false;
}

/**
* The upDown method returns whether the up key, or the controller up button is down (when active)
* @method upDown
* @public
*/
PlatformState.upDown = function () {
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.UP)) return true;
    if (this.controllerActive) {
        if (this.upButton.isDown) {
            return true;
        }
    }
    return false;
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