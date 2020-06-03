import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import firebaseService from '../service/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})

export class WelcomeComponent implements OnInit , AfterViewInit {

  welcomeForm = new FormGroup({
    username: new FormControl( '', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  });
  constructor(public fire: firebaseService,  private route: ActivatedRoute, private router: Router) { }

   queueId : string;
   locationTitle;
   isLoading: boolean;
  ngOnInit(): void {
    this.queueId = this.route.snapshot.paramMap.get('id');
    this.fire.queryCollection("location", ref => ref.where('id', '==', parseInt(this.queueId))).subscribe((res: any)=>{
      this.locationTitle = res[0].payload.doc.data().name;
    });
    this.isLoading = true;
  }

  inqueue(){
    if(this.welcomeForm.valid){   

      const sub = this.fire.viewCollection('queue').subscribe((res: any )=>{
        sub.unsubscribe();
        
        const customer = {
          id: this.fire.getGreatestId(res)+1,
          name: this.welcomeForm.value.username,
          phone: this.welcomeForm.value.phoneNumber,
          queueId: this.queueId,
          status: "InQueue"
        }   
        this.fire.addCollection(customer, 'queue');
        
        this.router.navigate(['queue',customer.id, this.queueId]);
      })
    }
    else{
      document.getElementById('alert').innerHTML = "Please try again with valid Name and Phone number";
    }
  }
  getErrorMessage(formField) {
    if (formField.hasError('required')) {
      return 'You must enter a valid value';
    }
  }
  ngAfterViewInit() {
    this.isLoading = false;
}

}