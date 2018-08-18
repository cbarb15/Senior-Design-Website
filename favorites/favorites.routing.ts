import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './components';
import { AuthGuard } from '../../core/services';

// Routes for the angular application. When the application is first loaded, it will
// redirect the blank route to /login. 
const favoritesRoutes: Routes =
    [
        {
            path: 'favorites', children:
                [
                    { path: '', component: FavoritesComponent, canActivate: [ AuthGuard ] },
                ]
        }
    ];

@NgModule({
    imports: [ RouterModule.forChild(favoritesRoutes) ],
    exports: [ RouterModule ]
})
export class FavoritesRouting { }
