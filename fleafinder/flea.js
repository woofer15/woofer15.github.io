init();

let xCord = Math.floor((Math.random() * 10));
let yCord = Math.floor((Math.random() * 10));
let buttonX;
let buttonY;

function init() {
    for (let i = 0; i < 10; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        rowDiv.id = 'row' + i;
    
        for (let j = 0; j < 10; j++) {
            let buttonElem = document.createElement('button');
            buttonElem.onclick = function() { 
                find(j, i);
            };
            buttonElem.id = j + "." + i
        
            rowDiv.appendChild(buttonElem);
        };
        document.body.appendChild(rowDiv);
    };
};

let tries = 0;

function find(x, y) {
    tries++;
    let myTries = document.getElementById("tries");

    let myButton = document.getElementById(x + '.' + y);
    myButton.style.backgroundColor = 'red';

    myTries.innerText = tries;
    if (x === xCord) {
        if (y === yCord) {
            alert("You found the flea in " + tries + " tries");
            myButton.style.backgroundColor = 'green';
        };
    };
};