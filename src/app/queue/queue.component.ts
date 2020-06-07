import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import firebaseService from '../service/firebase.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit, OnDestroy {

  userId : number;
  queueLength = 0;
  queueId;
  userIndex;
  queueDocKey;
  
  subLists : Subscription[] = [];
  constructor(private fireStoreService: firebaseService ,private route: ActivatedRoute, private router: Router) {   }

  ngOnInit(){
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.queueId= this.route.snapshot.paramMap.get('queueId');
    this.subLists.push(this.fireStoreService.queryCollection("queue", ref => ref.where('queueId', '==', this.queueId)).subscribe(res => {
      //Get all the IDs on the queue to get the index of the user
      let queueIds = this.getSortedIds(res);
      //Search for the user ID in all the IDs on the queue
      this.queueLength = queueIds.findIndex(index =>{return index >= this.userId;});
      //Checks if the ID exists and if it is not exists then the admin would dismissed the user 
      if(this.queueLength < 0){
        alert("You are being dissmissed!");
        this.router.navigate(['welcome', this.queueId]);
      }
    }));
  }

  getSortedIds(res){
    let queueIds = [];
    res.forEach((item: any)=>{
      let itemId = item.payload.doc.data();
      queueIds.push(itemId.id);
      if(itemId.id == this.userId){
        this.queueDocKey = item.payload.doc.id;
      }
    })
    return queueIds.sort(function(a,b){return a - b});
  }

  dequeue(){
    this.fireStoreService.deleteItem('queue',this.queueDocKey).then(res=> {
      alert(`You're out of the line. You can go now!`)
      this.router.navigate(['welcome', this.queueId]);
  }).catch(error=> {
      alert(`Error removing you: `+ error);
  });
  this.router.navigate(['welcome', this.queueId]);
  }

  ngOnDestroy(){
    this.subLists.forEach(sub=>{
      !sub.closed && sub.unsubscribe();
    })
  }
}
