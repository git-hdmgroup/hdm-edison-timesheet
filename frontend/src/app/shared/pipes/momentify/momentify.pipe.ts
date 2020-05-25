import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentify'
})
export class MomentifyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {

    let format = 'YYYY-MM-DD';
    if (args) {
      format = args[0];
    }

    return moment(value).format(format);
  }
}
