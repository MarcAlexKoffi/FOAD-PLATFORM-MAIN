import { Register } from './register/register';
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { AdminLayout } from './admin-layout/admin-layout';
import { CreatorLayout } from './creator-layout/creator-layout';
import { TeacherLayout } from './teacher-layout/teacher-layout';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { Demandes } from './demandes/demandes';
import { CreatorMain } from './creator-main/creator-main';
import { Rdv } from './rdv/rdv';
import { Messages } from './messages/messages';
import { DetailDemandes } from './detail-demandes/detail-demandes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'adminlayout',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },
  {
    path: 'creatorlayout',
    component: CreatorLayout,
    children: [
      {
        path: '',
        redirectTo: 'creatormain',
        pathMatch: 'full'
      },
      {
        path: 'demandes',
        component: Demandes
      },
      {
        path: 'creatormain',
        component: CreatorMain
      },
      {
        path: 'rdv',
        component: Rdv
      },
      {
        path: 'messages',
        component: Messages
      },
      {
        path: 'detaildemandes',
        component: DetailDemandes
      }
    ]
  },
  {
    path: 'teacherlayout',
    component: TeacherLayout,
  },
   {
        path: 'detaildemandes',
        component: DetailDemandes
      }
];
