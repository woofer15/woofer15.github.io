const NUM_QUESTIONS_PER_SESSION = 10
let possibleQuestions = []
let myQuestions = []
let currentQuestionNum = 0
let currentQuestionStartTime

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

init()

function init() {
    document.getElementById('answer').addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            submit()
        }
    })
}

function start() {
    clearResultsContainer()

    possibleQuestions = []
    myQuestions = []
    currentQuestionNum = 0
    
    // fill the possibleQuestions array
    findQuestions()

    // get NUM_QUESTIONS_PER_SESSION random possibleQuestions and put into myQuestions
    let questionIndex = []
    let index
    while (questionIndex.length < NUM_QUESTIONS_PER_SESSION) {
        index = getRandomIntBetween(0, possibleQuestions.length - 1)
        // make sure we do not add duplicate random numbers
        if (questionIndex.indexOf(index) === -1) {
            questionIndex.push(index)
        }
    }
    for (let x = 0; x < questionIndex.length; x++) {
        myQuestions.push(possibleQuestions[questionIndex[x]])
    }

    console.log(myQuestions)

    displayQuestion()

    // unhide the question/answer container
    document.getElementById('questionAndAnswerContainer').style.display = 'block'     
}

function displayQuestion() {
    document.getElementById('question').innerText = myQuestions[currentQuestionNum] + " = "
    document.getElementById('answer').value = ''
    currentQuestionStartTime = Date.now()
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
    if (questionResultFromStorage === null) {
        createStorage(first, second)
        questionResultFromStorage = localStorage.getItem(createKey(first, second))
    }
  
    return JSON.parse(questionResultFromStorage)
}

function writeStorage(key, entry) {
    localStorage.setItem(key, JSON.stringify(entry))
}

function clearStorage() {
    localStorage.clear()
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

    if (possibleQuestions.length < NUM_QUESTIONS_PER_SESSION) {
        for (let i = 1; i < 13; i++) {
            for (let j = 1; j < 13; j++) {
                let questionFromStorage = readStorage(i, j)
                if (questionFromStorage.secondTry[0] === false) {
                    possibleQuestions.push(createKey(i, j))
                }
            }
        }
    }

    if (possibleQuestions.length < NUM_QUESTIONS_PER_SESSION) {
        for (let i = 1; i < 13; i++) {
            for (let j = 1; j < 13; j++) {
                let questionFromStorage = readStorage(i, j)
                if (questionFromStorage.thirdTry[0] === false) {
                    possibleQuestions.push(createKey(i, j))
                }
            }
        }
    }

    if (possibleQuestions.length < NUM_QUESTIONS_PER_SESSION) {
        for (let i = 1; i < 13; i++) {
            for (let j = 1; j < 13; j++) {
                if (possibleQuestions.length < NUM_QUESTIONS_PER_SESSION) {
                    sort(i, j)
                }
            }
        }
        sort_2()

        for (let index = 0; index < 10; index++) {
            possibleQuestions.push(tenQuestions[index])
        };
    }
}

let numArray = []
let tenQuestions = []

function sort(first, second) {
    let key = first + 'x' + second;
    let storage = JSON.parse(localStorage.getItem(key))
    let average = storage.firstTry[0] + storage.secondTry[0] + storage.thirdTry[0] / 3
    numArray.push(average)

    numArray.sort(function(a, b) {
        return b - a;
    });
};

function sort_2() {
    let key = first + 'x' + second;
    let storage = JSON.parse(localStorage.getItem(key))
    let average = storage.firstTry[0] + storage.secondTry[0] + storage.thirdTry[0] / 3

    for (let i = 1; i < 13; x++) {
        for (let j = 1; j < 13; y++) {
            if (numArray[0] === average || numArray[1] === average || numArray[2] === average || numArray[3] === average || numArray[4] === average || numArray[5] === average || numArray[6] === average || numArray[7] === average || numArray[8] === average || numArray[9] === average) {
                tenQuestions.push(key)
            }
        }
    }
};

function getRandomIntBetween(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function submit() {
    
    let timeTaken = (Date.now() - currentQuestionStartTime) / 1000
    console.log('time taken = ' + timeTaken)

    let question = myQuestions[currentQuestionNum]
    let userAnswer = parseInt(document.getElementById('answer').value)
    let correctAnswer = parseInt(question.split('x')[0]) * parseInt(question.split('x')[1])
    let isCorrect = (userAnswer === correctAnswer)
    updateResultsContainer(question + " = " +userAnswer, correctAnswer, isCorrect)

    let storage  = JSON.parse(localStorage.getItem(question))
    storage = updateStorage(storage, timeTaken, isCorrect)
    writeStorage(question, storage)
    
    currentQuestionNum++

    if (currentQuestionNum < 10) {
        displayQuestion()
    }
    else {
        document.getElementById('questionAndAnswerContainer').style.display = 'none'
    }
}

function shiftStorage(storage) {
    storage.firstTry[0] = storage.secondTry[0]
    storage.firstTry[1] = storage.secondTry[1]
    storage.firstTry[2] = storage.secondTry[2]

    storage.secondTry[0] = storage.thirdTry[0]
    storage.secondTry[1] = storage.thirdTry[1]
    storage.secondTry[2] = storage.thirdTry[2]
 
    return
}

function updateStorage(storage, time, correct) {
    if (storage.firstTry[0] === false) {
        storage.firstTry[0] = true
        storage.firstTry[1] = correct
        storage.firstTry[2] = time
    } else if (storage.secondTry[0] === false) {
        storage.secondTry[0] = true
        storage.secondTry[1] = correct
        storage.secondTry[2] = time
    } else if (storage.thirdTry[0] === false) {
        storage.thirdTry[0] = true
        storage.thirdTry[1] = correct
        storage.thirdTry[2] = time
    } else {
        shiftStorage(storage)
        storage.thirdTry[0] = true
        storage.thirdTry[1] = correct
        storage.thirdTry[2] = time
    }    

    return storage
}

function clearResultsContainer() {
    let resultsContainer = document.getElementById('results')
    while(resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild)
    }
}

function updateResultsContainer(userQuestionAndAnswer, correctAnswer, isCorrect) {
    let resultRow = document.createElement('div')
    if (isCorrect) {
        resultRow.innerText = userQuestionAndAnswer
        resultRow.classList.add('correctResult')
    }
    else {
        resultRow.innerText = userQuestionAndAnswer + ' => ' +correctAnswer
        resultRow.classList.add('incorrectResult')
    }

    document.getElementById('results').appendChild(resultRow)
}
 
function displayStats() {
    for (let i = 1; i < 13; i++) {

        let column = document.getElementById('userStats-' +i)
        column.innerText = i

        for (let j = 1; j < 13; j++) {  

            let result = readStorage(i, j)

            let elem = document.createElement('div')
            elem.appendChild(createStatusElem(j, result.firstTry[0], result.firstTry[1], result.firstTry[2]))
            elem.appendChild(createStatusElem(j, result.secondTry[0], result.secondTry[1], result.secondTry[2]))
            elem.appendChild(createStatusElem(j, result.thirdTry[0], result.thirdTry[1], result.thirdTry[2]))
        
            column.appendChild(elem)
        }
    }

}

function createStatusElem(index, questionDone, questionCorrect, timeTaken) {

    let elem = document.createElement('span')
    elem.innerText = index
    elem.style.display = 'inline-block'
    elem.classList.add('multiplier')
    if (questionDone  === false) {
        elem.classList.add('multiplierStatusBlank')
    }
    else {
        if (questionCorrect === true) {
            elem.classList.add('multiplierStatusCorrect')
        }
        else {
            elem.classList.add('multiplierStatusIncorrect')
        }
    }

    return elem
}