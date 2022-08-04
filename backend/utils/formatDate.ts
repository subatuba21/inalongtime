export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let monthString = '';
  let daySuffix = '';

  switch (day.toString().slice(-1)) {
    case '1':
      daySuffix = 'st';
      break;

    case '2':
      daySuffix = 'nd';
      break;

    case '3':
      daySuffix = 'rd';
      break;

    default:
      daySuffix = 'th';
  }

  switch (month) {
    case 1:
      monthString = 'January';
      break;

    case 2:
      monthString = 'February';
      break;

    case 3:
      monthString = 'March';
      break;

    case 4:
      monthString = 'April';
      break;

    case 5:
      monthString = 'May';
      break;

    case 6:
      monthString = 'June';
      break;

    case 7:
      monthString = 'July';
      break;

    case 8:
      monthString = 'August';
      break;

    case 9:
      monthString = 'September';
      break;

    case 10:
      monthString = 'October';
      break;

    case 11:
      monthString = 'November';
      break;

    case 12:
      monthString = 'December';
      break;


    default:
      break;
  }

  return `${monthString} ${day}${daySuffix}, ${year}`;
};
