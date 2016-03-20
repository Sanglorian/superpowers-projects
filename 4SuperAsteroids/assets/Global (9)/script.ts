// Main game datas and functions
namespace Game{
  
  // Game timer max value
  export const timeMax: number = 7200; //7200 2 minutes
  
  // The game index of the current played game, 0 for Asteroids, 1 for Spacewar
  export let nameIndex: number = 0; // Temporary allocation
  
  // The screen limits in width and height + outside border
  export let bounds : {
    width:number,
    height:number
  }
  
  // Game points won when target shot
  export enum points {
  asteroidBig = 10,
  asteroidMedium = 15,
  asteroidSmall = 20,
  alien = 50,
  ship = 100 ,
  death = -50,
     }
  
  // Life hearts positions
  export const hearts = [
    ["empty", "empty", "empty", "empty", "empty"],
    ["full", "empty", "empty", "empty", "empty"],
    ["full", "full", "empty", "empty", "empty"],
    ["full", "full", "full", "empty", "empty"],
    ["full", "full", "full", "full", "empty"],
    ["full", "full", "full", "full", "full"]
  ]
  
  
  // Flags to check HUD changes
  export var checkLifeHUD: boolean;
  export var checkScoreHUD: boolean;
  
  // Start the game
  export function start(){
    // get the Camera actor the the game Scene
    let screen = Sup.getActor("Camera").camera;
    // set a border of 2 x 1.5 units (invisible border of 24 pixels)
    let border: number = 3;
    // We get the game screen bounds and add a border of 3 units
    bounds = {
      width: screen.getOrthographicScale() + border,
      height: screen.getOrthographicScale() + border
    }
  }
  
  // Create an alien in the Game scene              
  export function spawnAlien(){
    // Load the alien prefab and get the Alien actor (index 0) as a new alien variable
    let alien = Sup.appendScene("Alien/Prefab")[0];
    
    // Choose a random position somewhere at the vertical edges of the game screen
    // Create the three axis positions x, y, z
    let x: number = 0, y: number = 0, z: number = 0;
    
    // Choose randomly a position on one of the vertical edges
    x = Sup.Math.Random.sample([-bounds.width / 2, bounds.width / 2]);
    // Choose randomly a position on y axis
    y = Sup.Math.Random.integer(-bounds.height / 2, bounds.height / 2);
    // Get alien default Z position
    z = Alien.zPosition;
    
    // Set the randomly chosen position to the Alien actor
    alien.setLocalPosition(x, y, z);
  }
  
  // Create an asteroid in the Game scene
  export function spawnAsteroid(){
    // Load the asteroid prefab and get the Asteroid actor (index 0) as a new asteroid variable
    let asteroid = Sup.appendScene("Asteroid/Prefab")[0];
    
    // Choose a random position somewhere at the edges of the game screen
    // Create the three axis positions x, y, z
    let x: number = 0, y: number = 0, z: number = 0;
    
    // Choose randomly if the asteroids come from the horizontal or vertical edges
    if(Sup.Math.Random.sample([0, 1]) === 0){
      x = Sup.Math.Random.sample([-bounds.width / 2, bounds.width / 2]);
      y = Sup.Math.Random.integer(-bounds.height / 2, bounds.height / 2);
    }
    else{
      x = Sup.Math.Random.integer(-bounds.height / 2, bounds.height / 2);
      y = Sup.Math.Random.sample([-bounds.width / 2, bounds.width / 2]);
    }
    // Choose randomly the z position on the scene in the range of Asteroids.zPoistions
    z = Sup.Math.Random.integer(Asteroids.zPositions.min, Asteroids.zPositions.max);
      
    // Set the randomly chosen position to the Asteroid actor
    asteroid.setLocalPosition(x, y, z);
    
    // Report the asteroid size
    asteroid.getBehavior(AsteroidBehavior).sizeClass = "big";
  }
  
  // Update HUD timer in the Game scene
  export function updateTimer(time: number){
    // Sup.log("one second (60 frames) of", time, "frame left."); // Debug log
    // We convert frames in minutes and seconds
    let minutes = Math.floor((time / 60) / 60);
    let seconds = Math.floor((time / 60) % 60);
    // We get The Timer actor from the Game scene and we update the text Renderer with the new time
    let timer = Sup.getActor("HUD").getChild("Timer");
    // For the last 10 seconds we need to add a 0 to keep 2 numbers in the timer
    if (seconds < 10) {
      timer.textRenderer.setText(minutes + ":0" + seconds);
    }else{
      timer.textRenderer.setText(minutes + ":" + seconds);
    }
  }
  
  // Close game scene and return menu game over screen
  export function gameOver(winner?: string){
    Sup.log("Time out");
  }
}
  
// Menu datas
namespace Menu{
  
  // Different menu screen index
  export const screens = {
      main : 0,
      asteroids : 1,
      spacewar : 2,
      gameover : 3,
     }
  
  // Game names index
  export enum names {
        Asteroids = 0,
        Spacewar = 1,
       }
}
  
// Ship datas
namespace Ships{
  // Starting ship score
  export const startScore: number = 0;
  // Starting ship life
  export const startLife: number = 3;
  
  // Starting spawn positions
  export const spawns: Sup.Math.Vector3[] = [
    new Sup.Math.Vector3(0, 0, 14), // ship1 for asteroids game
    new Sup.Math.Vector3(-4, -12, 2), // ship1 for spacewar game
    new Sup.Math.Vector3(4, 12, 4) // ship1 for spacewar game
  ] 
  
  // ship index
  export enum index {
    ship1 = 0,
    ship2 = 1
    };
  
  // Starting time before next shoot
  export const shootingTimer: number = 30;
  // Starting time before respawn
  export const respawnTimer: number = 180;
  // Starting time before vulnerability
  export const invincibleTimer: number = 200;
  
  // Linear speed
  export const linearAcceleration: number = 0.005;
  // Linear slowing down
  export const linearDamping: number = 0.97;
  
  // Rotation speed
  export const angularAcceleration: number = 0.02;
  // Rotation slowing down
  export const angularDamping: number = 0.75;
  
  // Commands for each ship by index
  export const commands = [
    {left:"LEFT", right:"RIGHT", forward:"UP", shoot:"CONTROL", boost:"SHIFT"}, // commands[0]
    {left:"A", right:"D", forward:"W", shoot:"SPACE", boost:"C"} // commands[1]
  ];
  
  // Missiles list for each ship by index
  export let missiles: Sup.Actor[][];
  // Starting missile life before destruction (frames)
  export const missileLife: number = 60;
  // Missile speed (unit/frame)
  export const missileSpeed: number = 0.30;
}


// Alien datas
namespace Alien{
  // Flag for alien alive
  export let alive: boolean = true;
  
  // Starting alien life
  export const startLife: number = 5;
  // Current alien life
  export let lifes: number;
  
  // Alien z position
  export const zPosition: number = 12;
  
  // Different alien sizes
  export const sizes: number[] = [1.8, 1.7, 1.6, 1.5];
  
  // Linear and rotation speed of alien ship
  export let linearSpeed: number = 0.05;
  export let rotationSpeed: number = 0.01;
  
  // Starting time before alien ship respawn
  export const respawnTime: number = 300;
  // Current time befer alien ship respawn
  export let spawnTimer: number = 0;
  
  // Starting time before alien ship shoot again
  export const shootTime: number = 200;
  
  // Alien missile list
  export let missiles: Sup.Actor[];
  // Alien missile speed (unit/frame)
  export const missileSpeed: number = 0.05;
}
  
// Asteroids datas
namespace Asteroids{
  // List of all current asteroids
  export let list: Sup.Actor[];
  
  // Differents size of asteroids
  export const sizes = {"big":1.5, "medium":1, "small":0.5};
  
  // Range for Z positions of asteroids
  export enum zPositions {min = -28, max = 10};
  
  // Starting asteroids number
  export const startCount: number = 5;
  // Current asteroids number
  export let currentCount: number;
  // Maximum asteroids number
  export const maxCount: number = 10;
  
  // Range of linear and rotation speed of asteroids
  export enum linearSpeed {min = -0.05, max = 0.05};
  export enum rotationSpeed {min = -0.01, max = 0.01};
  
  // Starting time before asteroids spawning
  export const respawnTime: number = 180;
  // Current time before asteroids spawning
  export let spawnTimer: number = 0;
}