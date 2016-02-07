// We initialize a variable ray which is of type Math.Ray
var ray : Sup.Math.Ray;
    
class ButtonBehavior extends Sup.Behavior {
  // flag to tell when the mouse hover the button
  isHover : boolean = false;

  awake() {
    ray = new Sup.Math.Ray(this.actor.getPosition(), new Sup.Math.Vector3(0, 0, -1));
  }
  
  /* We define different possible actions of the mouse,
  click action load the game scene, hovering and unhovering
  make the button to change the sprite.*/

  mouse(action) {
    if(action == "click"){
      Sup.loadScene("Game");
      Sup.Audio.playSound("GameSounds/toc");
    }
    else if(action == "hover"){
      Sup.getActor("Button").spriteRenderer.setSprite("MenuSprites/starton");
    }
    else if(action == "unhover"){
      Sup.getActor("Button").spriteRenderer.setSprite("MenuSprites/startoff");
    }
  }

  update() {
    // Refresh position of the mouse in the camera
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition()); 
    
    /* Condition to check if yes or no, the mouse hover
    the button, and if yes, check if the mouse click. 
    We call the mouse function with the action related. */
    
    if(ray.intersectActor(this.actor, false).length > 0){
      if(!this.isHover){
        this.mouse("hover");
        this.isHover = true;
      }
      if(Sup.Input.wasMouseButtonJustPressed(0)){
        this.mouse("click")
      }
    }
    else if(this.isHover){
      this.isHover = false;  
      this.mouse("unhover")
    }
    
  }
}
Sup.registerBehavior(ButtonBehavior);
