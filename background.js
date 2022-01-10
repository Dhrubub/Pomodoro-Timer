let startingTime = 25;
let time = startingTime * 60;
let interval = null;
let isInitial = true;
let hasStarted = false;


let timerID;
let timerTime;

function setTime() {
    time = startingTime * 60;
}

function updateCountdown() {
    updateTimerDisplay();
    time--;
}

function updateTimerDisplay() {
    let minutes = Math.f
}

function startTime() {
    hasStarted = true;
    isInitial = false;

    interval = setInterval(updateCountdown, 1000);

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIMER') {
        timerTime = new Date(request.when);
        timerID = setTimeout(() => {
            // alert user;
        }, timerTime.getTime() - Date.now());
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({time: timerTime})
    }
})