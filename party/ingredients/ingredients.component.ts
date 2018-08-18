import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray, FormControl } from '@angular/forms';
import { ToastService } from '@shared/typescripts/pro/alerts';
import { IngredientsService } from '@core/services';
import { IIngredient, IIngredientDict } from '@shared/models';
import { FormatWidth } from '@angular/common';
import { of } from 'rxjs/observable/of'

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html'
})
export class IngredientsComponent implements OnInit
{
  ingredients = {};
  ingredientsArray: IIngredientDict[];
  duplicateIngredient:string = null;
  newIngredient:string = null;
  add = false;
  @Output() ingredientEmitter = new EventEmitter();

  constructor(private ingredientsService: IngredientsService,
              private fb: FormBuilder,
              private toastService: ToastService)
  {}

  ngOnInit ()
  {
    this.ingredients = {};
    this.ingredientsArray = [];
    this.ingredientsService.getIngredients()
    .subscribe(response => {
      this.ingredients = {};
      this.ingredientsArray = [];
      for (const key in response) {
        this.ingredients[key] = response[key];
        this.ingredientsArray.push({
          key: key,
          ingredient: response[key]
        })
      }
    })
  }

  private foundDuplicate(name: string):boolean {
    for (let ingredient in this.ingredients) {
      if(this.ingredients[ingredient].name.trim() === name.trim()) {
        return true
      }
    }
    return false;
  }

  addIngredient(name: string) {
    name = name.toLowerCase().trim();
    if (this.foundDuplicate(name)){
      this.duplicateIngredient = name;
      setTimeout(() => {
        this.duplicateIngredient = null;
      }, 3000);
    }
    else{
      this.ingredientsService.addIngredient({
        name: name
      })
      .then(response => {
        this.newIngredient = name;
        setTimeout(() => {
          this.newIngredient = null;
        }, 3000);
        this.ingredientEmitter.emit(name);
      }, reject => {
        console.log(reject);
      });
    }
  }

  updateIngredients() {
    this.ingredients = {};
    this.ingredientsArray.forEach(snap => {
      this.ingredients[snap.key] = snap.ingredient;
    })
    this.ingredientsService._updateIngredients(this.ingredients)
    .catch(error => {
      console.log(error);
    })
  }

  remove(ingredientId: string){
    this.ingredientsService.getIngredient(ingredientId)
    .on('value', snap => {
      snap.ref.remove();
    });
  }

  addToggle() {
    this.add = !this.add;
  }
}
