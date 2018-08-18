import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components';
import { AuthGuard } from '../../core/services';

// Routes for the angular application. When the application is first loaded, it will
// redirect the blank route to /login. 
const homeRoutes: Routes =
    [
        {
            path: 'home', children:
                [
                    { path: '', component: HomeComponent, canActivate: [ AuthGuard ] }
                ]
        }
    ];

@NgModule({
    imports: [ RouterModule.forChild(homeRoutes) ],
    exports: [ RouterModule ]
})
export class HomeRouting { }
