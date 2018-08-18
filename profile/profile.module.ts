import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile.routing';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SharedModule } from '@shared/shared.module';
import { ProfileComponent, ProfileDetailsComponent, ProfileHistoryComponent, ProfileSettingsComponent } from './components';
import { BlockquoteDirective } from './directives/blockquote.directive';
import { ToastModule } from '@shared/typescripts/pro/alerts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    AngularFireDatabaseModule,
    SharedModule
  ],
  declarations: 
  [
    ProfileComponent,
    ProfileDetailsComponent,
    ProfileHistoryComponent,
    ProfileSettingsComponent,
    BlockquoteDirective
  ],
  providers: [ ],
  schemas: [ NO_ERRORS_SCHEMA ]
})

export class ProfileModule { }
