const countdownEl = document.getElementById('countdown');
const startEl = document.getElementById('startButton');
const resetEl = document.getElementById('resetButton');
const pomodoroEl = document.getElementById('pomodoroButton');
const shortBreakEl = document.getElementById('shortBreakButton');
const longBreakEl = document.getElementById('longBreakButton');

let mode = {
    time: 25,
    dark: "#d95550",
    light: "#dd6662",
}
let time = mode.time * 60;
let interval = null;
let isInitial = true;



chrome.runtime.sendMessage({cmd: 'GET_TIME'}, (response) => {
    if (response.time) {
        time = response.time;
        updateTimerDisplay();
        changeColor(response.mode);
        if (response.run) {
            startTimer();
        }
        console.log(time);
    }
})

function setTime() {
    time = mode.time * 60;
}

function startTimer() {
    startEl.innerHTML = 'Stop';
    if (isInitial) updateCountdown();
    interval = setInterval(updateCountdown, 1000);

    isInitial = false;


    // if (time.getTime() > Date.now()) {
    //     setInterval(() => {
    //         updateTimerDisplay(time);
    //     }, 1000)
    // }
}

function stopTimer() {
    startEl.innerHTML = 'Start';
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    setTime();
    startEl.innerHTML = "Start";
    clearInterval(interval);
    interval = null;

    updateTimerDisplay();
    isInitial = true;
}

function updateCountdown() {
    updateTimerDisplay();
    time--;
}

function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    countdownEl.innerHTML = `${minutes} : ${seconds}`;
}

function changeColor(mode) {
    document.getElementsByTagName("body")[0].style.backgroundColor = mode.dark;

    let buttons = [
        ...document.getElementsByTagName("button"),
        ...document.getElementsByTagName("span")
    ];

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = mode.light;
    }
}

function changeMode(newMode) {
    mode = newMode;
    setTime();
    resetTimer();


    changeColor(newMode);
}

startEl.addEventListener('click', async() => {
    const timeNow = new Date(Date.now());

    if (interval) {
        chrome.runtime.sendMessage({cmd: 'STOP_TIMER', when: timeNow});
        stopTimer();
    }
    else {
        chrome.runtime.sendMessage({cmd: 'START_TIMER', when: timeNow});
        startTimer();
    }
})

resetEl.addEventListener('click', async() => {
    chrome.runtime.sendMessage({cmd: 'RESET_TIMER'});
    resetTimer();

})

pomodoroEl.addEventListener('click', async() => {
    const mode = {
        time: 25,
        dark: "#d95550",
        light: "#dd6662",
    }
    chrome.runtime.sendMessage({cmd: 'CHANGE_MODE', mode: mode});
    changeMode(mode)

})

shortBreakEl.addEventListener('click', async() => {
    const mode = {
        time: 5,
        dark: "#4c9195",
        light: "#5e9ca0",
    }
    chrome.runtime.sendMessage({cmd: 'CHANGE_MODE', mode: mode});
    changeMode(mode)

})

longBreakEl.addEventListener('click', async() => {
    const mode = {
        time: 15,
        dark: "#457ca3",
        light: "#5889ac",
    }
    chrome.runtime.sendMessage({cmd: 'CHANGE_MODE', mode: mode});
    changeMode(mode)

})