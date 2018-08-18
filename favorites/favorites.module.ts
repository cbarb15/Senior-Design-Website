import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FavoritesComponent } from './components';
import { FavoritesRouting } from './favorites.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ FavoritesComponent ],
  imports: [ CommonModule, FavoritesRouting, SharedModule ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class FavoritesModule { }
