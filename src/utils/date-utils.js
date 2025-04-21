import dayjs from 'dayjs';


function getFormattedDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}


function getDateDifference(dateA, dateB) {
  const diffDay = dayjs(dateA).diff(dateB, 'day');
  const diffHour = dayjs(dateA).diff(dateB, 'hour') - (diffDay * 24);
  const diffMinute = dayjs(dateA).diff(dateB, 'minute') - ((diffHour * 60) + ((diffDay * 24) * 60));

  let diffDayText = '';
  if (diffDay > 0 && diffDay < 10) {
    diffDayText = `0${diffDay}D`;
  } else if (diffDay >= 10) {
    diffDayText = `${diffDay}D`;
  }

  let diffHourText = '';
  if (diffHour > 0 && diffHour < 10) {
    diffHourText = `0${diffHour}H`;
  } else if (diffHour >= 10) {
    diffHourText = `${diffHour}H`;
  } else if (diffDay !== 0) {
    diffHourText = '00H';
  }

  const diffMinuteText = diffMinute !== 0 ? `${diffMinute}M` : '00M';

  const diffDateText = `${diffDayText} ${diffHourText} ${diffMinuteText}`;

  return diffDateText;
}

function getEventDuration(event) {
  const eventDuration = dayjs(event.dateFrom).diff(event.dateTo);
  return eventDuration;
}


export {
  getFormattedDate,
  getDateDifference,
  getEventDuration
};
