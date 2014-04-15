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

    this.player = new PlayerSprite(this, this.textures.player, 0, 0);
    this.player.animation.add('walking', [1, 2, 3, 4, 5, 6], 0.1, true);
    this.player.animation.add('idle', [0], 0.1, false, true);
    this.player.animation.add('goingUp', [8], 0.1, false);
    this.player.animation.add('goingDown', [9], 0.1, false);
    this.player.physics.acceleration.y = 17;

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

/**
* The generateTileMap method outputs and organizes tile map data
* @method generateTileMap
* @public
*/
PlatformState.generateTileMap = function(){
    //Tile map
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this, 'tilemap', this.textures.tiles);
    console.log('a', this.tilemap.layers);
    //ground
    this.addChild(this.tilemap.layers[4]);
    //slope right
    this.addChild(this.tilemap.layers[3]);
    //slope left
    this.addChild(this.tilemap.layers[2]);
    //decorative assets
    this.addChild(this.tilemap.layers[1]);
    console.log('a');

    //set collisions for the ground layer only
    for (var i = 1; i < this.tilemap.tileTypes.length; i++) {
        this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    }
    console.log('a');
}

/**
* The generateForegroundTileMap method generates tile map data in front of the player
* @method generateTileMap
* @public
*/
PlatformState.generateForegroundTileMap = function () {
    //foreground assets
    console.log('ba');
    this.addChild(this.tilemap.layers[0]);
    console.log('ba');
}


/**
* This method is the main update loop. Move scrolling items here
* @method update
* @public
*/
PlatformState.update = function () {
    
    Kiwi.State.prototype.update.call(this);

    //CHECK SLOPING TILES
    //overlap slope right
    this.tilemap.layers[1].physics.overlapsTiles(this.player, true);
    //Are we on a slope
    if (this.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
        //how far on the slope are we?

        return;
    }
    //overlap slope left
    this.tilemap.layers[2].physics.overlapsTiles(this.player, true);
    //Are we on a slope
    if (this.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
        //how far on the slope are we?

        return;
    }

    //overlap ground
    this.tilemap.layers[0].physics.overlapsTiles(this.player, true);
    //Are we on the ground?
    if (this.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {

    }
}

