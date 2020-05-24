interface CostCenterTypes {
  type_id: number;
  type_name: string;
}

export const COST_CENTER_TYPES: CostCenterTypes[] = [
  {
    type_id: 1,
    type_name: 'app.cost-center.type.functional'
  },
  {
    type_id: 2,
    type_name: 'app.cost-center.type.aux'
  },
  {
    type_id: 3,
    type_name: 'app.cost-center.type.service'
  }
];
