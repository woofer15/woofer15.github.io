const NUM_QUESTIONS_PER_SESSION = 10

let allPossibleQuestions = []
let currentQuestions = []
let currentQuestionNum = 0
let currentQuestionStartTime

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

    // console.log(currentQuestions)

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

    // get all the questions that have not been tried even once
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if (questionFromStorage.attempts[0].hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
    })
    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }    

    // get all the questions that have not been tried twice
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if (questionFromStorage.attempts[1].hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
    })
    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }    

    // get all the questions that have not been tried three times
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if (questionFromStorage.attempts[2].hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
    })
    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }    

    // get all the questions that have been tried 3 times
    // but the last attempt was an incorrect answer
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if ((questionFromStorage.attempts[0].hasBeenAttempted) && 
            (questionFromStorage.attempts[1].hasBeenAttempted) &&
            (questionFromStorage.attempts[2].hasBeenAttempted) && 
            (questionFromStorage.attempts[2].isAnsweredCorrectly === false)) {
            unansweredQuestions.push(key)
        }
    })
    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }    

    // get all the questions that have been attempted 3 times
    // and 3rd attempt was correct
    // then sort them by time taken
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
        if (a.attempts[2].timeTaken > b.attempts[2].timeTaken) {
            return -1
        }
        return 1
    })
    unansweredQuestions = unansweredQuestions.concat(sortMe)

    return unansweredQuestions
    // if (allPossibleQuestions.length < NUM_QUESTIONS_PER_SESSION) {
    //     for (let i = 1; i < 13; i++) {
    //         for (let j = 1; j < 13; j++) {
    //             if (allPossibleQuestions.length < NUM_QUESTIONS_PER_SESSION) {
    //                 sort(i, j)
    //             }
    //         }
    //     }
    //     sort_2()

    //     for (let index = 0; index < 10; index++) {
    //         allPossibleQuestions.push(tenQuestions[index])
    //     };
    // }

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

    if (currentQuestionNum < 10) {
        displayQuestion()
    }
    else {
        document.getElementById('startButton').style.display = 'block'
        document.getElementById('questionAndAnswerContainer').style.display = 'none'
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
                elem.appendChild(createAttemptElem(j, attempt))
            }
        
            column.appendChild(elem)
        }
    }
}

function createAttemptElem(index, attempt) {

    let elem = document.createElement('span')
    //elem.innerText = attempt.timeTaken
    elem.style.display = 'inline-block'
    elem.classList.add('multiplier')
    if (attempt.hasBeenAttempted  === false) {
        elem.classList.add('multiplierStatusBlank')
    }
    else {
        if (attempt.isAnsweredCorrectly === true) {
            if (parseInt(attempt.timeTaken) > 2) {
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
            let questionFromStorage = readStorage(i, j)
            for (let k = 0; k < 2; k++) {
                questionFromStorage.attempts[k].hasBeenAttempted = true
                questionFromStorage.attempts[k].isAnsweredCorrectly = true
                questionFromStorage.attempts[k].timeTaken = 1.0
            }
            writeStorage(createKey(i, j), questionFromStorage)
        }
    }
}

//---------
function shiftEntryAttempt(entry) {
    entry.firstTry.hasBeenAttempted = entry.secondTry.hasBeenAttempted
    entry.firstTry.isAnsweredCorrectly = entry.secondTry.isAnsweredCorrectly
    entry.firstTry.timeTaken = entry.secondTry.timeTaken

    entry.secondTry.hasBeenAttempted = entry.thirdTry.hasBeenAttempted
    entry.secondTry.isAnsweredCorrectly = entry.thirdTry.isAnsweredCorrectly
    entry.secondTry.timeTaken = entry.thirdTry.timeTaken
 
    return
}

let numArray = []
let tenQuestions = []

function sort(first, second) {
    let key = first + 'x' + second;
    let storage = JSON.parse(localStorage.getItem(key))
    let average = storage.firstTry.timeTaken + storage.secondTry.timeTaken + storage.thirdTry.timeTaken / 3
    numArray.push(average)

    numArray.sort(function(a, b) {
        return b - a;
    });
};

function sort_2() {
    let key = first + 'x' + second;
    let storage = JSON.parse(localStorage.getItem(key))
    let average = storage.firstTry.timeTaken + storage.secondTry.timeTaken + storage.thirdTry.timeTaken / 3

    for (let i = 1; i < 13; x++) {
        for (let j = 1; j < 13; y++) {
            if (numArray[0] === average || numArray[1] === average || numArray[2] === average || numArray[3] === average || numArray[4] === average || numArray[5] === average || numArray[6] === average || numArray[7] === average || numArray[8] === average || numArray[9] === average) {
                tenQuestions.push(key)
            }
        }
    }
};
