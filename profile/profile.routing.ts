import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components';
import { AuthGuard } from 'app/core/services';

// Routes for the angular application. When the application is first loaded, it will
// redirect the blank route to /login. 
const profileRoutes: Routes =
    [
        {
            path: 'profile', children:
                [
                    { path: '', component: ProfileComponent, canActivate: [ AuthGuard ] }
                ]
        },
    ];

@NgModule({
    imports: [ RouterModule.forChild(profileRoutes) ],
    exports: [ RouterModule ]
})

export class ProfileRoutingModule { }
