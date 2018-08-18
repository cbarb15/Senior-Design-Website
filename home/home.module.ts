//#region imports
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeComponent, MenuComponent } from './components';
import { HomeRouting } from './home.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ HomeComponent, MenuComponent ],
  imports: [ CommonModule, HomeRouting, SharedModule ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class HomeModule { }
