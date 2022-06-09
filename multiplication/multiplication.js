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
    firstTry: attempt,
    secondTry: attempt,
    thirdTry: attempt
}

init()

function init() {
    document.getElementById('answer').addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            submit()
        }
    })

    // fill the allPossibleQuestions array
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            // verify it exists in storage
            let questionFromStorage = readStorage(i, j)
            if (questionFromStorage != null) {
                allPossibleQuestions.push(createKey(i, j))
            }
        }
    }
}

function start() {
    clearResultsContainer()

    currentQuestions = []
    currentQuestionNum = 0
    
    // get all the questions that should be attempted in this next session
    let unansweredQuestions = findQuestions()

    // pick NUM_QUESTIONS_PER_SESSION random questions for this session
    let questionIndex = []
    let index
    while (questionIndex.length < NUM_QUESTIONS_PER_SESSION) {
        index = getRandomIntBetween(0, unansweredQuestions.length - 1)
        // make sure we do not add duplicate random numbers
        if (questionIndex.indexOf(index) === -1) {
            questionIndex.push(index)
        }
    }
    for (let x = 0; x < questionIndex.length; x++) {
        currentQuestions.push(unansweredQuestions[questionIndex[x]])
    }

    console.log(currentQuestions)

    displayQuestion()

    // unhide the question/answer container
    document.getElementById('questionAndAnswerContainer').style.display = 'block'     
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
        if (questionFromStorage.firstTry.hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
    })
    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }    

    // get all the questions that have not been tried twice
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if (questionFromStorage.secondTry.hasBeenAttempted === false) {
            unansweredQuestions.push(key)
        }
    })
    if (unansweredQuestions.length > NUM_QUESTIONS_PER_SESSION) {
        return unansweredQuestions
    }    

    // get all the questions that have not been tried three times
    allPossibleQuestions.forEach(key => {
        let questionFromStorage = readStorage(key)
        if (questionFromStorage.thirdTry.hasBeenAttempted === false) {
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
        if ((questionFromStorage.firstTry.hasBeenAttempted) && 
            (questionFromStorage.secondTry.hasBeenAttempted) &&
            (questionFromStorage.thirdTry.hasBeenAttempted) && 
            (questionFromStorage.thirdTry.isAnsweredCorrectly === false)) {
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
        if ((questionFromStorage.firstTry.hasBeenAttempted) && 
            (questionFromStorage.secondTry.hasBeenAttempted) &&
            (questionFromStorage.thirdTry.hasBeenAttempted) && 
            (questionFromStorage.thirdTry.isAnsweredCorrectly)) {
            sortMe.push(key)
        }
    })


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

function getRandomIntBetween(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function submit() {
    
    let timeTaken = (Date.now() - currentQuestionStartTime) / 1000

    let question = currentQuestions[currentQuestionNum]
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
    storage.firstTry.hasBeenAttempted = storage.secondTry.hasBeenAttempted
    storage.firstTry.isAnsweredCorrectly = storage.secondTry.isAnsweredCorrectly
    storage.firstTry.timeTaken = storage.secondTry.timeTaken

    storage.secondTry.hasBeenAttempted = storage.thirdTry.hasBeenAttempted
    storage.secondTry.isAnsweredCorrectly = storage.thirdTry.isAnsweredCorrectly
    storage.secondTry.timeTaken = storage.thirdTry.timeTaken
 
    return
}

function updateStorage(storage, time, correct) {
    if (storage.firstTry.hasBeenAttempted === false) {
        storage.firstTry.hasBeenAttempted = true
        storage.firstTry.isAnsweredCorrectly = correct
        storage.firstTry.timeTaken = time
    } else if (storage.secondTry.hasBeenAttempted === false) {
        storage.secondTry.hasBeenAttempted = true
        storage.secondTry.isAnsweredCorrectly = correct
        storage.secondTry.timeTaken = time
    } else if (storage.thirdTry.hasBeenAttempted === false) {
        storage.thirdTry.hasBeenAttempted = true
        storage.thirdTry.isAnsweredCorrectly = correct
        storage.thirdTry.timeTaken = time
    } else {
        shiftStorage(storage)
        storage.thirdTry.hasBeenAttempted = true
        storage.thirdTry.isAnsweredCorrectly = correct
        storage.thirdTry.timeTaken = time
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

            let storageEntry = readStorage(createKey(i, j))
            let attempts = getAttempts(storageEntry)
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
                console.log(attempt.timeTaken + " vs " +parseInt(attempt.timeTaken))
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

function getAttempts(storageEntry) {
    let attempt1 = {hasBeenAttempted: storageEntry.firstTry.hasBeenAttempted, isAnsweredCorrectly: storageEntry.firstTry.isAnsweredCorrectly, timeTaken: storageEntry.firstTry.timeTaken }
    let attempt2 = {hasBeenAttempted: storageEntry.secondTry.hasBeenAttempted, isAnsweredCorrectly: storageEntry.secondTry.isAnsweredCorrectly, timeTaken: storageEntry.secondTry.timeTaken }
    let attempt3 = {hasBeenAttempted: storageEntry.thirdTry.hasBeenAttempted, isAnsweredCorrectly: storageEntry.thirdTry.isAnsweredCorrectly, timeTaken: storageEntry.thirdTry.timeTaken }

    let attempts = []
    attempts.push(attempt1)
    attempts.push(attempt2)
    attempts.push(attempt3)

    return attempts
}