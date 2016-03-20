class GameBehavior extends Sup.Behavior {
  timer: number;

  awake() {
    Game.start() // Temporary Function Call
    
    // When GameBehavior awake, if game is Asteroids then spawn asteroids and alien
    if(Game.nameIndex === 0){
      // Give to this game instance, the starting timer
      this.timer = Game.timeMax;
      // And update the HUD timer
      Game.updateTimer(this.timer);
      
      // Spawn an Alien ship
      Game.spawnAlien();
      
      // Spawn as much asteroids than we have set as a Starting number
      for(let i = 0; i < Asteroids.startCount; i++){
        // Spawn an asteroid
        Game.spawnAsteroid();
      }
    }
  }

  update() {
    // If the game is Asteroids then spawn alien and asteroids
    if(Game.nameIndex === 0){
      //If alien destroyed, spawn a new alien after a certain time
      if(!Alien.alive){
        // If spawnTimer not finished, decrease by one
        if(Alien.spawnTimer > 0){
          Alien.spawnTimer--;
        // If spawnTimer finished, spawn an alien ship
        }else{
          Game.spawnAlien();
        }
      }

      // Spawn a new asteroid after a certain time until the overall number reach maximum
      // If asteroid current count is less than the max number
      if (Asteroids.currentCount < Asteroids.maxCount) {
        // If spawnTimer is not finished, decrease by one
        if (Asteroids.spawnTimer > 0) {
          Asteroids.spawnTimer--;
        }
        // If spawnTimer is finished, create a big asteroid
        else {
          Game.spawnAsteroid();
          // Reset timer for next asteroid
          Asteroids.spawnTimer = Asteroids.respawnTime; 
        }
      }
      
      // Timer and game over screen decrease to each frame
      if (this.timer > 0) {
        this.timer--
        // If 60 frames passed (which mean one second when converted), update
        if(this.timer % 60 === 0) {
          Game.updateTimer(this.timer);
        }
      // If timer at 0, then the game is finished.
      } else {
        // The game is over
        Game.gameOver();
      }
    }
  }
}
Sup.registerBehavior(GameBehavior);