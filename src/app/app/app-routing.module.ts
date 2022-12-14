import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { StudentGuard } from './auth/student.guard';
import { CompanyGuard } from './auth/company.guard';
import { LoginRegisterComponent, OTPComponent } from './login-register/login-register.component';
import { LogoutGuard } from './auth/logout.guard';
import { AdminGuard } from './auth/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    children: [
      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full'
      },
      {
        path: 'student',
        component: LoginRegisterComponent,
        data: { title: 'CUIC | Anna University | Student' },
      },
      {
        path: 'company',
        component: LoginRegisterComponent,
        data: { title: 'CUIC | Anna University | Company' },
      },
      {
        path: 'admin',
        component: LoginRegisterComponent,
        data: { title: 'CUIC | Anna University | Admin' },
      }
    ],
    canActivate: [LogoutGuard],
  },
  {
    path: 'otp',
    component: OTPComponent,
    data: { title: 'CUIC | Anna University' },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.module').then((mod) => mod.StudentModule),
    canActivate: [StudentGuard],
  },
  {
    path: 'company',
    loadChildren: () =>
      import('./company/company.module').then((mod) => mod.CompanyModule),
    canActivate: [CompanyGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((mod) => mod.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'alogin',
    component: AdminLoginComponent,
    data: { title: 'CUIC | Anna University' },
  },
  {
    path: '**',
    redirectTo: ''
  }
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  scrollOffset: [0, 120],
  relativeLinkResolution: 'legacy',
  useHash: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
