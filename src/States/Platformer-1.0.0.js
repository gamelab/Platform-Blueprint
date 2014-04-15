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

    this.setKeys();

    this.generateTileMap();

    this.tileWidth = 48;
    this.tileHeight = 48;
    //total allowed jumps in succession
    this.jumpCount = 2;
    //variable to count how many jumps you have made in succession
    this.jumps = 0;
    //catch if up key is still down
    this.jumpReleased = true;

    this.player = new PlayerSprite(this, this.textures.player, 0, 0);
    this.player.animation.add('walking', [1, 2, 3, 4, 5, 6], 0.1, true);
    this.player.animation.add('idle', [0], 0.1, false, true);
    this.player.animation.add('goingUp', [8], 0.1, false);
    this.player.animation.add('goingDown', [9], 0.1, false);
    this.player.physics.acceleration.y = 30;

    //Add to the screen.
    this.addChild(this.player);

    this.generateForegroundTileMap();

    /*
     //Add some mouse events to make the character jump/e.t.c.
    this.game.input.onDown.add(this.jump, this);
    this.game.input.onUp.add(this.releaseInput, this);

    //Score
    this.score = 0;
    this.scoreText = new Kiwi.GameObjects.Textfield(this, '0', 50, 50, '#FFF');
    this.addChild(this.scoreText);*/
}

PlatformState.setKeys = function () {
    this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
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
    
    //allow al tile layers to interact/not interact
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

    //CHECK TILES
    //bottom middle point of player to check against sloping tiles
    var px = this.player.x + this.player.box.bounds.width / 2;
    var py = this.player.y + this.player.height;

    //overlap slope left
    var sloping = false;
    var leftSlopes = this.slopeLeftLayer.getOverlappingTiles(this.player);
    for (var i = 0; i < leftSlopes.length; i++) {
        var slope = leftSlopes[i];
        //check to see if within bounds
        if (px > slope.x && px < slope.x + this.tileWidth) {
            var slopeX = px - slope.x;
            var slopeY = py - slope.y;
            if (slopeY >= this.tileHeight - slopeX) {
                this.player.y = slope.y + this.tileHeight - slopeX - this.player.height;
                sloping = true;
            }
        }
    }

    //overlap slope right
    var rightSlopes = this.slopeRightLayer.getOverlappingTiles(this.player);
    for (var i = 0; i < rightSlopes.length; i++) {
        var slope = rightSlopes[i];
        if (px > slope.x && px < slope.x + this.tileWidth) {
            var slopeX = px - slope.x;
            var slopeY = py - slope.y;
            if (slopeY >= slopeX) {
                this.player.y = slope.y + slopeX - this.player.height;
                sloping = true;
            }
        }
    }

    //overlap ground
    this.groundLayer.physics.overlapsTiles(this.player, true);
    //Are we on the ground?
    if (this.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
        //console.log('ground')
        this.jumps = 0;
        
    }
    if (this.game.input.keyboard.isDown(Kiwi.Input.Keycodes.UP)) {
        this.jump();
    } else {
        this.jumpReleased = true;
    }
}

PlatformState.jump = function () {
    if (this.jumps < this.jumpCount && this.jumpReleased) {
        this.player.physics.velocity.y = -100;
        this.jumps++;
        this.player.animation.switchTo('goingUp');
        this.jumpReleased = false;
    }
}

