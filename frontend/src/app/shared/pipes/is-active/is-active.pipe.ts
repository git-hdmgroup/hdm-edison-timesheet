import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isActive'
})
export class IsActivePipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    return value === 1 ? 'app.generic.yes' : 'app.generic.no';
  }
}
