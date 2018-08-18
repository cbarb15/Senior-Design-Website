import { Component, OnInit, Input } from '@angular/core';
import { PartyService, AuthService } from '@core/services';
import { IParty, IMember, IPartyOption } from '@shared/models/party.model';
import { IBottle } from '@shared/models';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray, FormControl } from '@angular/forms';
import { of } from 'rxjs/Observable/of';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToastService } from '@shared/typescripts/pro/alerts';

@Component({
    selector: 'app-party',
    templateUrl: './party.component.html',
    styleUrls: [ './party.component.scss' ]
})
export class PartyComponent implements OnInit
{
    NUM_BOTTLES = 9;
    NAME_REGEX = '^([A-Za-z0-9]|\\s)*$';
    partyForm: FormGroup;
    partyEntryForm: FormGroup;
    pid: string;
    hostId: string;
    partyOptions: IPartyOption[];
    selectedOption: number;
    pid$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    bottlesVerified = false;
    partyOn = false;
    currentPid$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    currentParty: IParty = null;

    constructor(private partyService: PartyService,
        private authService: AuthService,
        private fb: FormBuilder,
        private toastService: ToastService) { }

    ngOnInit (): void
    {
        this.partyService.getCurrentPartyObservable()
            .subscribe(response =>
            {
                this.partyOn = response ? true : false;
                this.currentParty = response;
                if (this.partyOn) this.currentPid$.next(response.pid);
                else this.currentPid$.next('');
            });
        this.hostId = this.authService.currentUser();
        this.authService.getPartiesHosting()
            .subscribe(response =>
            {
                this.partyOptions = [];
                let index = 1;
                for (let pid in response)
                {
                    this.partyOptions.push({
                        label: response[ pid ],
                        partyId: pid,
                        value: index
                    });
                    if (this.pid && this.pid.trim() === pid.trim())
                        this.selectedOption = index;

                    index++;
                }
            });

        this.partyEntryForm = this.fb.group({
            name: [ '', [
                Validators.pattern(this.NAME_REGEX),
                Validators.required ] ],
            passCode: [ '', [
                Validators.required,
                Validators.minLength(6) ] ]
        });
    }

    getParty ()
    {
        if (this.selectedOption)
        {
            let index = this.selectedOption - 1;
            this.setPid(this.partyOptions[ index ].partyId);
            this.initPartyForm();
        }
    }

    setPid (pid: string)
    {
        this.pid = pid;
        this.pid$.next(this.pid);
    }

    initPartyForm ()
    {
        this.partyService.getPartyObservable(this.pid)
            .subscribe(response =>
            {
                let members: { memberId: string, name: string }[] = [];
                if (response.members)
                {
                    Object.keys(response.members).forEach(key =>
                    {
                        members.push({
                            name: response.members[ key ],
                            memberId: key
                        });
                    });
                }

                this.bottlesVerified = this.verifyBottles(response.Bottles);
                this.partyForm = this.fb.group({
                    name: [ response.name, [
                        Validators.pattern(this.NAME_REGEX),
                        Validators.required ] ],
                    passCode: [ response.passCode ],
                    members: this.fb.array(members),
                    pid: [ this.pid ],
                    Bottles: [ response.Bottles ],
                    hostId: [ response.hostId ]
                });
            });
    }
    initBottles (): IBottle[]
    {
        let bottle: IBottle = {
            amount_left: 0,
            ingredientId: '',
            name: '',
        };
        let bottles: IBottle[] = [];
        for (let i = 0; i < this.NUM_BOTTLES; i++) bottles.push(bottle);
        return bottles;
    }

    createParty (): void
    {
        let party: IParty = {
            name: this.partyEntryForm.get('name').value,
            Bottles: this.initBottles(),
            hostId: this.hostId,
            passCode: this.partyEntryForm.get('passCode').value
        }

        this.partyService.createParty(party).then(response =>
        {
            this.setPid(response.key);
            this.authService.addPartyIdToHost(response.key, party.name);
            setTimeout(() =>
            {
                this.initPartyForm();
            }, 100);
        });
    }

    verifyBottles (bottles: IBottle[])
    {
        let isComplete = true;
        bottles.forEach(bottle =>
        {
            if (!bottle.name)
            {
                isComplete = false;
                return;
            }
        });
        return isComplete;
    }

    turnOnParty ()
    {
        let party: IParty = this.partyForm.value;
        party.members = {};
        this.members.controls.forEach(member =>
            party.members[ member.value.memberId ] = member.value.name
        );

        if (this.verifyBottles(party.Bottles))
        {
            this.partyService.setCurrentParty(party, this.pid)
                .then(response =>
                {
                    this.toastService.success('Your party has been started!');
                })
                .catch(error => this.toastService.error(error));
        }
        else
        {
            console.log('not verified');
        }
    }

    turnOffParty()
    {
        this.partyService.turnCurrentPartyOff()
            .then(response => this.toastService.success('The party has been turned off'))
            .catch(error => this.toastService.error(error));
    }

    updateParty ()
    {
        if (this.partyOn && this.pid.trim() === this.currentParty.pid.trim())
        {
            this.partyService.setCurrentParty(this.partyForm.value, this.pid);
        }
        this.partyService.getParty(this.pid).set(this.partyForm.value)
        .then(response => this.toastService.success('The party has been updated.'))
        
        this.authService.addPartyIdToHost(this.partyForm.value.pid, this.partyForm.value.name);
    }

    get members ()
    {
        return this.partyForm.get('members') as FormArray;
    }
}
