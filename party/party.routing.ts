import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartyComponent } from './components/party.component';
import { AuthGuard } from '../../core/services';

// Routes for the angular application. When the application is first loaded, it will
// redirect the blank route to /login. 
const partyRoutes: Routes =
    [
        {
            path: 'party', children:
                [
                    { path: '', component: PartyComponent, canActivate: [ AuthGuard ] }
                ]
        }
    ];

@NgModule({
    imports: [ RouterModule.forChild(partyRoutes) ],
    exports: [ RouterModule ]
})
export class PartyRouting { }
