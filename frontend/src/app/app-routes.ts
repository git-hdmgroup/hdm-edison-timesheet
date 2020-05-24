import { Routes } from '@angular/router';
import { PublicRouteGuard } from './_guards/public-route/public-route.guard';
import { ShellComponent } from './_shell/shell.component';
import { AuthGuard } from './_guards/auth/auth.guard';
import { AdminGuard } from './_guards/admin/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [PublicRouteGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'user-profile',
        pathMatch: 'full'
      },
      {
        path: 'user-profile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
      },
      {
        path: 'responsibles',
        loadChildren: () => import('./responsibles/responsibles.module').then(m => m.ResponsiblesModule)
      },
      {
        path: 'cities',
        loadChildren: () => import('./cities/cities.module').then(m => m.CitiesModule)
      },
      {
        path: 'cost-centers',
        loadChildren: () => import('./cost-centers/cost-centers.module').then(m => m.CostCentersModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'hours',
        loadChildren: () => import('./hours/hours.module').then(m => m.HoursModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  }
];
