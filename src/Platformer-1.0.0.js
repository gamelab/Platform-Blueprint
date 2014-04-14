/**
* The basic Platformer Blueprint Object. Contains name and version number. 
* 
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class Platformer
*/
Kiwi.Plugins.Platformer = {
    name: 'Platformer',
    version: '1.0.0'
};

//REQUIREMENTS




//CREATING ACHIEVEMENTS
/**
*A Kiwi Plugin GameObject that can manage a set of achievements.
*
*You can currently set two types of achievements. 
*Default achievements are achievements that can simply be unlocked.
*Number achievements keep track of a variable, and once it has reached it's specified objective, the achievement is unlocked.
*
* @class AchievementManager
* @extends Entity
* @namespace Kiwi.Plugins.Achievements
* @constructor
*/

/*
VALUES:
type: 'default' or 'number'
collected: Set if an achievement has been successfully collected.
objective: Required value to complete an incomplete numbered achievement.
current: Current value for numbered achievements. Need to set current value to your objective value to complete a quest.
description: A string used to aid the player.

EXAMPLE:
Kiwi.Plugins.AchievementManager.Achievements = {
    test: {
        title: 'Test Achievement',
        description: 'Received an achievement',
        type: 'default',
        collected: false
    },
    numberTest: {
        title: 'Number Achievement',
        description: 'Count to 10',
        type: 'number',
        current: 0,
        objective: 10,
        collected: false
    }
}
*/

Kiwi.PluginManager.register(Kiwi.Plugins.Platformer);

/**
* A method that dynamically creates a new achievement. You can also create one manually in the achievements object above.
* @method createAchievement
* @param id {string} The reference string of the achievement created. Use this to identify achievement.
* @param titleVar {string} The displayable name of the achievement created. Use this to identify achievement for the player.
* @param typeVar {string} The type of achievement created. 'number' or 'default'.
* @param objectiveVar {number} Objective value used for numbered achievements. Once the current value matches, achievement is unlocked.
* @param descriptionVar {string} String describing achievement.
* @public
*/
Kiwi.Plugins.AchievementManager.createAchievement = function (id, titleVar, descriptionVar, typeVar, objectiveVar) {
    Kiwi.Plugins.AchievementManager.Achievements[id] = {
        collected: false,
        title: titleVar,
        description: descriptionVar
    }
    if (typeVar == 'number') {
        Kiwi.Plugins.AchievementManager.Achievements[id].type = 'number';
        Kiwi.Plugins.AchievementManager.Achievements[id].current = 0;
        Kiwi.Plugins.AchievementManager.Achievements[id].objective = objectiveVar;
    } else {
        Kiwi.Plugins.AchievementManager.Achievements[id].type = 'default';
    }
}

/**
* A method that unlocks a default achievement.
* @method getAchievement
* @param id {string} Name of the achievement to collect.
* @public
*/
Kiwi.Plugins.AchievementManager.getAchievement = function (id) {
    if (Kiwi.Plugins.AchievementManager.Achievements[id] == undefined) {
        console.log('Achievement Manager: Error identifying achievement. Attempted id:', id);
        return;
    }
    Kiwi.Plugins.AchievementManager.Achievements[id].collected = true;
}

/**
* A method that updates a numbered achievement, and unlocks the achievement automatically if the objective is met.
* @method updateQuest
* @param id {string} Name of quest to update.
* @param value {boolean or number} Value to add to the current variable, or to set to, depending on type.
* @public
*/
Kiwi.Plugins.AchievementManager.updateAchievement = function (id, value) {
    var achievement = Kiwi.Plugins.AchievementManager.Achievements[id];
    if (achievement == undefined) {
        console.log('Achievement Manager: Error updating achievement. Attempted id:', id, ', attempted value:', value);
        return;
    }
    if (typeof (value) == 'number') {
        achievement.current += value;
        if (achievement.current >= achievement.objective) {
            Kiwi.Plugins.AchievementManager.getAchievement(id);
        }
    }
}

/**
* A method that returns a boolean of whether you have collected a specifc achievement.
* @method returnUnlocked
* @param id {string} Name of achievement to check.
* @return {boolean} Achievement unlocked status.
* @public
*/
Kiwi.Plugins.AchievementManager.returnUnlocked = function (id) {
    if (Kiwi.Plugins.AchievementManager.Achievements[id] == undefined) {
        console.log('Achievement Manager: Error requesting unlocked status. Attempted id:', id);
        return;
    }
    return Kiwi.Plugins.AchievementManager.Achievements[id].collected;
}

/**
* A method that returns the description string of any given achievement.
* @method returnDescription
* @param id {string} Name of achievement to check.
* @return {string} Achievement description.
* @public
*/
Kiwi.Plugins.AchievementManager.returnDescription = function (id) {
    if (Kiwi.Plugins.AchievementManager.Achievements[id] == undefined) {
        console.log('Achievement Manager: Error requesting description. Attempted id:', id);
        return;
    }
    return Kiwi.Plugins.AchievementManager.Achievements[id].description;
}

/**
* A method that returns the current value of any given achievement.
* @method returnCurrent
* @param id {string} Name of quest to check.
* @return {number} The current value of the achievement.
* @public
*/
Kiwi.Plugins.AchievementManager.returnCurrent = function (id) {
    if (Kiwi.Plugins.AchievementManager.Achievements[id] == undefined) {
        console.log('Achievement Manager: Error requesting current amount. Attempted id:', id);
        return;
    }
    if (Kiwi.Plugins.AchievementManager.Achievements[id].current == undefined) {
        console.log('Achievement Manager: Current value does not exist. Attempted id:', id);
        return;
    }
    return Kiwi.Plugins.AchievementManager.Achievements[id].current;
}

/**
* A method that returns required value for current achievement.
* @method returnObjective
* @param id {string} Name of quest to check.
* @return {number} What is needed to complete the achievement.
* @public
*/
Kiwi.Plugins.AchievementManager.returnObjective = function (id) {
    if (Kiwi.Plugins.AchievementManager.Achievements[id] == undefined) {
        console.log('Achievement Manager: Error requesting objective. Attempted id:', id);
        return;
    }

    if (Kiwi.Plugins.AchievementManager.Achievements[id].objective == undefined) {
        console.log('Achievement Manager: Objective value does not exist. Attempted id:', id);
        return;
    }
    return Kiwi.Plugins.AchievementManager.Achievements[id].objective;
}