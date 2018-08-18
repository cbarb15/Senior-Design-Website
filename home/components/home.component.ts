import { Component, OnInit } from '@angular/core';
import { PartyService, AuthService } from '@core/services';
import { IParty, IMember } from '@shared/models/party.model';
import { ToastService } from '@shared/typescripts/pro/alerts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit
{
  currentParty: IParty;
  uid: string;
  isCurrentPartyMember: boolean;
  allParties: IParty[];
  showOtherParties = false;
  currentPartyPlaceholder:string = 'Enter passcode...';
  partyMember: string[];

  constructor(private partyService: PartyService,
    private authService: AuthService,
    private toastService: ToastService) { }

  ngOnInit (): void
  {
    this.partyService.getCurrentPartyObservable()
      .subscribe(party =>
      {
        this.currentParty = party;
        this.uid = this.authService.currentUser();
        this.isCurrentPartyMember = this.isPartyMember();
        if (this.isCurrentPartyMember) this.currentPartyPlaceholder = 'Current Member';
        else this.currentPartyPlaceholder = 'Enter passcode...';
      });

    this.partyService.getPartiesObservable().subscribe(parties =>
    {
      this.partyMember = [];
      this.allParties = [];
      let index = 0;
      Object.keys(parties).forEach(key =>
      {
        let party = parties[ key ];
        party[ 'pid' ] = key;
        this.allParties.push(party);
        if (this.isMemberOf(party)) this.partyMember[index] = 'Current Member';
        else this.partyMember[index] = 'Enter passcode';
        index++;
      });
    });
  }

  isPartyMember (): boolean
  {
    return this.currentParty && this.currentParty.members &&
      Object.keys(this.currentParty.members).findIndex
        (id => this.uid.trim() === id.trim()) >= 0;
  }

  joinParty (index: number, passcode)
  {
    if (this.partyService.addMember(this.allParties[ index ].pid, this.currentParty.pid, this.uid, passcode.value))
      this.toastService.success('You have been added to the party!');
    else
      this.toastService.error('Invalid passcode!');
  }

  joinCurrentParty (passcode)
  {
    if (this.partyService.addMember(this.currentParty.pid, this.currentParty.pid, this.uid, passcode.value)){
      this.toastService.success('You have been added to the party!');
    }
    else
      this.toastService.error('Invalid passcode!');
  }

  isCurrentParty (party: IParty)
  {
    return party.pid.trim() === this.currentParty.pid.trim();
  }

  showOtherPartiesToJoin ()
  {
    this.showOtherParties = !this.showOtherParties;
  }

  isMemberOf (party: IParty)
  {
    if (party && party.members) return Object.keys(party.members).findIndex(key => this.uid === key) >= 0;
    return false;
  }

  leaveCurrentParty ()
  {
    this.partyService.removeMember(this.currentParty.pid, this.currentParty.pid, this.uid);
    this.toastService.success(`You have been removed from party ${ this.currentParty.name }.`);
  }

  leaveParty (index)
  {
    this.partyService.removeMember(this.allParties[ index ].pid, this.currentParty.pid, this.uid);
    this.toastService.success(`You have been removed from party ${ this.allParties[ index ].name }.`);
  }
}
