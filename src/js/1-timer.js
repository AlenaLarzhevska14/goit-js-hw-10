// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#f03e3e',
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
      });

      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;

      iziToast.success({
        title: 'Success',
        message: 'Selected date is valid! Click Start to begin countdown.',
        position: 'topRight',
        backgroundColor: '#37b24d',
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
      });
    }
  },
};

const flatpickrInstance = flatpickr(datetimePicker, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay(timeRemaining) {
  const { days, hours, minutes, seconds } = convertMs(timeRemaining);

  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  if (!userSelectedDate) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please select a date first',
      position: 'topRight',
    });
    return;
  }

  datetimePicker.disabled = true;
  startButton.disabled = true;

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    const currentDate = new Date();
    const timeRemaining = userSelectedDate - currentDate;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(0);

      datetimePicker.disabled = false;

      iziToast.info({
        title: 'Countdown Complete',
        message: 'The countdown has reached zero!',
        position: 'topRight',
        backgroundColor: '#339af0',
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
      });

      return;
    }

    updateTimerDisplay(timeRemaining);
  }, 1000);

  iziToast.info({
    title: 'Countdown Started',
    message:
      'Timer is now running. You cannot change the date until it finishes.',
    position: 'topRight',
    backgroundColor: '#339af0',
    titleColor: '#fff',
    messageColor: '#fff',
    iconColor: '#fff',
  });
}

startButton.addEventListener('click', startCountdown);

updateTimerDisplay(0);
