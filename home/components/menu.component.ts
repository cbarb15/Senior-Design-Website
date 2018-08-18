import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Event } from '@angular/router/src/events';
import { OrderService, MenuService } from '../../../core/services';
import { Observable } from 'rxjs/Observable';
import { DrinkComponent } from '../../../shared/components/drink.component';
import { CarouselComponent, CarouselConfig } from '../../../shared/typescripts/free'
import { IDrink } from '@shared/models';
import { IBottle } from '@shared/models/bottle.model';
import { PartyService } from '@core/services/party.service';
import { IParty } from '@shared/models/party.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss' ]
})
export class MenuComponent implements OnInit
{
  drinks: IDrink[] = [];
  keywords: String[];
  visible: boolean;
  lastIndex: number;
  selected: number = null;
  bottles: IBottle[];
  party: IParty;

  @ViewChild('carousel') car: CarouselComponent;

  constructor(private menuService: MenuService, private partyService: PartyService) { }

  ngOnInit ()
  {
    this.menuService.getAllDrinks().subscribe(drinks => {
      this.drinks = drinks
    });
    this.partyService.getCurrentPartyObservable().subscribe(party => {
      if (party){
        this.party = party;
        this.keywords = party.Bottles.map((bottle) => bottle.name);
        this.bottles = party.Bottles;
      }
      else {
        this.keywords = [];
        this.bottles = [];
      }
    });

    this.lastIndex = -1;
  }

  onKeywordClicked (index)
  {
    this.menuService.getAllDrinks(this.bottles[index].ingredientId).subscribe(drinks => {
      this.drinks = drinks
    });
    this.selected = index;
  }

  getDrinkName (event)
  {
    return event.target.id;
  }

  toggleView (index)
  {
    if (index === this.lastIndex || this.lastIndex === -1)
    {
      this.visible = !this.visible;
    }
    else
    {
      this.visible = true;
    }
    this.lastIndex = index;
  }
}
