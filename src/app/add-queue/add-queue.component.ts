import { Component, OnInit, OnDestroy } from '@angular/core';
import firebaseService from '../service/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptService } from '../service/crypt.service';

@Component({
  selector: 'app-add-queue',
  templateUrl: './add-queue.component.html',
  styleUrls: ['./add-queue.component.css']
})
export class AddQueueComponent implements OnInit, OnDestroy {

  addQueueForm = new FormGroup({
    queueName : new FormControl('', Validators.required),
    pinNumber : new FormControl('', Validators.required)
  });
  sublists: Subscription[] = [];
  constructor(private fire: firebaseService,private router: Router, private cryptService: CryptService) { }

  ngOnInit(): void {
  }

  addQueue(){
    if(this.addQueueForm.valid){
      let latestId;
      let previousQueue : [] = [];
  
      const sub = this.fire.viewCollection('location').subscribe((res: any)=>{
        //To prevent infinte loop as a result of subscribtion
        sub.unsubscribe();
        //Get the whole queue to count the list length and incerement on it to set the ID
        previousQueue = this.getPreviousQueue(res, previousQueue);
        //Get the latest ID to incerement on it
        latestId = this.fire.getGreatestId(previousQueue);
        //Build the queue object to push it on the collection
        let queue = {
          id:latestId +1,
          name: this.addQueueForm.value.queueName,
          pinNumber: this.addQueueForm.value.pinNumber
        };
       
        this.fire.addCollection(queue,'location').then(res=>{
          alert("Congratulations you have your queue! Here is the link please save it somewhere safe: virtualqueue.nourhananber.com/welcome/"+this.cryptService.encrypt(queue.id));
          this.router.navigate(['admin',this.cryptService.encrypt(queue.id)]);
        }).catch(err=>{
          console.log("Please try again! " + err);
        });
      })
      this.sublists.push(sub);
    }
  }

  getPreviousQueue(res , previousQueue){
    res.forEach(element=>{
      previousQueue.push(element);
    })
    return previousQueue;
  }

  getErrorMessage(formField) {
    if (formField.hasError('required')) {
      return 'You must enter a valid value';
    }
  }

  ngOnDestroy(){
    this.sublists.forEach(sub=>{
      !sub.closed && sub.unsubscribe();
    })
  }
  
}
