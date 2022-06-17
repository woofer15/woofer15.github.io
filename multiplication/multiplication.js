const NUM_QUESTIONS_PER_SESSION = 10

let allPossibleQuestions = []
let currentQuestions = []
let currentQuestionNum = 0
let currentQuestionStartTime

const LEVEL_EASY = 10
const LEVEL_MED = 7
const LEVEL_HARD = 3

let currentLevel = LEVEL_EASY

let attempt = {
    hasBeenAttempted: false,
    isAnsweredCorrectly: false,
    timeTaken: 0
}

let entry = {
    attempts: [attempt, attempt, attempt],
}

init()

function init() {

    document.getElementById('answer').addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            handleSubmitAnswerButtonClick()
        }
    })

    // fill the allPossibleQuestions array
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            // this will also create a default blank entry in local storage
            // if one did not already exist
            let questionFromStorage = readStorage(i, j)
            if (questionFromStorage != null) {
                allPossibleQuestions.push(createKey(i, j))
            }
        }
    }
}

function handleStartButtonClick() {
    clearResultsContainer()

    currentQuestions = []
    currentQuestionNum = 0
    
    // get all the possible questions that should be attempted in this next session
    let possibleQuestionsToAsk = findQuestions()

    // pick NUM_QUESTIONS_PER_SESSION random questions for this session
    let randomQuestionIndex = []
    while (randomQuestionIndex.length < NUM_QUESTIONS_PER_SESSION) {
        let index = getRandomIntBetween(0, possibleQuestionsToAsk.length - 1)
        // make sure we do not add duplicate random numbers
        if (randomQuestionIndex.indexOf(index) === -1) {
            randomQuestionIndex.push(index)
        }
    }
    for (let i = 0; i < randomQuestionIndex.length; i++) {
        currentQuestions.push(possibleQuestionsToAsk[randomQuestionIndex[i]])
    }

    displayQuestion()

    // unhide the question/answer container
    document.getElementById('questionAndAnswerContainer').style.display = 'block'

    // hide the Start button until all questions are answered
    document.getElementById('startButton').style.display = 'none'
}

function displayQuestion() {
    document.getElementById('question').innerText = currentQuestions[currentQuestionNum] + " = "
    document.getElementById('answer').value = ''
    currentQuestionStartTime = Date.now()
}

function createKey(first, second) {
    return first + 'x' +second
}

function readStorage(key) {    
    let questionResultFromStorage = localStorage.getItem(key)
    if (questionResultFromStorage === null) {
        // if it did not exist, create it
        writeStorage(key, entry)
        questionResultFromStorage = localStorage.getItem(key)
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

    let unansweredQuestions = []

    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)

        // get all the questions that have not been tried 1 time
        if (questionFromStorage.attempts[0].hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
        // get all the questions that have not been tried 2 times
        else if (questionFromStorage.attempts[1].hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
        // get all the questions that have not been tried 3 times
        else if (questionFromStorage.attempts[2].hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
        // get all the questions that have not answered correctly 3 times
        else if (
            (questionFromStorage.attempts[0].isAnsweredCorrectly === false) ||
            (questionFromStorage.attempts[1].isAnsweredCorrectly === false) ||
            (questionFromStorage.attempts[2].isAnsweredCorrectly === false)) {
            unansweredQuestions.push(key)
        }
        // get all the questions that were last answered in more time than LEVEL time
        else if (questionFromStorage.attempts[2].timeTaken > currentLevel) {
            unansweredQuestions.push(key)
        }
    })

    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }

    // if we are still in need of questions,
    // get the questions that took longest to answer
    let sortMe = []
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if ((questionFromStorage.attempts[0].hasBeenAttempted) && 
            (questionFromStorage.attempts[1].hasBeenAttempted) &&
            (questionFromStorage.attempts[2].hasBeenAttempted) && 
            (questionFromStorage.attempts[2].isAnsweredCorrectly)) {
            sortMe.push(key)
        }
    })
    sortMe.sort(function(a, b) {
        let questionFromStorageA = readStorage(a)
        let questionFromStorageB = readStorage(b)

        let avgTimeA = (questionFromStorageA.attempts[0].timeTaken + questionFromStorageA.attempts[1].timeTaken + questionFromStorageA.attempts[2].timeTaken) / 3
        let avgTimeB = (questionFromStorageB.attempts[0].timeTaken + questionFromStorageB.attempts[1].timeTaken + questionFromStorageB.attempts[2].timeTaken) / 3
        if (avgTimeA > avgTimeB) {
            return -1
        }
        return 1
    })
    unansweredQuestions = unansweredQuestions.concat(sortMe.slice(0, NUM_QUESTIONS_PER_SESSION))

    return unansweredQuestions
}

function getRandomIntBetween(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function handleSubmitAnswerButtonClick() {
    
    let timeTaken = (Date.now() - currentQuestionStartTime) / 1000

    let question = currentQuestions[currentQuestionNum]
    let userAnswer = parseInt(document.getElementById('answer').value)
    let correctAnswer = parseInt(question.split('x')[0]) * parseInt(question.split('x')[1])
    let isCorrect = (userAnswer === correctAnswer)
    updateResultsContainer(question + " = " +userAnswer, correctAnswer, isCorrect)

    let storage = JSON.parse(localStorage.getItem(question))
    storage = updateStorageEntry(storage, timeTaken, isCorrect)
    writeStorage(question, storage)
    
    currentQuestionNum++

    if (currentQuestionNum < NUM_QUESTIONS_PER_SESSION) {
        displayQuestion()
    }
    else {
        document.getElementById('startButton').style.display = 'block'
        document.getElementById('questionAndAnswerContainer').style.display = 'none'
        document.getElementById('resultsContainer').style.display = 'block'
    }
}

function updateStorageEntry(entry, time, correct) {
    if (entry.attempts[0].hasBeenAttempted === false) {
        entry.attempts[0].hasBeenAttempted = true
        entry.attempts[0].isAnsweredCorrectly = correct
        entry.attempts[0].timeTaken = time
    }
    else if (entry.attempts[1].hasBeenAttempted === false) {
        entry.attempts[1].hasBeenAttempted = true
        entry.attempts[1].isAnsweredCorrectly = correct
        entry.attempts[2].timeTaken = time
    } else if (entry.attempts[2].hasBeenAttempted === false) {
        entry.attempts[2].hasBeenAttempted = true
        entry.attempts[2].isAnsweredCorrectly = correct
        entry.attempts[2].timeTaken = time
    } else {
        let thirdAttempt = attempt
        thirdAttempt.hasBeenAttempted = true
        thirdAttempt.isAnsweredCorrectly = correct
        thirdAttempt.timeTaken = time
        entry.attempts.shift() // remove attempt 1 and shift attempt 2 and 3 up 1 position
        entry.attempts.push(thirdAttempt) // add a new third attempt
    }    

    return entry
}

function clearResultsContainer() {
    document.getElementById('resultsContainer').style.display = 'none'

    let resultsContainer = document.getElementById('resultsContainer')
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

    document.getElementById('resultsContainer').appendChild(resultRow)
}
 
function handleShowHideProgressButtonClick() {
    let button = document.getElementById('progressButton')
    let showProgress = (button.innerText === 'Show Progress')
    showProgress === true ? button.innerText = 'Hide Progress' : button.innerText = 'Show Progress'

    if (showProgress === true) {
        refreshProgress()
        document.getElementById('userStats').style.display = 'block'
    } 
    else {
        document.getElementById('userStats').style.display = 'none'
    }
}

function handleRefreshButtonClick() {
    refreshProgress()
}

function handleClearProgressButtonClick() {
    clearStorage()
    refreshProgress()
}

function refreshProgress() {
    for (let i = 1; i < 13; i++) {

        let column = document.getElementById('userStats-' +i)
        column.innerText = i

        for (let j = 1; j < 13; j++) {  

            let storageEntry = readStorage(createKey(i, j))
            let attempts = storageEntry.attempts
            let elem = document.createElement('div')

            for (const attempt of attempts) {
                elem.appendChild(createProgressRow(j, attempt))
            }
        
            column.appendChild(elem)
        }
    }
}

function createProgressRow(index, attempt) {

    let elem = document.createElement('span')
    //elem.innerText = attempt.timeTaken
    elem.style.display = 'inline-block'
    elem.classList.add('multiplier')
    if (attempt.hasBeenAttempted  === false) {
        elem.classList.add('multiplierStatusBlank')
    }
    else {
        if (attempt.isAnsweredCorrectly === true) {
            if (parseInt(attempt.timeTaken) > currentLevel) {
                 elem.classList.add('multiplierStatusCorrectButSlow')
            }
            else {
                elem.classList.add('multiplierStatusCorrect')
            }
        }
        else {
            elem.classList.add('multiplierStatusIncorrect')
        }
    }

    return elem
}

function handleFillRandomProgressButtonClick() {
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {

            if ((getRandomIntBetween(0, 100) % 2) === 0) {
            }

            let questionFromStorage = readStorage(i, j)
            for (let k = 0; k < 3; k++) {
                let hasBeenAttempted = ((getRandomIntBetween(0, 100) % 2) === 0) ? true : false
                
                if ((k > 0) && (questionFromStorage.attempts[k-1].hasBeenAttempted === false)) {
                    break
                }

                questionFromStorage.attempts[k].hasBeenAttempted = hasBeenAttempted

                if (hasBeenAttempted) {
                    let isCorrect = ((getRandomIntBetween(0, 100) % 2) === 0) ? true : false
                    questionFromStorage.attempts[k].isAnsweredCorrectly = ((getRandomIntBetween(0, 100) % 2) === 0) ? true : false

                    if (isCorrect) {
                        questionFromStorage.attempts[k].timeTaken = getRandomIntBetween(0, currentLevel + 3)
                    }
                }                
            }

            writeStorage(createKey(i, j), questionFromStorage)

        }
    }
}
