let possibleQuestions = [];
let myQuestions = [];

function clearStorage() {
    localStorage.clear();
}

function start() {
    possibleQuestions = []
    myQuestions = []

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            createStorage(i, j);
        }
    }
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
    };
    console.log(myQuestions);
}


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
};

function createStorage(first, second) {
    let key = first + 'x' + second
 
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(entry))
    }

    readStorage(first, second)
}

function readStorage(first, second) {
    let questionResultFromStorage = localStorage.getItem(first + 'x' + second)
    questionResultFromStorage = JSON.parse(questionResultFromStorage)
    //console.log(questionResultFromStorage);
    findQuestions(questionResultFromStorage, first, second)
}

function findQuestions(questionStorage, first, second) {
    if (questionStorage.firstTry[0] === false) {
        possibleQuestions.push(first + 'x' + second)
    }
}

function getRandomIntBetween(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}