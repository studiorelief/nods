/**
 * Updates the baseline date elements with the current date
 *
 * HTML Structure expected:
 * <element id="home-month">...</element>
 * <element id="home-day">...</element>
 * <element id="home-year">...</element>
 */
export const initBaselineDates = (): void => {
  const monthElement = document.querySelector('#home-month');
  const dayElement = document.querySelector('#home-day');
  const yearElement = document.querySelector('#home-year');

  // Early return if required elements are not found
  if (!monthElement || !dayElement || !yearElement) {
    return;
  }

  const now = new Date();

  // Format month (e.g., "January")
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[now.getMonth()];
  monthElement.textContent = month;

  // Format day + date (e.g., "Monday 12")
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[now.getDay()];
  const dayNumber = now.getDate();
  dayElement.textContent = `${dayName} ${dayNumber}`;

  // Format year (e.g., "2026")
  const year = now.getFullYear();
  yearElement.textContent = year.toString();
};
