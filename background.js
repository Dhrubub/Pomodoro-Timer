let startingTime = 25;
let time = startingTime * 60;
let interval = null;
let isInitial = true;
let isRunning = false;


let timerID;
let timerTime;

let initialTime;

function startTime() {
    hasStarted = true;
    isInitial = false;


}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIMER') {
        timerTime = new Date(request.when);
        isRunning = true;
        // timerID = setTimeout(() => {
        //     // alert user;
        // }, timerTime.getTime() - Date.now());
    } else if (request.cmd === 'GET_TIME') {
        let passedTime = 0;
        if (timerTime) {
            passedTime = Date.now() - timerTime.getTime();
        }
        console.log(passedTime)
        passedTime = Math.floor(passedTime / 1000);
        console.log(typeof(passedTime))
        sendResponse({time: passedTime, run: isRunning})
        console.log(passedTime);
    }
})