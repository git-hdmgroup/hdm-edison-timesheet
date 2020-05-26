import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    const duration = moment.duration(value, 'milliseconds');
    return duration.asDays().toString();
  }

}
