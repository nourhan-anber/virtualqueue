import { Component, OnInit, AfterViewInit } from '@angular/core';
import firebaseService from '../service/firebase.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit, AfterViewInit {

  userId : number;
  queueLength = 0;
  queueId;
  userIndex;
  queueDocKey;
  isLoading;
  constructor(private fireStoreService: firebaseService ,private route: ActivatedRoute, private router: Router) {   }

  ngOnInit(){
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.queueId= this.route.snapshot.paramMap.get('queueId');
    this.fireStoreService.queryCollection("queue", ref => ref.where('queueId', '==', this.queueId)).subscribe(res => {
      let queueIds = [];
      res.forEach((item: any)=>{
        let itemId = item.payload.doc.data();
        queueIds.push(itemId.id);
        if(itemId.id == this.userId){
          this.queueDocKey = item.payload.doc.id;
        }
       
      })
      
      queueIds.sort(function(a,b){return a - b});
      this.queueLength = queueIds.findIndex(index =>{return index >= this.userId;});
      if(this.queueLength < 0){
        alert("You are being dissmissed!");
        this.router.navigate(['welcome', this.queueId]);
      }
    });

    
  };
  ngAfterViewInit() {
    this.isLoading = false;
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
}
