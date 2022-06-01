let possibleQuestions = []
let myQuestions = []
let entry = {
    firstTry : [
        false, //question done
        false, //question correct
        0 //number of milliseconds
    ],
    secondTry : [
        false, //question done
        false, //question correct
        0 //number of milliseconds
    ],
    thirdTry : [
        false, //question done
        false, //question correct
        0 //number of milliseconds
    ]
}

function clearStorage() {
    localStorage.clear();
    console.log('clear');
};

function start() {
    
    // will create default entry in storage for all items that are not found
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            createStorage(i, j)
        }
    }

    // fill possibleQuestions array
    findQuestions()

    // get 10 random possibleQuestions and put into myQuestions
    let questionIndex = []
    let index
    while (questionIndex.length < 10) {
        index = getRandomIntBetween(0, possibleQuestions.length - 1)
        if (questionIndex.indexOf(index) === -1) {
            questionIndex.push(index)
        }
    }
    for (let x = 0; x < 10; x++) {
        myQuestions.push(possibleQuestions[questionIndex[x]]);
    }

    console.log(myQuestions);

    displayQuestion(0)
    document.getElementById('questionAndAnswerContainer').style.display = 'block'
}

function displayQuestion(index) {
    document.getElementById('question').innerText = myQuestions[index] + " = "
}

function createKey(first, second) {
    return first + 'x' +second
}

function createStorage(first, second) {
    let key = createKey(first, second)
 
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(entry))
    }
}

function readStorage(first, second) {
    let questionResultFromStorage = localStorage.getItem(createKey(first, second))
    if (questionResultFromStorage === undefined) {
        return undefined
    }
    else {
        return JSON.parse(questionResultFromStorage)
    }
}

function findQuestions() {
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            let questionFromStorage = readStorage(i, j)
            if (questionFromStorage.firstTry[0] === false) {
                possibleQuestions.push(createKey(i, j))
            }
        }
    }

    if (possibleQuestions.length < 10) {
        for (let i = 1; i < 13; i++) {
            for (let j = 1; j < 13; j++) {
                let questionFromStorage = readStorage(i, j)
                if (questionFromStorage.secondTry[0] === false) {
                    possibleQuestions.push(createKey(i, j))
                }
            }
        }
    }

    if (possibleQuestions.length < 10) {
        for (let i = 1; i < 13; i++) {
            for (let j = 1; j < 13; j++) {
                let questionFromStorage = readStorage(i, j)
                if (questionFromStorage.thirdTry[0] === false) {
                    possibleQuestions.push(createKey(i, j))
                }
            }
        }
    }

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (possibleQuestions.length < 10) {
                sort(i, j)
            }
        }
    }
}

function sort(first, second) {
    let key = first + 'x' + second;
    let average = JSON.parse(localStorage.getItem(key)).firstTry[2] + JSON.parse(localStorage.getItem(key)).secondTry[2] + JSON.parse(localStorage.getItem(key)).thirdTry[2] / 3
};

function getRandomIntBetween(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}