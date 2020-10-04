import { BupTableColumns } from '../shared/components/table/table.component';
import { MomentifyPipe } from '../shared/pipes/momentify/momentify.pipe';

export const commonColumns: BupTableColumns[] = [
  {
    name: 'valid_from',
    label: 'app.generic.valid_from',
    transform: (item): string => {
      const pipe = new MomentifyPipe();
      return pipe.transform(item.valid_from, 'DD/MM/YYYY');
    }
  },
  {
    name: 'valid_to',
    label: 'app.generic.valid_to',
    transform: (item): string => {
      const pipe = new MomentifyPipe();
      return pipe.transform(item.valid_to, 'DD/MM/YYYY');
    }
  }
];
