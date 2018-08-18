import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IngredientsService } from '@core/services/ingredients.service';

@Component({
  selector: 'app-recipe-ingredient',
  templateUrl: './recipe_ingredient.component.html',
  styleUrls: ['./recipe_ingredient.component.scss']
})
export class RecipeIngredientComponent implements OnInit {
  // public oz = 0;
  // private inputIngredient: string = '';
  // ingredients: any[];

  // public ingredients_model: string = '';

  optionsSelect: any[];
  @Output() IngredientChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private ingredientsService: IngredientsService) { }

  ngOnInit() {
  // this.getAllIngredients();  
  }

  // plusOz($event) {
  //   this.oz += 1.5;
  //   this.update(this.inputIngredient);
  // }

  // minusOz($event) {
  //   if (this.oz !== 0) {
  //     this.oz -= 1.5;
  //   }
  //   this.update(this.inputIngredient);
  // }

  // update(value: any) {
  //   this.inputIngredient = value;
  //   console.log(
  //     'recipe_ingredient ingredients list ' + this.ingredients.toString()
  //   );

  //   console.log(
  //     'recipe_ingredient name ' + this.inputIngredient + ' oz ' + this.oz
  //   );
  //   if (this.inputIngredient !== '' && this.oz !== 0) {
  //     let returnString = this.formatDrinkSlot(value);
  //     if (returnString !== null) {
  //       this.IngredientChanged.emit(returnString);
  //     }
  //   }
  // }

  // ingredientSelected($event) {
  //   console.log($event);
  // }

  // private getAllIngredients() {
  //   this.ingredientsService.getIngredients().subscribe(response => {
  //     this.optionsSelect = [];
  //     let index = 1;
  //     response.forEach(ingredient => {
  //       this.optionsSelect.push({
  //         value: index,
  //         label: ingredient.name
  //       })
  //     });
  //   });
  // }

  // private convertToPumps(value) {
  //   return value / 1.5;
  // }

  // private formatDrinkSlot(ingredient: string) {
  //   let json = {};
  //   let index = this.ingredients.indexOf(ingredient);
  //   if (index >= 0) {
  //     json = {
  //       amount: this.convertToPumps(this.oz),
  //       bottle: this.ingredients.indexOf(ingredient)
  //     };
  //   } else {
  //     throw new Error('invalid Ingredient!');
  //   }
  // }
}
