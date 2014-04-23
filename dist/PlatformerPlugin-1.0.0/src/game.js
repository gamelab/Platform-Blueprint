
/**
* The containing Platformer blueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 
var game = new Kiwi.Game('content', 'Platformer', null, {/*renderer:Kiwi.RENDERER_WEBGL,*/plugins: ['TouchButton'], width: 960, height: 640 });

//Add all the States we are going to use.
game.states.addState(LoadingState);
game.states.addState(PlatformState);

//Switch to/use the Preloader state. 
game.states.switchState("LoadingState");