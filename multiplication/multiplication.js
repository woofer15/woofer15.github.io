let possibleQuestions = [];
let myQuestions = [];

function clearStorage() {
    localStorage.clear();
    console.log('clear');
};

function start() {
    possibleQuestions = []
    myQuestions = []
    
    let questionResultFromStorage
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            questionResultFromStorage = localStorage.getItem(i + 'x' + j)
            questionResultFromStorage = JSON.parse(questionResultFromStorage)
            createStorage(i, j);
        }
    }

    findQuestions(questionResultFromStorage);
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
}

function findQuestions(questionStorage, first, second) {
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (questionStorage.firstTry[0] === false) {
                possibleQuestions.push(i + 'x' + j)
            }
        }
    }

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (possibleQuestions.length < 10) {
                if (questionStorage.secondTry[0] === false) {
                    possibleQuestions.push(i + 'x' + j)
                }
            }
        }
    }

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (possibleQuestions.length < 10) {
                if (questionStorage.thirdTry[0] === false) {
                    possibleQuestions.push(i + 'x' + j)
                }
            }
        }
    }

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (possibleQuestions.length < 10) {
                if (questionStorage.firstTry[1] === false) {
                    possibleQuestions.push(i + 'x' + j)
                }
            }
        }
    }

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (possibleQuestions.length < 10) {
                if (questionStorage.secondTry[1] === false) {
                    possibleQuestions.push(i + 'x' + j)
                }
            }
        }
    }

    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            if (possibleQuestions.length < 10) {
                if (questionStorage.thirdTry[1] === false) {
                    possibleQuestions.push(i + 'x' + j)
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