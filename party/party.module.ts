//#region imports
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PartyComponent } from './components/party.component';
import { PartyRouting } from './party.routing';
import { SharedModule } from '@shared/shared.module';
import { BottlesComponent } from '@feature/party/bottles/bottles.component';
import { IngredientsComponent } from '@feature/party/ingredients/ingredients.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ PartyComponent, BottlesComponent, IngredientsComponent ],
  imports: [ CommonModule, 
    PartyRouting, 
    SharedModule, 
    FormsModule, 
    ReactiveFormsModule, ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class PartyModule { }
