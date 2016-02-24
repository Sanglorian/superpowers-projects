// List the game levels
const LEVELS = {
  0:'LevelTemplate',
  1:'Level1',
  2:'Level2',
  3:'Level3'
};

// List the map layers
enum Layers{
      World = 0,
      Actors = 1
     };

// List the map tiles
enum Tiles{
      Empty = -1,
      Wall = 0,
      Floor = 1,
      Target = 2,
      Crate = 3,
      Start = 4,
      Packet = 5
     };

// Game level won flag
var isLevelWon : boolean = false;

// Current Level, Start Level 1
var levelCount : number = 1;

// Number of level, checked when game awake
var levelMax : number;


// Original map pattern saved
var mapSaved : number[][];

// Set new player position to map origin
var playerPosition = new Sup.Math.Vector2(0, 0);

namespace Game{
  export function getMaxLevel(){
    levelMax = 0;
    // Add one for each level in LEVELS
    for(let level in LEVELS){
      levelMax++;
    }
  }

  export function getPosition(level){
    /*
      Scan the 16x12 level in order to :
      - Save the tile pattern for each layer in the mapSaved array
      - Set the playerPosition vector from the Start tile position on Actor layer
      - Change the Start tile by an empty tile (the Player Sprite will come instead)
    */

    // Set the variables to default, erase previous level
    mapSaved = [];
    playerPosition.x = 0, playerPosition.y = 0;

    for(let row = 0; row < 12; row++){
      for(let column = 0; column < 16; column++){

        // get the tile for x = column and y = row positions
        let actorTile = level.getTileAt(Layers.Actors, column, row);

        // Add the tile to the array
        mapSaved.push(actorTile);

        if(actorTile === Tiles.Start){
          // remove the Start tile and replace with empty tile
          level.setTileAt(Layers.Actors, column, row, Tiles.Empty);

          // set position to x, y on level map
          playerPosition.add(column, row);
        }
      }
    }
  }

  export function checkLevel(level){

    /*
    We check all the level for the crates and targets positions.
    We then compare if the position of crates and targets match,
    if all crate are on target, the level is won.
    */

    let boxesNumber : number = 0;
    let boxesPositions = [];
    let targetsPositions = [];

    for(let row = 0; row < 12; row++){
      for(let column = 0; column < 16; column++){

        // Take the tiles from two layers to coordinates column and row
        let actorTile = level.getTileAt(Layers.Actors, column, row);
        let worldTile = level.getTileAt(Layers.World, column, row);

        // If the actor tile is a box, keep the position
        if(actorTile === Tiles.Crate || actorTile === Tiles.Packet){
          let position = new Sup.Math.Vector2(column, row);
          boxesPositions.push(position);

          // we count the total number of crate
          boxesNumber++;
        }

        // If the world tile is a target, keep the position
        if(worldTile === Tiles.Target){
          let position = new Sup.Math.Vector2(column, row);
          targetsPositions.push(position);
        }
      }
    }

    // Check if all boxes
    if(checkVictory(level, boxesNumber, boxesPositions, targetsPositions)){
      isLevelWon = true;
      levelCount++;
    };
  }

  function checkVictory(level, boxesNumber, boxesPositions, targetsPositions){

    /*
    Check all the positions and find if the coordinate match together.
    If there is as much match than there is boxes, the game is finished.
    */

    let count : number = 0;

    for(let posBox of boxesPositions){
      for(let posTarget of targetsPositions){
        if(posBox.x === posTarget.x && posBox.y === posTarget.y){
          count++;
        }
      }
    }
    if(count === boxesNumber){
      return true;
    }
  }

  export function setLevel(){
        //reset values to default
        isLevelWon = false;
        //reload the scene
        Sup.loadScene("Game");
  }

  export function resetLevel(level){
    let index : number = 0;

    // set all the actor tiles of the current level to the savedMap tile
    for(let row = 0; row < 12; row++){
      for(let column = 0; column < 16; column++){
        level.setTileAt(Layers.Actors, column, row, mapSaved[index]);
        index++
      }
    }
    // call the setLevel function to prepare a new level
    setLevel();
  }
}

// Call the getMaxLevel function when game is launched
Game.getMaxLevel();
