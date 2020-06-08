import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import firebaseService from '../service/firebase.service';
import { Subscription } from 'rxjs';
import { CryptService } from '../service/crypt.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  subLists: Subscription[] = [];

  queueId;
  queue;
  displayedColumns: string[] = ['name', 'phone', 'index', 'dismiss'];
  dataSource = [];
  branchTitle = "";
  ttemp = "";
  savedPinNumber;
  constructor(private router: ActivatedRoute, private fire: firebaseService, private cryptService: CryptService) {

  }

  ngOnInit(): void {
    this.queueId = this.cryptService.decrypt(this.router.snapshot.paramMap.get('queueId'));
    const sub = this.fire.queryCollection('location', ref => ref.where("id", "==", parseInt(this.queueId))).subscribe((loc: any) => {
      this.branchTitle = loc[0].payload.doc.data().name;
      //Validate the PIN the user entered
      if (this.validPin(loc[0].payload.doc.data().pinNumber)) {
        //Gets the Queue Data to fill the table
        this.pullQueueData();
      }
      sub.unsubscribe();
    });
    this.subLists.push(sub);
  }

  pullQueueData() {

    this.subLists.push(this.fire.queryCollection('queue', ref => ref.where("queueId", "==", this.queueId)).subscribe((res: any) => {
      this.setQueueDataSource(res);
    }));
  }

  setQueueDataSource(res) {
    this.queue = [];
    res.forEach(element => {
      this.queue.push(element.payload.doc);
    });
    this.queue.sort((a, b) => {
      return a.data().id - b.data().id;
    })
    this.dataSource = this.queue;
  }

  validPin(locationPin) {
    let pinNumber = prompt("Enter your PIN number: ", "5555");
    if (pinNumber == locationPin) {
      return true;
    }
    return false;
  }


  dismiss(q, event) {
    this.fire.deleteItem("queue", q.id).then(res => {
      const filterValue = (event.target as HTMLInputElement).value;
      // this.dataSource = this.queue;
      //this.dataSource.filter = filterValue.trim();
      alert("User has been dismissed successfully!");

    }).catch(err => {
      alert("Please try again. An Error occurred: " + err);
    })
  }

  ngOnDestroy() {
    this.subLists.forEach(sub => {
      !sub.closed && sub.unsubscribe();
    })
  }

  getQueueUrl() {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    return baseUrl + 'welcome/' + this.cryptService.encrypt(this.queueId);
  }

}
