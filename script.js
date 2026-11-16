
const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");
const messageDisplay = document.getElementById("message");
const progressBar = document.getElementById("progressBar");

const sessionDisplay = document.getElementById("sessionTime");
const breakDisplay = document.getElementById("breakTime");

const sessionMinus = document.getElementById("sessionMinus");
const sessionPlus = document.getElementById("sessionPlus");
const breakMinus = document.getElementById("breakMinus");
const breakPlus = document.getElementById("breakPlus");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Initial values
let sessionMinutes = 25;
let breakMinutes = 5;

let remainingSeconds = sessionMinutes * 60;
let phaseDuration = remainingSeconds;

let isRunning = false;
let isSession = true;
let intervalId = null;

// Format seconds into MM:SS
function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Update timer display
function renderTimer() {

    timerDisplay.textContent = formatTime(remainingSeconds);

    let percentage = phaseDuration > 0
        ? (remainingSeconds / phaseDuration) * 100
        : 0;

    progressBar.style.width = `${percentage}%`;
}

// Update session and break values
function renderSettings() {

    sessionDisplay.textContent = sessionMinutes;
    breakDisplay.textContent = breakMinutes;
}

// Disable settings while running
function setSettingsDisabled(disabled) {

    sessionMinus.disabled = disabled;
    sessionPlus.disabled = disabled;

    breakMinus.disabled = disabled;
    breakPlus.disabled = disabled;
}

// Increase or decrease time
function adjustTime(type, amount) {

    if (isRunning) return;

    if (type === "session") {

        sessionMinutes = Math.max(0, sessionMinutes + amount);

        if (isSession) {
            phaseDuration = sessionMinutes * 60;
            remainingSeconds = phaseDuration;
        }

    } else {

        breakMinutes = Math.max(0, breakMinutes + amount);

        if (!isSession) {
            phaseDuration = breakMinutes * 60;
            remainingSeconds = phaseDuration;
        }
    }

    renderSettings();
    renderTimer();
}

// Button events
sessionMinus.addEventListener("click", () => {
    adjustTime("session", -1);
});

sessionPlus.addEventListener("click", () => {
    adjustTime("session", 1);
});

breakMinus.addEventListener("click", () => {
    adjustTime("break", -1);
});

breakPlus.addEventListener("click", () => {
    adjustTime("break", 1);
});

// Switch between session and break
function switchPhase() {

    isSession = !isSession;

    phaseDuration = (isSession ? sessionMinutes : breakMinutes) * 60;
    remainingSeconds = phaseDuration;

    statusDisplay.textContent = isSession
        ? "Focus time"
        : "Break time";

    messageDisplay.textContent = isSession
        ? "Let's make a little progress!"
        : "Stretch, sip some water, relax.";

    renderTimer();
}

// Timer countdown
function tick() {

    if (remainingSeconds <= 1) {

        switchPhase();

    } else {

        remainingSeconds--;
        renderTimer();

    }
}

// Start timer
function startTimer() {

    if (isRunning) return;

    if (sessionMinutes === 0 && breakMinutes === 0) {
        messageDisplay.textContent = "Set a session or break first!";
        return;
    }

    // Skip a zero-duration phase
    if (remainingSeconds === 0) {
        switchPhase();
    }

    isRunning = true;

    setSettingsDisabled(true);

    startBtn.textContent = "Ⅱ Pause";

    messageDisplay.textContent = "You've got this!";

    intervalId = setInterval(tick, 1000);
}

// Pause timer
function pauseTimer() {

    clearInterval(intervalId);

    intervalId = null;
    isRunning = false;

    setSettingsDisabled(false);

    startBtn.textContent = "▶ Resume";

    messageDisplay.textContent = "Paused. Take your time.";
}

// Start / Pause button
startBtn.addEventListener("click", function () {

    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }

});

// Reset button
resetBtn.addEventListener("click", function () {

    clearInterval(intervalId);

    intervalId = null;

    isRunning = false;
    isSession = true;

    remainingSeconds = sessionMinutes * 60;
    phaseDuration = remainingSeconds;

    statusDisplay.textContent = "Focus time";

    messageDisplay.textContent = "Fresh start. You've got this!";

    startBtn.textContent = "▶ Start";

    setSettingsDisabled(false);

    renderTimer();

});

// Initial display
renderSettings();
renderTimer();
