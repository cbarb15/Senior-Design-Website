import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { IngredientsService, PartyService } from '@core/services';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray, FormControl } from '@angular/forms';
import { ToastService } from '@shared/typescripts/pro/alerts';
import { IIngredient, IIngredientDict, IBottle } from '@shared/models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-bottles',
  templateUrl: './bottles.component.html',
  styleUrls: [ './bottles.component.scss' ]
})
export class BottlesComponent implements OnInit, OnDestroy
{
  ngOnDestroy (): void
  {
    console.log('Destorying');
  }

  @Input() pid$: BehaviorSubject<string>;
  @Input() currentPid$: BehaviorSubject<string>;
  bottlesForm: FormGroup;
  ingredients: any[] = [];
  index: number;
  duplicate: boolean = false;
  pid: string;
  currentPid: string;
  formReady = true;
  DEFAULT_AMOUNT = 24;

  constructor(private partyService: PartyService,
    private ingredientsService: IngredientsService,
    private fb: FormBuilder,
    private toastService: ToastService)
  { }

  ngOnInit ()
  {
    this.bottlesForm = this.fb.group({
      bottles: this.fb.array([])
    });
    this.initBottles();

    this.initIngredients();
  }

  initBottles ()
  {
    this.pid$.subscribe(pid =>
    {
      this.pid = pid;
      this.partyService.getBottles(this.pid)
        .map((response) =>
        {
          const bottlesFormGroups: FormGroup[] = response.map(data =>
          {
            return this.fb.group({
              amount_left: [ data.amount_left ],
              name: [ data.name ],
              ingredientId: [ data.ingredientId ]
            })
          });
          const bottlesFormArray: FormArray = this.fb.array(bottlesFormGroups);
          return bottlesFormArray;
        })
        .subscribe(mappedResponse =>
        {
          this.bottlesForm.setControl('bottles', mappedResponse);
        });
    });
    this.currentPid$.subscribe(currentPid => this.currentPid = currentPid);
  }

  initIngredients ()
  {
    this.ingredientsService.getIngredients()
      .subscribe(response =>
      {
        let data: { label: string, ingredientId: string }[] = [];
        for (let key in response)
        {
          data.push({
            label: response[ key ].name,
            ingredientId: key
          });
        }
        let index = 1;
        this.ingredients = data.sort((a, b) =>
        {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        }).map(ingredient =>
        {
          return {
            value: index++,
            label: ingredient.label,
            ingredientId: ingredient.ingredientId
          };
        });
      });
  }

  get bottles ()
  {
    return this.bottlesForm.get('bottles') as FormArray;
  }

  private hasDuplicate (): boolean
  {
    let hasDuplicate = false;
    let ids: Set<string> = new Set();
    this.bottlesForm.value.bottles.forEach(bottle =>
    {
      if (ids.has(bottle.ingredientId)) hasDuplicate = true;
      ids.add(bottle.ingredientId);
    })
    return hasDuplicate;
  }

  updateBottles ()
  {
    if (this.hasDuplicate())
    {
      this.duplicate = true;
      setTimeout(() =>
      {
        this.duplicate = false;
      }, 3000);
    }
    else
    {
      let dataToSend: IBottle[] = [];
      this.bottlesForm.value.bottles.forEach(bottle =>
      {
        dataToSend.push({
          ingredientId: bottle.ingredientId,
          amount_left: bottle.amount_left,
          name: bottle.name
        });
      })
      this.partyService.updateBottles(this.pid, dataToSend)
        .then(response => this.toastService.success('Your changes have been made.'))
        .catch(error => this.toastService.error(error));
      if (this.pid.trim() === this.currentPid.trim())
      {
        this.partyService.getCurrentParty().child('Bottles').set(dataToSend)
          .catch(error => this.toastService.error(error))
      };
    }
  }

  setIndex (index)
  {
    this.index = index;
  }

  updateBottle (option, index)
  {
    if (option._value.length > 0)
    {
      const bottleNumber = option._value - 1;
      this._updateBottle(bottleNumber, index);
    }
    else
    {
      console.log('Forgot to choose option!');
    }
  }

  _updateBottle (bottleNumber: number, index: number)
  {
    let bottle = {
      ingredientId: this.ingredients[ bottleNumber ].ingredientId,
      name: this.ingredients[ bottleNumber ].label,
      amount_left: this.DEFAULT_AMOUNT
    }
    this.bottles.at(index).patchValue(bottle);
    if (this.hasDuplicate())
    {
      this.formReady = false;
      this.duplicate = true;
    }
    else
    {
      this.formReady = true;
      this.duplicate = false;
    }
  }

  updateBottleFromChild (ingredient: string)
  {
    this._updateBottle(this.ingredients.length - 1, this.index);
  }
}
