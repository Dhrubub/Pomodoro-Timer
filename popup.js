const countdownEl = document.getElementById('countdown');
const startEl = document.getElementById('startButton');
const resetEl = document.getElementById('resetButton');
const pomodoroEl = document.getElementById('pomodoroButton');
const shortBreakEl = document.getElementById('shortBreakButton');
const longBreakEl = document.getElementById('longBreakButton');
const customBreakEl = document.getElementById('customBreakButton');

let mode = {
	time: 25,
	dark: '#d95550',
	light: '#dd6662',
	custom: true,
};
let time = mode.time * 60;
let interval = null;
let isInitial = true;

let audio = new Audio('/ding.mp3');

chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, (response) => {
	if (response.time) {
		time = response.time;
		mode = response.mode;
		changeColor(response.mode);
		updateTimerDisplay();
		if (response.run) {
			startTimer();
		}
	}
});

function setTime() {
	time = mode.time * 60;
}

function startTimer() {
	startEl.innerHTML = 'Stop';
	if (isInitial) updateCountdown();
	interval = setInterval(updateCountdown, 1000);

	isInitial = false;
}

function stopTimer() {
	startEl.innerHTML = 'Start';
	clearInterval(interval);
	interval = null;
}

function resetTimer() {
	setTime();
	startEl.innerHTML = 'Start';
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

	if (minutes == 0 && seconds == 0) {
		console.log('test');
		resetTimer();
		chrome.notifications.create({
			title: 'Pomodoro',
			iconUrl: '/images/tomato128.png',
			message: 'Timer is done',
			type: 'basic',
			requireInteraction: true,
		});
		audio.play();
	}

	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	countdownEl.innerHTML = `${minutes} : ${seconds}`;
}

function changeColor(mode) {
	document.getElementsByTagName('body')[0].style.backgroundColor = mode.dark;

	let buttons = [
		...document.getElementsByTagName('button'),
		...document.getElementsByTagName('span'),
	];

	for (let i = 0; i < buttons.length; i++) {
		buttons[i].style.backgroundColor = mode.light;
	}
}

function changeMode(newMode) {
	if (newMode.custom) countdownEl.contentEditable = true;
	else countdownEl.contentEditable = false;

	let customTime = false;

	if (countdownEl.contentEditable) {
		countdownEl.addEventListener('click', () => stopTimer());
		countdownEl.addEventListener('input', () => {
			const parts = countdownEl.textContent.split(':');
			const minutes = parts[0]; // The part before the colon
			const seconds = parts[1]; // The part after the colon
			if (!isNaN(minutes) && !isNaN(seconds)) {
				time = Number(minutes) * 60 + Number(seconds);
				customTime = true;
			}
		});
	} else {
		countdownEl.removeEventListener('input', this);
		countdownEl.removeEventListener('click', this);
	}

	mode = newMode;
	if (!customTime) setTime();
	resetTimer();

	changeColor(newMode);
	chrome.runtime.sendMessage({ cmd: 'CHANGE_MODE', mode: newMode });
}

startEl.addEventListener('click', async () => {
	const timeNow = new Date(Date.now());

	if (interval) {
		chrome.runtime.sendMessage({ cmd: 'STOP_TIMER', when: timeNow });
		stopTimer();
	} else {
		chrome.runtime.sendMessage({
			cmd: 'START_TIMER',
			when: timeNow,
			mode: mode,
		});
		startTimer();
	}
});

resetEl.addEventListener('click', async () => {
	chrome.runtime.sendMessage({ cmd: 'RESET_TIMER' });
	resetTimer();
});

pomodoroEl.addEventListener('click', async () => {
	const mode = {
		time: 25,
		dark: '#d95550',
		light: '#dd6662',
	};
	changeMode(mode);
});

shortBreakEl.addEventListener('click', async () => {
	const mode = {
		time: 0,
		dark: '#4c9195',
		light: '#5e9ca0',
	};
	changeMode(mode);
});

longBreakEl.addEventListener('click', async () => {
	const mode = {
		time: 15,
		dark: '#457ca3',
		light: '#5889ac',
	};
	changeMode(mode);
});

customBreakEl.addEventListener('click', async () => {
	const mode = {
		time: 1,
		dark: '#6cb073',
		light: '#82bc88',
		custom: true,
	};

	changeMode(mode);
});
