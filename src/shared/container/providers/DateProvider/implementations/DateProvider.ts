import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DateProvider implements IDateProvider {
  dateNow(): Date {
    const currentDate = dayjs().toDate();

    return currentDate;
  }

  convertToUTC(date: Date): string {
    const dateConvertedToUTC = dayjs(date).utc().local().format();

    return dateConvertedToUTC;
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);

    const compareResult = dayjs(end_date_utc).diff(start_date_utc, 'hours');

    return compareResult;
  }
}

export { DateProvider };
