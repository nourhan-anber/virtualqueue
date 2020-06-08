import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import firebaseService from '../service/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptService } from '../service/crypt.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})

export class WelcomeComponent implements OnInit, OnDestroy {

  welcomeForm = new FormGroup({
    username: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  });
  constructor(public fire: firebaseService, private route: ActivatedRoute, private router: Router, private cryptService:CryptService) { }

  queueId: string;
  locationTitle;
  subLists: Subscription[] = [];

  ngOnInit(): void {
    this.queueId = this.cryptService.decrypt(this.route.snapshot.paramMap.get('id'));
    //To get the location title
    this.subLists.push(this.fire.queryCollection("location", ref => ref.where('id', '==', parseInt(this.queueId))).subscribe((res: any) => {
      this.locationTitle = res[0].payload.doc.data().name;
    }));
  }

  inqueue() {
    if (this.welcomeForm.valid) {
      const sub = this.fire.viewCollection('queue').subscribe((res: any) => {
        //To stop the infinte loop
        sub.unsubscribe();
        //Build the customer object
        const customer = {
          id: this.fire.getGreatestId(res) + 1,
          name: this.welcomeForm.value.username,
          phone: this.welcomeForm.value.phoneNumber,
          queueId: this.queueId,
          status: "InQueue"
        }
        this.fire.addCollection(customer, 'queue');

        this.router.navigate(['queue', this.cryptService.encrypt(customer.id), this.cryptService.encrypt(this.queueId)]);
      })
      this.subLists.push(sub);
    }
    else {
      document.getElementById('alert').innerHTML = "Please try again with valid Name and Phone number";
    }
  }

  getErrorMessage(formField) {
    if (formField.hasError('required')) {
      return 'You must enter a valid value';
    }
  }

  ngOnDestroy() {
    this.subLists.forEach(sub => {
      !sub.closed && sub.unsubscribe();
    })
  }
}