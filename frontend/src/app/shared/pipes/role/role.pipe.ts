import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from '../../../_constants/roles';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    return ROLES.find(item => item.role_id === value).role_name;
  }
}
