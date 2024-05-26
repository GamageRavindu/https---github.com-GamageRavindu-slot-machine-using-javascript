// 1.deposit some money
// 2.determine number of lines to bet on
// 3.collect a bet amount
// 4.spin the slot machine
// 5.check if the use won
// 6.give user their winnings
// 7.play again      

// function structure ---------------------------------
// function deposit() {
//   //content
//   return 1
// }

//random number generating
// for(let i = 0; i < 10; i++) {
//     console.log(Math.ceil(Math.random() * 3));
// }

// const x = deposit()

// -----------------------------------------------------

// getting user input using that we installed called "prompt sync"

const prompt = require("prompt-sync")();  //importing the function and this () gives access to a function

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

//getting deposit amount for bet
const deposit = () => {
    while(true) {
        const depositAmount = prompt("Enter a deposit amount: "); //default the input return as a string
        const numberDepositAmount = parseFloat(depositAmount);  //convert the input string to a floating point number using parsefloat functtion

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

//getting getting number of lines to bet
const getNumberOfLines = () => {   
    while(true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again");
        } else {
            return numberOfLines;
        }
    }
};

//getting bet amount per line
const getBet = (balance, lines) => {
    while(true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines ) {
            console.log("Invalid Bet, try again.");
        } else {
            return numberBet;
        }
    }
};

const spin = () => { 
    const symbols = [];   
    for (const [symbol,count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
        for (let i = 0; i < COLS; i++) {
            reels.push([]);
            const reelSymbols = [...symbols];
            for (let j = 0; j < ROWS; j++) {
                const randomIndex = Math.floor(Math.random() * reelSymbols.length);  //generate random number for the length of the array
                const selectedSymbol = reelSymbols[randomIndex];
                reels[i].push(selectedSymbol);  //apppend selected symbol to reels array
                reelSymbols.splice(randomIndex, 1);   //remove the selected symbol from reelSymbol
            }     
        }
    return reels;
};
 
//transpose the array(matrix) for ease of use 
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

//print slot machine
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length -  1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
 };

 const getWinnings = (rows, bet, lines) => {
    let winnigns = 0;
    //lines = 1 then loop 1 lines = 2 then loop twice(1,2) lines = 3 loop 3(1,2,3)
    for (let i_row = 0; i_row < lines; i_row++) {
        const symbols = rows[i_row];
        let allSame = true;

        //check whether all the symbols are same in this row
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnigns += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnigns;
 };

const game = () => {
    let balance = deposit();  //always place function call below the function declared

    while(true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        // console.log(reels); //to check whether the transpose works
        // console.log(rows); //to check whether the transpose works
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You Won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?");

        if (playAgain != "y") break;
    }
    
};

game();