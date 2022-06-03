let possibleQuestions = []
let myQuestions = []
let questionNum = 0
let startTime

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

function start() {
    clearResultsContainer()

    possibleQuestions = []
    myQuestions = []
    questionNum = 0
    
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
        myQuestions.push(possibleQuestions[questionIndex[x]])
    }

    console.log(myQuestions)

    displayQuestion()

    document.getElementById('answer').addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            submit()
        }
    })

    document.getElementById('questionAndAnswerContainer').style.display = 'block'     
}

function displayQuestion() {
    document.getElementById('question').innerText = myQuestions[questionNum] + " = "
    document.getElementById('answer').value = ''
    startTime = Date.now()
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
        createStorage(first, second)
        questionResultFromStorage = localStorage.getItem(createKey(first, second))
    }
  
    return JSON.parse(questionResultFromStorage)
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

function submit() {
    
    let timeTaken = (Date.now() - startTime) / 1000
    console.log('time taken = ' + timeTaken)

    let question = myQuestions[questionNum]
    let userAnswer = parseInt(document.getElementById('answer').value)
    let correctAnswer = parseInt(question.split('x')[0]) * parseInt(question.split('x')[1])
    let isCorrect = userAnswer === correctAnswer
    updateResultsContainer(question + " = " +userAnswer, correctAnswer, isCorrect)

    let storage  = JSON.parse(localStorage.getItem(question))
    
    if (isCorrect) {
        storage.firstTry[1] = true
        localStorage.setItem(question, JSON.stringify(storage));
    } else {
        storage.firstTry[1] = false;
        localStorage.setItem(question, JSON.stringify(storage));
    };
     
    questionNum++

    if (questionNum < 10) {
        displayQuestion()
    }
    else {
        document.getElementById('questionAndAnswerContainer').style.display = 'none'
    }
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