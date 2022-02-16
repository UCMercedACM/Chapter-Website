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
  let startDate = new Date(start);
  let endDate = new Date(end);
  let startHour;
  let startMinute;
  let endHour;
  let endMinute;

  if (startDate === endDate)
    throw new Error("Start Hour and End Hour are same.");

  if (startDate.getHours() >= 12) {
    isStartHourPM = "pm";
    startHour = startDate.getHours() - 12;
    startMinute = startDate.getMinutes();
    startMinute = startMinute == 0 ? "00" : startMinute;
  } else if (startDate.getHours() < 12) {
    isStartHourPM = "am";
    startHour = startDate.getHours();
    startMinute = startDate.getMinutes();
    startMinute = startMinute == 0 ? "00" : startMinute;
  }

  if (endDate.getHours() >= 12) {
    isEndHourPM = "pm";
    endHour = endDate.getHours() - 12;
    endMinute = startDate.getMinutes();
    endMinute = endMinute == 0 ? "00" : endMinute;
  } else if (endDate.getHours() < 12) {
    isEndHourPM = "am";
    endHour = endDate.getHours();
    endMinute = startDate.getMinutes();
    endMinute = endMinute == 0 ? "00" : endMinute;
  }

  if (isStartHourPM === isEndHourPM) {
    const string = `${startHour}:${startMinute}-${endHour}:${endMinute}${isStartHourPM}`;
    return string;
  } else {
    const string = `${startHour}:${startMinute}${isStartHourPM}-${endHour}:${endMinute}${isEndHourPM}`;
    return string;
  }
}

export { convertToMonthDate, convertToTime };
