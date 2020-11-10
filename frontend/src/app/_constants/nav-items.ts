interface NavItem {
  text: string;
  linkTo: string;
  role: number;
  exact: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    text: 'nav.user-profile',
    linkTo: '/user-profile',
    role: 1,
    exact: true,
  },
  {
    text: 'nav.responsibles',
    linkTo: '/responsibles',
    role: 2,
    exact: true,
  },
  {
    text: 'nav.cities',
    linkTo: '/cities',
    role: 2,
    exact: true,
  },
  {
    text: 'nav.cost-centers',
    linkTo: '/cost-centers',
    role: 2,
    exact: true,
  },
  {
    text: 'nav.positions',
    linkTo: '/positions',
    role: 2,
    exact: true,
  },
  {
    text: 'nav.users',
    linkTo: '/users',
    role: 100,
    exact: true,
  },
  {
    text: 'nav.hours',
    linkTo: '/hours',
    role: 1,
    exact: true,
  },
  {
    text: 'nav.projects',
    linkTo: '/projects',
    role: 2,
    exact: true,
  },
  {
    text: 'nav.reports',
    linkTo: '/reports',
    role: 1,
    exact: true,
  },
  // {
  //   text: 'nav.admin',
  //   linkTo: '/admin',
  //   role: 100,
  //   exact: false,
  // }
];
