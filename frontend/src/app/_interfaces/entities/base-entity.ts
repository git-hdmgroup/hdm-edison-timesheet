export interface BaseEntity {
  id: number;
  // to be removed.
  active?: number;
  valid_from: number;
  valid_to: number;
  created_at?: number;
  updated_at?: number;
}
