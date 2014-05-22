
/**
* The containing Top-Down blueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 
var gameOptions = { 
    plugins: ['TouchButton'],
	width: 800,
	height: 600,
	debug: Kiwi.DEBUG_OFF
};

var game = new Kiwi.Game('content', 'Platform', null, gameOptions);

//Add all the States we are going to use.
game.states.addState(LoadingState);
game.states.addState(PlatformState);

//Switch to/use the Preloader state. 
game.states.switchState("LoadingState");