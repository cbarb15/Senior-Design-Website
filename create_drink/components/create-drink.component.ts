import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { RecipeIngredientComponent } from './recipe_ingredient.component';
import { DrinksService } from '../../../core/services';
import { IngredientsService } from '@core/services/ingredients.service';
import { FileUploadComponent } from '../../../shared/components/file-upload.component';
import { IDrink, IRecipe } from '@shared/models';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService, SelectComponent } from '@shared/typescripts/pro';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-create-drink',
  templateUrl: './create-drink.component.html',
  styleUrls: [ './create-drink.component.scss' ]
})

export class CreateDrinkComponent implements OnInit, AfterViewInit
{
  MAX_OUNCES: number = 12;
  drinkForm: FormGroup;
  drinks_list: IDrink[] = [];
  imgSrc: string = '../../assets/images/empty-glass.jpg';
  selectedValues: number[];

  name: string = '';
  description: string = '';
  imgUrl: string = '';
  rating: number = 0;
  optionsSelect: Array<any>;
  oz: number = 0;

  passedInDrinkId: number = -1;
  selectedDrink = '4';
  ounceModified: boolean = false;
  numOunces = 0.0;

  constructor(private drinkService: DrinksService,
    private ingredientsService: IngredientsService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }
  get drinkID (): number { return +(this.route.snapshot.paramMap.get('id')); }
  ngOnInit ()
  {
    const toastConfig = {
      positionClass: 'toast-bottom-right'
    };
    this.passedInDrinkId = this.drinkID;
    this.initDrinkForm();
    this.getAllDrinks();
    this.getAllIngredients();
  }

  @ViewChildren('ingredientsSelect') ingrSelec: QueryList<SelectComponent>;
  ngAfterViewInit (): void
  {
    if (this.passedInDrinkId >= 0)
    {
      setTimeout(() => 
      {
        this.ingrSelec.forEach((s, i) =>
        {
          let index = this.optionsSelect.findIndex(ingr => 
            ingr.ingredientId === this.drinks_list[this.passedInDrinkId].recipe[i].ingredientId);
          s.writeValue(`${ index }`);
        });
      }, 150);
    }
  }

  initDrinkForm ()
  {
    this.drinkForm = this.fb.group({
      drink: [ '', [] ],
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      imgUrl: [ '', [ Validators.required ] ],
      keywords: [ '', [] ],
      recipe: this.fb.array([]),
      favorites: this.fb.array([
      ]),
      rating: [ '', [ Validators.required ] ]
    });
  }

  initRecipe (): FormGroup
  {
    return this.fb.group({
      amount: [ 0, [ Validators.required ] ],
      value: ['']
    });
  }

  getAllDrinks ()
  {
    this.drinkService.getDrinks()
      .subscribe(response =>
      {
        this.drinks_list = [];
        response.forEach(drink =>
        {
          this.drinks_list.push(drink);
        });
        if (this.passedInDrinkId >= 0)
        {
          this.drinks_list[ this.passedInDrinkId ].recipe.forEach(() => this.recipe.push(this.initRecipe()));
          this.drinkForm.patchValue(this.drinks_list[ this.passedInDrinkId ]);
          this.imgSrc = this.drinks_list[ this.passedInDrinkId ].imgUrl;

          this.drinks_list[ this.passedInDrinkId ].recipe.forEach((ingr) => {
            this.numOunces += ingr.amount;
          })
        }
      });
  }

  getAllIngredients ()
  {
    this.selectedValues = [];
    this.ingredientsService.getIngredients()
      .subscribe(response =>
      {
        let data: { label: string, ingredientId: string }[] = [];
        let index = 0;
        for (let key in response)
        {
          data.push({
            label: response[ key ].name,
            ingredientId: key
          });
        }
        this.optionsSelect = data.sort((a, b) =>
        {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        })
        .map(ingr => {
          return {
            value: `${ index++ }`,
            label: ingr.label,
            ingredientId: ingr.ingredientId
          };
        });
      });
  }

  saveDrink ()
  {
    let ingredients = [];
    this.recipe.controls.forEach(control =>
    {
      if (this.optionsSelect[ control.value.value ] === undefined)
      {
        const toastConfig = {
          positionClass: 'toast-bottom-right',
          timeOut: 7000,
          closeButton: true
        };
        this.toastService.error('Ingredient was not selected, please select an ingredient!', 'Error!', toastConfig);
        return;
      }
      if (control.value.amount === 0)
      {
        const toastConfig = {
          positionClass: 'toast-bottom-right',
          timeOut: 7000,
          closeButton: true
        };
        this.toastService.error('Ingredient amount was not specified, please set an amount of liquid!', 'Error!', toastConfig);
        return;
      }
      let ingredient = {
        amount: control.value.amount,
        ingredientId: this.optionsSelect[ control.value.value ].ingredientId,
        name: this.optionsSelect[ control.value.value ].label
      }
      ingredients.push(ingredient);
    });
    // validate and throw error
    if (ingredients === [])
    {
      const toastConfig = {
        positionClass: 'toast-bottom-right',
        timeOut: 7000,
        closeButton: true
      };
      this.toastService.error('No ingredients specified, please add at least one ingredient!', 'Error!', toastConfig);
      return;
    }

    let drinkId = this.drinks_list.length;

    if (this.passedInDrinkId >= 0)
    {
      drinkId = this.passedInDrinkId;
    }
    // validate and throw error
    if (this.drinkForm.controls.name.value === '')
    {
      const toastConfig = {
        positionClass: 'toast-bottom-right',
        timeOut: 7000,
        closeButton: true
      };
      this.toastService.error('No name specified, please name your drink!', 'Error!', toastConfig);
      return;
    }
    let drink: IDrink = {
      name: this.drinkForm.controls.name.value,
      description: this.drinkForm.controls.description.value,
      id: drinkId,
      favorites: [ '' ],
      recipe: ingredients,
      rating: 0,
      keywords: [ '' ],
      imgUrl: this.imgSrc,
    };
    if (this.passedInDrinkId >= 0) this.drinks_list.splice(this.passedInDrinkId, 1, drink);
    else this.drinks_list.splice(this.drinks_list.length, 1, drink);

    // validate and throw error
    this.drinkService.updateDrinks(this.drinks_list)
      .then(response =>
      {
        const toastConfig = {
          positionClass: 'toast-bottom-right',
          timeOut: 5000,
          closeButton: true
        };
        this.toastService.success('Drink has been successfully updated.', 'Sucess!', toastConfig);
        this.Cancel();
      })
      .catch(error =>
      {
        const toastConfig = {
          positionClass: 'toast-bottom-right',
          timeOut: 5000,
          closeButton: true
        };
        this.toastService.error('The drink could not be updated.', 'Error!', toastConfig);
      })
    this.imgSrc = '';
  }

  Cancel ()
  {
    this.router.navigate([ '/home' ]);
  }

  addIngredient ()
  {
    this.recipe.push(this.initRecipe());
  }

  removeIngredient ()
  {
    this.recipe.removeAt(this.recipe.length - 1);
  }

  plusOz ($event, index)
  {
    // validate and throw error
    if (this.numOunces === this.MAX_OUNCES)
    {
      const toastConfig = {
        positionClass: 'toast-bottom-right',
        timeOut: 5000,
        closeButton: true
      };
      this.toastService.info('Too many ounces!', '', toastConfig);
    }
    else
    {
      this.recipe.controls[ index ].value.amount = this.recipe.controls[ index ].value.amount + 1.5;
      this.ounceModified = true;
      this.numOunces += 1.5;
    }
  }

  minusOz ($event, index)
  {
    if (this.recipe.controls[ index ].value.amount >= 1.5)
    {
      this.recipe.controls[ index ].value.amount = this.recipe.controls[ index ].value.amount - 1.5;
      this.numOunces -= 1.5;
    }
    else
    {
      this.recipe.controls[ index ].value.amount = 0;
      // validate and throw error
      const toastConfig = {
        positionClass: 'toast-bottom-right',
        timeOut: 5000,
        closeButton: true
      };
      this.toastService.info('Ounces are at 0', '', toastConfig);
    }
    this.ounceModified = true;
  }

  get recipe ()
  {
    return this.drinkForm.get('recipe') as FormArray;
  }

  imageUploadDone (downloadUrl: string)
  {
    this.imgSrc = downloadUrl;
    this.drinkForm.patchValue({ imgUrl: downloadUrl });
  }
}
