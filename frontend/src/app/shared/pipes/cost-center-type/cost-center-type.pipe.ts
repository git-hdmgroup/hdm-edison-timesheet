import { Pipe, PipeTransform } from '@angular/core';
import { COST_CENTER_TYPES } from '../../../_constants/cost-center-types';

@Pipe({
  name: 'costCenterType'
})
export class CostCenterTypePipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    return COST_CENTER_TYPES.find(item => item.type_id === value).type_name;
  }

}
