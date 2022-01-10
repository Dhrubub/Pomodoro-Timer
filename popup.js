const countdownEl = document.getElementById('countdown');
const startEl = document.getElementById('startButton');
const resetEl = document.getElementById('resetButton');
const pomodoroEl = document.getElementById('pomodoroButton');
const shortBreakEl = document.getElementById('shortBreakButton');
const longBreakEl = document.getElementById('longBreakButton');

let startingTime = 25;
let time = startingTime * 60;
let interval = null;
let isInitial = true;


chrome.runtime.sendMessage({cmd: 'GET_TIME'}, (response) => {
    if (response.time) {
        time = time - response.time;
        if (response.run) {
            updateTimerDisplay();
            startTimer();
        }
        console.log(time);
    }
})

function setTime() {
    time = startingTime * 60;
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

startEl.addEventListener('click', async() => {
    const timeNow = new Date(Date.now());
    chrome.runtime.sendMessage({cmd: 'START_TIMER', when: timeNow});
    interval ? stopTimer() : startTimer();
})