import { Component, OnInit } from '@angular/core';
import { ProfileService, MenuService } from '@core/services';
import { ToastService } from '@shared/typescripts/pro/alerts';
import { DrinkComponent } from '@shared/components';
import { IDrink, IDateDrink } from '@shared/models';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'underscore';

@Component({
  selector: 'app-profile-history',
  templateUrl: './profile-history.component.html',
  styleUrls: ['./profile-history.component.scss']
})
export class ProfileHistoryComponent implements OnInit {
  history: IDateDrink[];
  
  constructor(
    private _profileService: ProfileService,
    private _toastService: ToastService,
    private mS: MenuService,
    private fb: FormBuilder
  ) { }

  ngOnInit() 
  {
    /*
    * We must get the history in this way because it is a reverse ordered list by timestamp.
    * Since snapshot.val() returns a json which is unordered, we instead call snapshot.forEach
    */
    this._profileService.getHistory()
    .on('value', (snapshot, error) => {
      this.history = [];
      snapshot.forEach(snap => {
        const dateDrink: IDateDrink = {
          drink: snap.val().drink, 
          date: -1 * snap.val().timestamp
        };
        if (!this.containsDrink(dateDrink.drink, this.history)){
          this.history.push(dateDrink);
        }
        return false;
      })
    })
  }

  private containsDrink(drink, array: IDateDrink[]): boolean {
    for (let i = 0; i < array.length; i++){
      if (_.isEqual(array[i].drink.name, drink.name) && _.isEqual(array[i].drink.recipe, drink.recipe)) return true;
    }
    return false;
  }

  display()
  {
    let optins = { closeButton: true, positionClass: 'toast-bottom-right' };
    this._toastService.success('ABC', 'Welcome', optins);
  }
}
