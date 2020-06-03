import { Component, OnInit } from '@angular/core';
import firebaseService from '../service/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-queue',
  templateUrl: './add-queue.component.html',
  styleUrls: ['./add-queue.component.css']
})
export class AddQueueComponent implements OnInit {

  addQueueForm = new FormGroup({
    queueName : new FormControl('', Validators.required)
  })
  constructor(private fire: firebaseService,private router: Router) { }

  ngOnInit(): void {
  }

  addqueue(){
    let latestId;

    let previousQueue;

    const sub = this.fire.viewCollection('location').subscribe((res: any)=>{
      sub.unsubscribe();
      previousQueue = [];
      res.forEach(element=>{
        
        previousQueue.push(element);
      })
      
      latestId = this.fire.getGreatestId(previousQueue);
      console.log(latestId);
      let queue = {
        id:latestId +1,
        name: this.addQueueForm.value.queueName
      };
     
      this.fire.addCollection(queue,'location').then(res=>{
        alert("Congratulations you have your queue! please keep your ID in handy. ID = "+queue.id);
        this.router.navigate(['admin',queue.id]);
      }).catch(err=>{
        console.log("Please try again! " + err);
      });
    })

  }
  getErrorMessage(formField) {
    if (formField.hasError('required')) {
      return 'You must enter a valid value';
    }
  }
  
}
