import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CreateDrinkComponent, RecipeIngredientComponent } from './components';
import { CreateDrinkRouting } from './create_drink.routing';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ CreateDrinkComponent, RecipeIngredientComponent ],
  imports: [ CommonModule, 
    CreateDrinkRouting, 
    SharedModule,
    FormsModule,
    ReactiveFormsModule ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class CreateDrinkModule { }
