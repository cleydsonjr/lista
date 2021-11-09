import {Pipe, PipeTransform} from '@angular/core';
import {differenceInHours, formatDistance, formatRelative, parseISO} from "date-fns";
import {ptBR} from "date-fns/esm/locale";

const MINIMUM_DISTANCE_FOR_RELATIVE_FORMAT = 2;

@Pipe({
  name: 'dateInterval'
})
export class DateIntervalPipe implements PipeTransform {

  transform(value: unknown, referenceDate = new Date()): string {
    let valueDate;
    if (value instanceof Date) {
      valueDate = value;
    } else if (typeof value === 'string') {
      valueDate = parseISO(value)
    } else {
      throw new Error('')
    }

    const difference = differenceInHours(valueDate, referenceDate);

    if (difference < MINIMUM_DISTANCE_FOR_RELATIVE_FORMAT) {
      return `há ${formatDistance(valueDate, referenceDate, {locale: ptBR})}`;
    } else {
      return `${formatRelative(valueDate, referenceDate, {locale: ptBR})}`;
    }
  }

}
