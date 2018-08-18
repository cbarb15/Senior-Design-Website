import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, ProfileService, UploadService } from '@core/services';
import { Observable } from 'rxjs/Observable';
import { AngularFireObject } from 'angularfire2/database';
import { IUser } from '@feature/auth/models';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: [ './profile-details.component.scss' ]
})
export class ProfileDetailsComponent implements OnInit 
{

  // Profile Details Form
  form: FormGroup;

  // Default image for profile pictures
  imgSrc: string = '../../assets/images/ninja_avatar.png';

  // AngularFireObject used for updating the database.
  angularFireProfile: AngularFireObject<any>;

  // AngularFireObservable used for getting the profile
  // details from the firebase database.
  angularFireProfileObservable$: Observable<any>;

  constructor(
    private sAuthentication: AuthService,
    private formBuilder: FormBuilder,
    private sProfile: ProfileService,
    private sUpload: UploadService
  ) { }

  /**
   * Initializes the profile forms and connects them with the database.
   */
  ngOnInit (): void
  {
    // Initialize the form.
    this.form = this.formBuilder.group(
      {
        displayName: [ '' ],
        firstName: [ '' ],
        lastName: [ '' ],
        phoneNumber: [ '' ],
        email: [ '', Validators.email ],
        photoUrl: [ '' ]
      }
    );

    // Get an AngularFireObject for updating the database and an Observable
    // to be able to subscribe and extract the value from the database.
    let tuple = this.sProfile.getProfile();
    this.angularFireProfile = tuple[ 0 ];
    this.angularFireProfileObservable$ = tuple[ 1 ];

    // Subscribe and get the values from the database and update the form.
    this.angularFireProfileObservable$
      .subscribe((obj: IUser) =>
      {
        this.form.patchValue(obj, { emitEvent: false });

        // Make sure the profile has a photoUrl. If not, use the default image.
        if (obj.photoUrl !== undefined)
          this.imgSrc = obj.photoUrl
      });


    // Everytime the form is changed this will update the database.
    this.form.valueChanges
      .subscribe(() =>
      {
        // Use profile service to update the database with the form value.
        if (this.form.valid)
          this.sProfile.updateProfile(this.angularFireProfile, this.form.value);
          // else console.log('invalid form: ', this.form);
      });
  }

  /**
   * Receives an event when image upload is finished and patches the image downloadURL for the image.
   * @param downloadURL 
   */
  imageUploadDone (downloadURL: string): void
  {
    this.imgSrc = downloadURL;
    this.form.patchValue({ photoUrl: downloadURL });
  }
}
