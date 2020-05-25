interface Roles {
  role_id: number;
  role_name: string;
}

export const ROLES: Roles[] = [
  {
    role_id: 1,
    role_name: 'app.roles.user'
  },
  {
    role_id: 2,
    role_name: 'app.roles.responsible'
  },
  {
    role_id: 100,
    role_name: 'app.roles.admin'
  }
];

export const ROLES_IDX = {
  USER: 0,
  RESPONSIBLE: 1,
  ADMIN: 2
};


