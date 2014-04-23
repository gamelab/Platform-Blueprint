/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint there is only a single "Platform" section we are going to load in all of 
* the assets at this point.
*
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobbing kiwi/html5 logo and everything. We need to extend the KiwiLoadingScreen State.  
* The KiwiLoadingScreen State is an extentsion of a normal State but it has some custom code to handle the loading/bobbing/fading of all the items, so if you override a method (like the preload) for example just make sure you call the super method.
* 
* The parameters we are passing into this method are as ordered.
* 1 - name {String} Name of this state.
* 2 - stateToSwitch {String} Name of the state to switch to AFTER all the assets have loaded. Note: The state you want to switch to should already have been added to the game.
* 3 - dimensions {Object} A Object containing the width/height that the game is to be. For example {width: 1024, height: 768}
* 4 - subfolder {String} The folder that the loading graphics are located at. 
*/
var LoadingState = new KiwiLoadingScreen('LoadingState', 'PlatformState', {width:960, height: 640}, 'assets/img/loading/');
/**
* This preload method is responsible for preloading all your in game assets.
* @method preload
* @private
*/

LoadingState.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    //optional on screen controller assets
    this.addSpriteSheet('leftButton', 'assets/img/controller/leftButton.png', 51, 73);
    this.addSpriteSheet('rightButton', 'assets/img/controller/rightButton.png', 51, 73);
    this.addSpriteSheet('upButton', 'assets/img/controller/upButton.png', 73, 51);
    this.addSpriteSheet('downButton', 'assets/img/controller/downButton.png', 73, 51);

    this.addSpriteSheet('player', 'assets/img/player.png', 57, 87);
    this.addSpriteSheet('tiles', 'assets/img/tileset.png', 48, 48);
    this.addJSON('tilemap', 'assets/map/map.json');
};