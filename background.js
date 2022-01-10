let startingTime = 25;
let time = startingTime * 60;
let prevTime = time;

let isRunning = false;

let timerTime;

let passedTime = 0;

function resetTimer() {
    time = startingTime * 60;
    prevTime = time;
    isRunning = false;
    passedTime = 0;
}

function updateTime() {
    if (timerTime && isRunning) {
        passedTime = Date.now() - timerTime.getTime();
    }

    passedTime = Math.floor(passedTime / 1000);
    time = prevTime - passedTime;

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIMER') {
        timerTime = new Date(request.when);
        isRunning = true;
        // timerID = setTimeout(() => {
        //     // alert user;
        // }, timerTime.getTime() - Date.now());

    } else if (request.cmd === 'STOP_TIMER') {
        updateTime();

        isRunning = false;
        prevTime = time;

    } else if (request.cmd === 'RESET_TIMER') {
        resetTimer();

    } else if (request.cmd === 'GET_TIME') {
        updateTime();

        sendResponse({time: time, run: isRunning})
    }
})

setInterval(()=>{console.log("")}, 1000);