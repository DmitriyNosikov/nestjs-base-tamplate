const DEBOUNCE_TIMEOUT = 500;
const THROTTLE_DELAY = 1000;

type CallbackType = (...args: unknown[]) => unknown;

// Функции для устранения дребезга
export function debounce(
  callback: CallbackType,
  timeout: number = DEBOUNCE_TIMEOUT
) {
  let timerId = null;

  return (...rest) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => callback.apply(this, rest), timeout);
  };
}

// Вызов функции не раньше, чем раз в delay миллисекунд
export function throttle(
  callback: CallbackType,
  delay: number = THROTTLE_DELAY
) {
  let previousTime: Date = new Date();

  return function (...rest) {
    const currentTime = new Date();
    const delta = currentTime.getTime() - previousTime.getTime();

    if (delta >= delay) {
      callback.apply(this, rest);

      previousTime = currentTime;
    }
  };
}