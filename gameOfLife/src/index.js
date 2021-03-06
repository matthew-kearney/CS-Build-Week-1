import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, DropdownItem, DropdownButton } from 'react-bootstrap';

// class for individual box on grid
class Box extends React.Component {
  
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col)
  }
  
  render() {
    return (
      <div className={this.props.boxClass} id={this.props.id} onClick={this.selectBox}/>
    )
  }
}

// class for grid of boxes
class Grid extends React.Component {
  
  render() {
    const width = (this.props.cols * 14) + 1;
    var rowsArr = [];
    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxID = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxID}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
            />
        );
      }
    }

    return (
      <div className="grid" style={{width: width}}>
        {rowsArr}
      
      </div>
    )
  }
}
// class for the buttons
class Buttons extends React.Component {

	handleSelect = (evt) => {
		this.props.gridSize(evt);
	}

	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="button" variant="light" onClick={this.props.playButton}>
						Play
					</button>
					<button className="button" variant="light" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="button" variant="light" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="button" variant="light" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="button" variant="light" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="button" variant="light" onClick={this.props.seed}>
					  Random
					</button>
					<DropdownButton
            class="button"
						title="Grid Size"
						id="size-menu"
            onSelect={this.handleSelect}
					>
						<DropdownItem eventKey="1">20x10</DropdownItem>
            <br></br>
						<DropdownItem eventKey="2">50x30</DropdownItem>
            <br></br>
						<DropdownItem eventKey="3">70x50</DropdownItem>
					</DropdownButton>
				</ButtonToolbar>
			</div>
			)
	}
}

// class for holding everything on the screen
class Container extends React.Component {
    constructor() {
      super();
      this.speed = 100;
      this.rows = 36;
      this.cols = 42;
      this.state = {
        generation: 0,
        gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
      }
    }
// double buffering with gridcopy and seed
    selectBox = (row, col) => {
      let gridCopy = arrayClone(this.state.gridFull);
      gridCopy[row][col] = !gridCopy[row][col];
      this.setState({
        gridFull: gridCopy
      })
    }

    seed = () => {
      let gridCopy = arrayClone(this.state.gridFull);
      for (let i = 0; i < this.rows; i ++) {
        for (let j = 0; j < this.cols; j ++) {
          if (Math.floor(Math.random() * 4) === 1) {
            gridCopy[i][j] = true;
          }
        }
      }
      this.setState({
        gridFull: gridCopy
      });
    }
// logic for play button
    playButton = () => {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.play, this.speed);
    }
// logic for pause button
    pauseButton = () => {
      clearInterval(this.intervalId);
    }
// logic for slow speed
    slow = () => {
      this.speed = 1000;
      this.playButton();
    }
// logic for fast speed  
    fast = () => {
      this.speed = 100;
      this.playButton();
    }
// logic for clearing grid  
    clear = () => {
      var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
      this.setState({
        gridFull: grid,
        generation: 0
      });
    }
// grid variable sizes
    gridSize = (size) => {
      switch (size) {
        case "1":
          this.cols = 26;
          this.rows = 28;
          
        break
        case "2":
          this.cols = 30;
          this.rows = 35;
        break
        default:
          this.cols = 48;
          this.rows = 56;
      }
      this.clear();      
    }
// logic for the rules of the game of life
    play = () => {
      let g = this.state.gridFull;
      let g2 = arrayClone(this.state.gridFull);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          let count = 0;
          if (i > 0) if (g[i - 1][j]) count++;
          if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
          if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
          if (j < this.cols - 1) if (g[i][j + 1]) count++;
          if (j > 0) if (g[i][j - 1]) count++;
          if (i < this.rows - 1) if (g[i + 1][j]) count++;
          if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
          if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
          if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
          if (!g[i][j] && count === 3) g2[i][j] = true;        
        }
      }
      
      this.setState({
        gridFull: g2,
        generation: this.state.generation + 1
      });
    }

    componentDidMount() {
      this.seed();
    }

    render() {
        return (
            <div>
                <h1><span >Conways Game of life</span ></h1>
                <Buttons
                  playButton={this.playButton}
                  pauseButton={this.pauseButton}
                  slow={this.slow}
                  fast={this.fast}
                  clear={this.clear}
                  seed={this.seed}
                  gridSize={this.gridSize}
                />
                <Grid
                  gridFull={this.state.gridFull}
                  rows={this.rows}
                  cols={this.cols}
                  selectBox={this.selectBox}
                />
                <h2>Generations: {this.state.generation}</h2>    
                <br></br>
                <h3>Rules of the Game of Life <br></br>
                  1. Any live cell with two or three live neighbours survives.<br></br>
                  2. Any dead cell with three live neighbours becomes a live cell. <br></br>
                  3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                </h3>
            </div>
            
        );
            
    }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Container />, document.getElementById('root'));