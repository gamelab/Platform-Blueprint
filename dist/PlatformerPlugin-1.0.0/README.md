Name: Platformer Plugin.
Version: 1.0
Type: GameObject Plugin
Author: Kiwi.js Team
Website: www.kiwijs.org
KiwiJS last version tested: 0.5.3

----------------------------------------------------------------------------------------
Versions
----------------------------------------------------------------------------------------

1.0 - Initial GameObject create. 
	- Achievement creation.
	- Updating and unlocking achievements.
	- Check progress and unlocked status of any given achievement.
	- Return the description of any achievement.

----------------------------------------------------------------------------------------
Files:
----------------------------------------------------------------------------------------
	

----------------------------------------------------------------------------------------
Description:
----------------------------------------------------------------------------------------
The Achievement Manager is a Plugin for Kiwi.js that you can include to have a new GameObject in your Kiwi Game's that is used to create, update and unlock custom achievements.

If you have any problems then feel free to contact us via the http://www.kiwijs.org/help

----------------------------------------------------------------------------------------
How to Include: 
----------------------------------------------------------------------------------------

First Step:
- Copy either the Achievements-1.0.0.js or the Achievements-1.0.0.min.js file (they should be in the src folder) into your project directory. We recommend that you save the files under a plugin directory that lives inside of your project directory so that you can easily manage all of the plugins but that is not required.


Second Step:
- Link in the JavaScript file Achievements-1.0.0.js or the min version of the file) into your HTML file. Make sure you link it in underneath the link to the main Kiwi.js file AND underneath the Cocoon files.


----------------------------------------------------------------------------------------
How to use.
----------------------------------------------------------------------------------------

--------------------------------------------
Creating a new Object
--------------------------------------------
- To create a new Gameobject is the same as how you would a Sprite or Static Image. Create a variable for where it should be saved and instantiate the 'Kiwi.Plugins.AchievementManager' object. 
	    
var achievementManager = Kiwi.Plugins.AchievementManager;

--------------------------------------------
Creating achievements
--------------------------------------------
- To create a new achievement, simply call the createAchievement method and pass the following parameters.

	* @param id {string} The reference string of the achievement created. Use this to identify achievement.
	* @param titleVar {string} The displayable name of the achievement created. Use this to identify achievement for the player.
	* @param typeVar {string} The type of achievement created. 'number' or 'default'.
	* @param objectiveVar {number} Objective value used for numbered achievements. Once the current value matches, achievement is unlocked.
	* @param descriptionVar {string} String describing achievement.

achievementManager.createAchievement('click1', 'Click', 'Click to unlock this achievement', 'default', '');