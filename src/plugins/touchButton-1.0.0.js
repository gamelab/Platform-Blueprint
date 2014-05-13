/**
* 
* @model Kiwi
* @submodel Plugins
* @class TouchButton
*/
Kiwi.Plugins.TouchButton = {
	name: 'TouchButton',
	version: '1.0.0'
}
Kiwi.PluginManager.register(Kiwi.Plugins.TouchButton);

//Do Kiwi Plugin GameObjects Exist?
if( typeof Kiwi.Plugins.GameObjects == "undefined") {
    Kiwi.Plugins.GameObjects = {}; 
}

Kiwi.Plugins.GameObjects.TouchButton = function(state, atlas, x, y){

	Kiwi.GameObjects.Sprite.call(this, state, atlas, x, y);

	this.animation.add('up', [0], 0.1, false);
	this.animation.add('down', [1], 0.1, false);	
	this.animation.play('up');
	this.isDown = false;
	this.isUp = true;
	this.hitbox = new Kiwi.Geom.Rectangle(x, y, this.width, this.height);
	this.enabled = true;

}
Kiwi.extend(Kiwi.Plugins.GameObjects.TouchButton, Kiwi.GameObjects.Sprite);

Kiwi.Plugins.GameObjects.TouchButton.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	var hit = false;
    //bug w/game.input
	//if(this.game.input.isDown) console.log('DOWN')
	if(this.enabled){
	    if (this.game.input.isDown) {
	        //console.log('input:', this.game.input.pointers)
			for(var i = 0; i<this.game.input.pointers.length; i++){
				if(this.game.input.pointers[i].active){
					if(this.hitbox.containsPoint(this.game.input.pointers[i].point)){
						if(this.isUp){
							this.isDown = true;
							this.isUp = false;
							if(this.animation.currentAnimation.name!='down')
								this.animation.switchTo('down', true);
						}
						hit = true;
					}
				}
			}
		}
	}

	if(!hit){
		if(this.isDown){
			this.isDown = false;
			this.isUp = true;
			if(this.animation.currentAnimation.name!='up')
				this.animation.switchTo('up', true);
		}
	}

}

//Disables the use of this button 
Kiwi.Plugins.GameObjects.TouchButton.prototype.disable = function(){
	this.enabled = false;
}

//Enables the use of this button 
Kiwi.Plugins.GameObjects.TouchButton.prototype.enable = function(){
	this.enabled = true;
}

//Hides the button but still allows its use
Kiwi.Plugins.GameObjects.TouchButton.prototype.hide = function(){
	this.visibility = false;
}

//Shows the button if it was hidden
Kiwi.Plugins.GameObjects.TouchButton.prototype.show = function(){
	this.visibility = true;
}