import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()

export default class firebaseService{

    constructor(private firestore: AngularFirestore){ }
    viewCollection(collectionName){
        return  this.firestore.collection(collectionName).valueChanges();
    }
    addCollection(collection, collectionName){
        return this.firestore.collection(collectionName).add(collection);
    }
    queryCollection(collectionName, query){
        return  this.firestore.collection(collectionName, query).snapshotChanges();
    }
    updateCollection(collectionName, update, oldDataId){
        return this.firestore.collection(collectionName).doc(oldDataId).set(update);
    }
    deleteItem(collectionName, itemKey){
       return this.firestore.collection(collectionName).doc(itemKey).delete();
    }
    getGreatestId(arr : any[]){
        arr.sort((a,b)=>{
          return a.id - b.id;
        })
        return arr[arr.length - 1].id;
      }
}