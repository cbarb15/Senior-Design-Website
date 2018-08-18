import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateDrinkComponent, RecipeIngredientComponent } from './components';
import { AuthGuard } from '../../core/services';

// Routes for the angular application. When the application is first loaded, it will
// redirect the blank route to /login. 
const create_drinkRoutes: Routes =
    [
        {
            path: 'create_drink', children:
                [
                    { path: '', component: CreateDrinkComponent, canActivate: [ AuthGuard ] },
                ]
        },
        {
            path: 'create_drink/:id', children:
                [
                    { path: '', component: CreateDrinkComponent, canActivate: [ AuthGuard ] },
                ]
        }
    ];

@NgModule({
    imports: [ RouterModule.forChild(create_drinkRoutes) ],
    exports: [ RouterModule ]
})
export class CreateDrinkRouting { }
