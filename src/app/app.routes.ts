import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationComponent } from './features/notification/notification.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';
import { DetailsComponent } from './features/details/details.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';

export const routes: Routes = [
    { path: '', redirectTo:'login',pathMatch:'full'},
    {
        path: '', component: AuthLayoutComponent,
        canActivate:[guestGuard],
        children: [
            { path: 'login', component: LoginComponent ,title:'login Page'},
            { path: 'register', component: RegisterComponent, title: 'register Page' },
            { path: 'forget', component: ForgetPasswordComponent, title: 'forget Page' },
    ] },
    {
        path: '', component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'feed', component: FeedComponent, title: 'feed Page'},
            { path: 'profile', component: ProfileComponent, title: 'profile Page' },
            { path: 'notification', component: NotificationComponent, title: 'notification Page' },
            { path: 'change', component: ChangePasswordComponent, title: 'change Page' },
            { path: 'details/:id', component: DetailsComponent, title: 'details Page' },
            {path: 'suggestions',component: SuggestionsComponent, title: 'suggestions Page'}
        ]
    },
    { path: '**', component: NotFoundComponent, title: 'NotFound Page' }
    
];
