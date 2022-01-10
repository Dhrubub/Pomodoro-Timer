let mode = {
    time: 25,
    dark: "#d95550",
    light: "#dd6662",
}

let time = mode.time * 60;
let prevTime = time;

let isRunning = false;

let timerTime;

let passedTime = 0;

function resetTimer() {
    time = mode.time * 60;
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

        sendResponse({time: time, run: isRunning, mode: mode})
    }

    else if (request.cmd === 'CHANGE_MODE') {
        mode = request.mode;
        resetTimer();
    }

})

setInterval(()=>{console.log("")}, 1000);