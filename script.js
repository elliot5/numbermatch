$(function() {
    const size = 4;
    var generatedGrid;

    var itemA = -1;
    var itemAIndex = -1;
    var itemB = -1;

    var moveCount = 0;

    var matchesFound = 0;

    var highscoreContent;

    $( "#high-scores" ).click(function() {
        highscoreContent.sort((a, b) => a-b);

        alert("Top 10 scores:\n\n" + highscoreContent.slice(highscoreContent.length - 10).toString().split(",").join("\n"));
    });

    $( ".clickable-random" ).click(function() {
        if($('#new-game').hasClass('disabled') == false) {
        let classID = $(this).attr("class").split(' ')[1];
        let index = parseInt(classID.substring(1, classID.length));
        let x = (index - 1) % size;
        let y = (index - x - 1) / size;
        let value = generatedGrid[y][x];

        if(itemAIndex == index) { return; } 
        if($( ".r" + index).hasClass( "solved" )) { return; } 

        $('.r' + index).html(value)
        if(itemA === -1) {
        itemA = value;
        itemAIndex = index;
        itemB = -1;
        }
        else if(itemB === -1) {
        itemB = value;

        if(itemA === itemB) { // Check if you get pair
            $( ".r" + index).addClass( "solved" );
            $( ".r" + itemAIndex).addClass( "solved" );
            if($('#popups').is(":checked")) {
                alert("Congratulations! You made a match! :) \nThis message can be disabled via unchecking 'Enable Popups'.");
            }

            matchesFound += 1;
            
        } else {
            clearGridTile(itemAIndex);
            clearGridTile(index);
            if($('#popups').is(":checked")) {
                alert("Oopsie! That's wrong. \nThis message can be disabled via unchecking 'Enable Popups'.");
            }
        }

        moveCount = moveCount + 1
        updateCounts();
        
        itemA = -1;
        itemB = -1;
        itemAIndex = -1;
        
        if(matchesFound >= (size * size) / 2) {
            alert("You won the game!");

            highscoreContent.push(moveCount);
 
            highscoreContent.sort((a, b) => a-b);
            try { fs.writeFileSync('highscores.txt', "[" + highscoreContent + "]", 'utf-8'); }
            catch(e) { alert('Failed to save the file !'); }
        }
        
        }
    }
    });

    function updateCounts() {
    $("#move-count").html("Total moves made: " + moveCount);
    $("#match-count").html("Total matches made: " +  matchesFound);
    }

    // generate 1 to 8
    function generateGrid() {
    var grid = []; //1d array
        let index = 0;
    let pairIndex = 0;
        for (var x = 0; x < size; x++) {
        grid[x] = []; // Initialize inner array
        for (var y = 0; y < size; y++) {
            grid[x][y] = pairIndex + 1;
        index = index + 1;
        if(index % 2 == 0) {
            pairIndex = pairIndex + 1;
        }
        }
    }
    
    for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                let newIndex = Math.floor(Math.random() * 16);
            let newX = (newIndex ) % size;
                        let newY = parseInt((newIndex - x) / size);

            let orginalValue = grid[y][x];
            let newValue = grid[newY][newX];
            
            grid[y][x] = newValue;
            grid[newY][newX] = orginalValue;
        }
    }

    return grid;
    }

    function displayGrid(grid) {
            let index = 0
        for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
            index = index + 1
                $('.r' + index).html(grid[x][y]);
            } 
        }
    }

    function clearGrid() {
        $('#new-game').removeClass("disabled");
            let index = 0
        for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
            index = index + 1
                clearGridTile(index);
            }
        }
    }

    function clearGridTile(index) {
        $('.r' + index).html(' ');
    $( ".r" + index).removeClass( "solved" );
    }

    $( "#new-game" ).click(function() {
        if($('#new-game').hasClass('disabled') == false) { 
        moveCount = 0;
        itemA = -1;
        itemB = -1;
        itemAIndex = -1;
        matchesFound = 0;
        generatedGrid = undefined;
        updateCounts();
    
        generatedGrid = generateGrid()
        clearGrid()
        displayGrid(generatedGrid)
        setTimeout(clearGrid, 3000)
        $('#new-game').addClass("disabled");
    }
    });

    var fs = require('fs');
    highscoreContent = JSON.parse(fs.readFileSync('highscores.txt')); // eval is dangerous

    highscoreContent.sort((a, b) => a-b);
});