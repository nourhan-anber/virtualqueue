import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import firebaseService from '../service/firebase.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  queueId;
  queue;
  displayedColumns: string[] = ['name', 'phone', 'index', 'dismiss'];
  dataSource;
  branchTitle="";
  constructor(private router: ActivatedRoute,private fire: firebaseService) {

   }

  ngOnInit(): void {
    this.queueId = this.router.snapshot.paramMap.get('queueId');
    this.fire.queryCollection('queue', ref=>ref.where("queueId", "==", this.queueId)).subscribe((res:any)=>{
      this.queue = [];
      res.forEach(element => {
        this.queue.push(element.payload.doc);
      });
      this.queue.sort((a,b)=>{
        return a.data().id -b.data().id;
      })
      console.log(this.queue);
      this.dataSource = this.queue;
    }
    );
    this.fire.queryCollection('location', ref=>ref.where("queueId", "==", this.queueId)).subscribe((res:any)=>{
      this.branchTitle = res[0].payload.doc.data().name;
    })
  }
  dismiss(q,event){
    this.fire.deleteItem("queue",q.id).then(res=>{
      const filterValue = (event.target as HTMLInputElement).value;
     // this.dataSource = this.queue;
      //this.dataSource.filter = filterValue.trim();
      alert("User has been dismissed successfully!");

    }).catch(err=>{
      alert("Please try again. An Error occurred: " + err);
    })
  }

}
