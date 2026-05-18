const DEFAULT_QR_FRAME_COLOR = "#0066ff";
const savedColor = localStorage.getItem("qrFrameColor");
const legacyDefaultColors = new Set(["#ff5c5c", "#ff0000", "#3385fe"]);
if (savedColor && !legacyDefaultColors.has(savedColor.trim().toLowerCase())) {
  document.querySelector(".qr-frame").style.backgroundColor = savedColor;
}

const zoneNumberEl = document.getElementById("zoneNumber");
const savedZone = localStorage.getItem("zoneNumber");
if (zoneNumberEl && savedZone && /^\d+$/.test(savedZone.trim())) {
  zoneNumberEl.textContent = String(parseInt(savedZone, 10));
}

const TOTAL_SECONDS = 60 * 60;
const DEFAULT_INITIAL_REMAINING_SECONDS = TOTAL_SECONDS;

const countdownEl = document.getElementById("countdown");
const progressFillEl = document.getElementById("progressFill");
const pulseBarEl = document.getElementById("pulseBar");

function parseInitialRemainingSeconds() {
  const urlValue = new URLSearchParams(window.location.search).get("remaining");
  const input = urlValue;
  if (!input) {
    return DEFAULT_INITIAL_REMAINING_SECONDS;
  }

  if (/^\d+$/.test(input)) {
    return Math.min(Math.max(parseInt(input, 10), 0), TOTAL_SECONDS);
  }

  const match = input.match(/^(\d{1,2}):([0-5]\d)$/);
  if (!match) {
    return DEFAULT_INITIAL_REMAINING_SECONDS;
  }

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  return Math.min(Math.max(minutes * 60 + seconds, 0), TOTAL_SECONDS);
}

const initialRemainingSeconds = parseInitialRemainingSeconds();
const startTimestamp = Date.now();
let lastRenderedSeconds = -1;

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTicketTimer() {
  const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
  const remaining = Math.max(initialRemainingSeconds - elapsed, 0);

  if (remaining !== lastRenderedSeconds) {
    lastRenderedSeconds = remaining;
    countdownEl.textContent = formatClock(remaining);
    progressFillEl.style.width = `${((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100}%`;
  }

  if (remaining === 0) {
    clearInterval(timerInterval);
    clearInterval(pulseInterval);
  }
}

function togglePulseBar() {
  pulseBarEl.classList.toggle("is-hidden");
}

updateTicketTimer();

const timerInterval = setInterval(updateTicketTimer, 250);
const pulseInterval = setInterval(togglePulseBar, 800);
