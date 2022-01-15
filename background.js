let mode = {
    time: 25,
    dark: "#d95550",
    light: "#dd6662",
};

let time = mode.time * 60;
let prevTime = time;

let isRunning = false;

let timerTime;
let timerFinish;
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
    if (request.cmd === "START_TIMER") {
        mode = request.mode;
        timerTime = new Date(request.when);
        isRunning = true;

        timerFinish = setTimeout(() => {
            resetTimer();
            chrome.notifications.create({
                title: "Pomodoro",
                iconUrl: "/images/tomato128.png",
                message: "Timer is done",
                type: "basic",
            });
        }, prevTime * 1000);
    } else if (request.cmd === "STOP_TIMER") {
        updateTime();

        isRunning = false;
        prevTime = time;
        clearTimeout(timerFinish);
    } else if (request.cmd === "RESET_TIMER") {
        resetTimer();
        clearTimeout(timerFinish);
    } else if (request.cmd === "GET_TIME") {
        updateTime();

        sendResponse({ time: time, run: isRunning, mode: mode });
    } else if (request.cmd === "CHANGE_MODE") {
        mode = request.mode;
        resetTimer();
    }
});
