let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete;

let current;
let goal;


class Maze{
    constructor(size ,rows, columns){
    this.size = size;
    this.rows = rows;
    this.columns = columns ;
    this.grid = [];
    this.stack = [];
    }
    setup(){
        for(let r = 0; r < this.rows ; r++){
            let row = [];
            for(let c = 0 ; c< this.columns; c++){
                let cell = new Cell(r,c,this.grid,this.size);
                row.push(cell);
            }
            this.grid.push(row)
        }
         current = this.grid[0][0];
         this.grid[this.rows - 1][this.columns - 1].goal = true;
    } 
    draw(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        current.visited = true;

        for(let r = 0 ; r < this.rows ; r++ ){
            for(let c = 0 ;c <this.columns;c++){
                let grid = this.grid;
                grid[r][c].show(this.size , this.rows , this.columns);
            }
        }
        let next  = current.checkNeighbours();
        if(next){
            next.visited = true ;
            this.stack.push(current);
            current.highlight(this.columns);
            current.removeWalls(current , next);
            current = next;
        } else if (this.stack.length > 0){
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }
        if(this.stack.length == 0){
            generationComplete = true;
            return;
        }
        // window.requestAnimationFrame(() =>{
           this.draw();
        // })
    }
}
class Cell {
    constructor(rowNum,colNum, parentGrid , parentSize){
        this.rowNum = rowNum ;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall : true ,
            rightWall : true,
            bottomWall : true ,
            leftWall : true,
        };
        this.goal = false;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;

    }
    checkNeighbours(){
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];
        let top = row != 0 ? grid[row - 1][col] : undefined;
        let right = col != grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row != grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col != 0 ? grid[row][col - 1] : undefined;

        if(top && !top.visited) neighbours.push(top);
        if(right && !right.visited) neighbours.push(right);
        if(bottom && !bottom.visited) neighbours.push(bottom);
        if(left && !left.visited) neighbours.push(left);
        if(neighbours.length !== 0){
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random] ;
        } else{
            return undefined ;
        }
    }
    drawTopwall( x , y , size,columns,rows){
        ctx.beginPath();
        ctx.moveTo(x , y);
        ctx.lineTo( x + size / columns , y );
        ctx.stroke();

    }
    drawRightwall( x , y , size,columns,rows){
        ctx.beginPath();
        ctx.moveTo(x  + size/columns, y);
        ctx.lineTo( x + size / columns , y + size/rows );
        ctx.stroke();

    }
    drawBottomwall( x , y , size,columns,rows){
        ctx.beginPath();
        ctx.moveTo(x , y + size/rows);
        ctx.lineTo( x + size / columns , y + size/rows);
        ctx.stroke();

    }
    drawLeftwall( x , y , size,columns,rows){
        ctx.beginPath();
        ctx.moveTo(x , y);
        ctx.lineTo( x , y + size/rows);
        ctx.stroke();

    }
    highlight(columns){
        let x = (this.colNum * this.parentSize) / columns + 1 ;
        let y = (this.rowNum * this.parentSize) / columns + 1 ;
        ctx.fillStyle = 'purple';
        ctx.fillRect( x , y , this.parentSize /columns - 3 , this.parentSize /columns - 3 );
    }
    removeWalls(cell1 , cell2){
        let x = (cell1.colNum - cell2.colNum);
        if (x == 1){
           cell1.walls.leftWall = false ;
           cell2.walls.rightWall = false ;

        } else if( x == -1){
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }
        let y = cell1.rowNum - cell2.rowNum ;
        if (y == 1){
            cell1.walls.topWall = false ;
            cell2.walls.bottomWall = false ;
 
         } else if( y == -1){
             cell1.walls.bottomWall = false;
             cell2.walls.topWall = false;
         }
    }
    show(size , rows , columns){
        let x =(this.colNum * size) /columns;
        let y = (this.rowNum * size) /rows;
        ctx.strokeStyle = "white" ;
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;
        if (this.walls.topWall) this.drawTopwall(x ,y ,size,columns,rows);
        if (this.walls.rightWall) this.drawRightwall(x ,y ,size,columns,rows);
        if (this.walls.bottomWall) this.drawBottomwall(x ,y ,size,columns,rows);
        if (this.walls.leftWall) this.drawLeftwall(x ,y ,size,columns,rows);
        if(this.visited){
            ctx.fillRect(x + 1 , y + 1 , size/columns - 2, size/rows - 2);
        }
        if( this.goal){
            ctx.fillStyle = "green";
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        
        }
    }
}
// let newMaze = new Maze(500, 10 , 10);
// newMaze.setup();
// newMaze.draw();
let form = document.querySelector("#settings");
// let size = document.querySelector("#size");
// let rowsCols = document.querySelector("#number");
let complete = document.querySelector(".complete");
let replay = document.querySelector(".replay");
let close = document.querySelector(".close");

let newMaze;

let num = 0;
const level_1 = document.querySelector("#level_1");
const level_2 = document.querySelector("#level_2");
const level_3 = document.querySelector("#level_3");

level_1.addEventListener('click',function(){
  num = 5;
})
level_2.addEventListener('click',function(){
  num = 10;
})
level_3.addEventListener('click',function(){
  num = 15;
})

form.addEventListener("submit", generateMaze);
document.addEventListener("keydown", move);
replay.addEventListener("click", () => {
  location.reload();
});

close.addEventListener("click", () => {
  complete.style.display = "none";
});

function generateMaze(e) {
  e.preventDefault();


  let mazeSize = 400;
  let number = num;
  

  form.style.display = "none";

  newMaze = new Maze(mazeSize, number, number);
  newMaze.setup();
  newMaze.draw();
}

function move(e) {
  if (!generationComplete) return;
  let key = e.key;
  let row = current.rowNum;
  let col = current.colNum;

  switch (key) {
    case "ArrowUp":
      if (!current.walls.topWall) {
        let next = newMaze.grid[row - 1][col];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        // not required if goal is in bottom right
        if (current.goal) complete.style.display = "block";
      }
      break;

    case "ArrowRight":
      if (!current.walls.rightWall) {
        let next = newMaze.grid[row][col + 1];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        if (current.goal) complete.style.display = "block";
      }
      break;

    case "ArrowDown":
      if (!current.walls.bottomWall) {
        let next = newMaze.grid[row + 1][col];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        if (current.goal) complete.style.display = "block";
      }
      break;

    case "ArrowLeft":
      if (!current.walls.leftWall) {
        let next = newMaze.grid[row][col - 1];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        // not required if goal is in bottom right
        if (current.goal) complete.style.display = "block";
      }
      break;
  }
}
