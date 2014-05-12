var TopDownState = new Kiwi.State('TopDownState');

/**
* The TopDownState in the core state that is used in the game. 
*
* It is the state where the majority of the functionality occurs 'in-game'.
* 
*
* @class TopDownState
* @extends State
* @constructor
*/

/**
* This create method is executed when Kiwi Game reaches the boot stage of the game loop.
* @method create
* @public
*/
TopDownState.create = function () {
    //capture key input
    this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP, true);
    this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN, true);
    this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT, true);
    this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT, true);
    this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR, true);

    //set up the camera which follows the player
    this.camera = this.game.cameras.defaultCamera;

    //Switch the background colour back to white from purple
    this.game.stage.color = 'ffffff';
    this.generateTileMap();

    //individual tile dimensions
    this.tileWidth = 48;
    this.tileHeight = 48;

    //start position of player, in tiles
    this.startX = 9;
    this.startY = 8;

    this.active = true;
    this.hurt = false;

    this.player = new PlayerSprite(this, this.textures.player, this.startX * this.tileWidth, this.startY * this.tileHeight);
    //set your animations depending on your spritesheet here.
    //static: holding still, no interaction
    this.player.animation.add('down_static', [0], 0.1, true, false);
    this.player.animation.add('up_static', [11], 0.1, true, false);
    this.player.animation.add('left_static', [22], 0.1, true, false);
    this.player.animation.add('right_static', [33], 0.1, true, false);

    //walk: moving animation
    this.player.animation.add('down_walk', [1, 2, 3, 4, 5, 6], 0.15, true, false);
    this.player.animation.add('up_walk', [12, 13, 14, 15, 16], 0.15, true, false);
    this.player.animation.add('left_walk', [23, 24, 25, 26, 27, 28], 0.15, true, false);
    this.player.animation.add('right_walk', [34, 35, 36, 37, 38, 39], 0.15, true, false);

    //hurt: blinking animation
    this.player.animation.add('down_hurt', [7, 8, 9, 10], 0.1, false, false);
    this.player.animation.add('up_hurt', [17, 18, 19, 20], 0.1, false, false);
    this.player.animation.add('left_hurt', [29, 30, 31, 32], 0.1, false, false);
    this.player.animation.add('right_hurt', [40, 41, 42, 43], 0.1, false, false);

    this.dir = 'down';
    this.player.animation.switchTo(this.dir + '_static', true);

    //Add to the screen.
    this.addChild(this.player);

    //You can customize your hit box for detection here.
    this.player.box.hitbox = new Kiwi.Geom.Rectangle(20, 20, 90, 110);

    this.generateForegroundTileMap();

    this.updateCamera();

    //on stage movement controls
    this.controllerActive = false;
    if (this.controllerActive) this.generateController();
}

/**
* The generateController method displays control buttons onto the stage, and uses the TouchButton plugin
* @method generateController
* @public
*/
TopDownState.generateController = function () {
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
* This method keeps the optional directional pad in position
* @method updateController
* @public
*/
TopDownState.updateController = function () {
    if (!this.controllerActive) return;
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
TopDownState.generateTileMap = function () {
    //Tile map
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this, 'tilemap', this.textures.tiles);

    //ground
    this.groundLayer = this.tilemap.getLayerByName('ground');
    this.addChild(this.groundLayer);

    this.objectLayer = this.tilemap.getLayerByName('objects');
    this.addChild(this.objectLayer);

    this.obstacleLayer = this.tilemap.getLayerByName('obstacles');
    this.addChild(this.obstacleLayer);

    this.hitLayer = this.tilemap.getLayerByName('hitLayer');
    this.addChild(this.hitLayer);
    
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
TopDownState.generateForegroundTileMap = function () {
    //foreground assets
    this.foregroundLayer = this.tilemap.getLayerByName('foreground');
    this.addChild(this.foregroundLayer);
}

/**
* This method is the main update loop. Move scrolling items and update player here
* @method update
* @public
*/
TopDownState.update = function () {
    
    Kiwi.State.prototype.update.call(this);

    //move player via input
    if (!this.hurt) {
        if (this.active) {
            if (this.leftDown()) {
                this.player.physics.velocity.x = -40;
                this.dir = 'left';
                this.animatePlayer('left_walk');
            } else if (this.rightDown()) {
                this.player.physics.velocity.x = 40;
                this.dir = 'right';
                this.animatePlayer('right_walk');
            } else {
                this.player.physics.velocity.x = 0;
            }

            if (this.upDown()) {
                this.player.physics.velocity.y = -40;
                this.dir = 'up';
                if (this.player.physics.velocity.x == 0) this.animatePlayer('up_walk');
            } else if (this.downDown()) {
                this.player.physics.velocity.y = 40;
                this.dir = 'down';
                if (this.player.physics.velocity.x == 0) this.animatePlayer('down_walk');
            } else {
                this.player.physics.velocity.y = 0;
                if (this.player.physics.velocity.x == 0) this.animatePlayer(this.dir + '_static');
            }
        } else {
            this.player.physics.velocity.x = 0;
            this.player.physics.velocity.y = 0;
        }
    }
 
    this.player.x = Math.round(this.player.x);
    this.player.y = Math.round(this.player.y);

    //map hit detection
    this.hitLayer.physics.overlapsTiles(this.player, true);

    //object hit detection
    var overlaps = this.objectLayer.getOverlappingTiles(this.player);
    for (var i = 0; i < overlaps.length; i++) {
        //hit, so collect item
        this.collectObject(overlaps[i]);
    }

    //obstacle hit detection
    var overlaps = this.obstacleLayer.getOverlappingTiles(this.player);
    for (var i = 0; i < overlaps.length; i++) {
        //hit, so collect item
        this.hurtPlayer();
    }

    this.updateCamera();
    this.updateController();
}

/**
* This method removes the collected item, and triggers a function depending on the type of item collected.
* @method collectObject
* @param obj {object} The collected object
* @public
*/
TopDownState.collectObject = function (obj) {
    //Behave differently for each type
    switch (obj.type) {
        default:
            console.log('Collect Object:', obj.type);
            break;
    }

    //clear object
    this.objectLayer.setTileByIndex(obj.index, 0)
}

/**
* This method pushes the player away from the collided obstacle tile and plays a hurt animation temporarily
* @method hurtPlayer
* @public
*/
TopDownState.hurtPlayer = function () {
    this.hurt = true;
    this.player.physics.velocity.x *= -1;
    this.player.physics.velocity.y *= -1;
    this.player.animation.switchTo(this.dir + '_hurt', true);
    this.player.animation.onStop.addOnce(this.hurtComplete, this);
}

/**
* Once the hurt animation is complete, return to playable state
* @method hurtComplete
* @public
*/
TopDownState.hurtComplete = function () {
    this.hurt = false;
}

/**
* This method moves the game camera dynamically via the player, but restrained on game borders
* @method updateCamera
* @public
*/
TopDownState.updateCamera = function () {
    var px = this.player.x + this.player.width / 2;
    var py = this.player.y + this.player.height / 2;

    if (px < this.game.stage.width / 2) {
        this.camera.transform.x = 0;
    } else if (px > (this.groundLayer.widthInPixels - (this.game.stage.width / 2))) {
        this.camera.transform.x = -(this.groundLayer.widthInPixels - this.game.stage.width);
    } else {
        this.camera.transform.x = -px + this.game.stage.width / 2;
    }
    
    if (py < this.game.stage.height / 2) {
        this.camera.transform.y = 0;
    } else if (py > (this.groundLayer.heightInPixels - (this.game.stage.height / 2))) {
        this.camera.transform.y = -(this.groundLayer.heightInPixels - this.game.stage.height);
    } else {
        this.camera.transform.y = -py + this.game.stage.height / 2;
    }
    this.camera.transform.x = Math.floor(this.camera.transform.x);
    this.camera.transform.y = Math.floor(this.camera.transform.y);
}

/**
* This method calls an animation frame, when you are currently on another
* @method animatePlayer
* @public
*/
TopDownState.animatePlayer = function (anim) {
    if (this.player.animation.currentAnimation.name != anim) {
        this.player.animation.switchTo(anim);
        this.player.animation.play();
    }
}

/**
* The leftDown method returns whether the left key, or the controller left button is down (when active)
* @method leftDown
* @public
*/
TopDownState.leftDown = function () {
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
TopDownState.rightDown = function () {
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
TopDownState.upDown = function () {
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.UP)) return true;
    if (this.controllerActive) {
        if (this.upButton.isDown) {
            return true;
        }
    }
    return false;
}

/**
* The downDown method returns whether the down key, or the controller down button is down (when active)
* @method downDown
* @public
*/
TopDownState.downDown = function () {
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.DOWN)) return true;
    if (this.controllerActive) {
        if (this.downButton.isDown) {
            return true;
        }
    }
    return false;
}