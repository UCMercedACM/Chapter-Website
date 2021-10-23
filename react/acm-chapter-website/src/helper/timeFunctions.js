function convertToMonthDate(date) {
  const localDate = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  // prettier-ignore
  const formattedDate = `${months[localDate.getMonth()]}, ${localDate.getDate()}`;
  return formattedDate;
}

function convertToTime(start, end) {
  let isStartHourPM = "";
  let isEndHourPM = "";
  let startHour = new Date(start);
  let endHour = new Date(end);

  if (startHour === endHour)
    throw new Error("Start Hour and End Hour are same.");

  if (startHour.getHours() >= 12) {
    isStartHourPM = "pm";
    startHour = startHour.getHours() - 12;
  } else if (startHour.getHours() < 12) {
    isStartHourPM = "am";
    startHour = startHour.getHours();
  }

  if (endHour.getHours() >= 12) {
    isEndHourPM = "pm";
    endHour = endHour.getHours() - 12;
  } else if (endHour.getHours() < 12) {
    isEndHourPM = "am";
    endHour = endHour.getHours();
  }

  if (isStartHourPM === isEndHourPM) {
    const string = `${startHour}-${endHour}${isStartHourPM}`;
    return string;
  } else {
    const string = `${startHour}${isStartHourPM}-${endHour}${isEndHourPM}`;
    return string;
  }
}

export { convertToMonthDate, convertToTime };
