import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';

import { AngularFirestore } from '@angular/fire/firestore'; 
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import firebaseService from './service/firebase.service';
import { AuthGuard } from './page-guard/auth-guard';
import { WelcomeComponent } from './welcome/welcome.component';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { AdminComponent } from './admin/admin.component';
import {MatCardModule} from '@angular/material/card';
import { AddQueueComponent } from './add-queue/add-queue.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const config = {
  apiKey: "AIzaSyCNC0UZrNrDQvDRrzBN1QdrhXmrAxWVtYk",
  authDomain: "queueingsystem-f0b9f.firebaseapp.com",
  databaseURL: "https://queueingsystem-f0b9f.firebaseio.com",
  projectId: "queueingsystem-f0b9f",
  storageBucket: "queueingsystem-f0b9f.appspot.com",
  messagingSenderId: "818198638664",
  appId: "1:818198638664:web:79af2b7db0bf256e9e287d",
  measurementId: "G-S0Y7QTXL0N"
};

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    WelcomeComponent,
    AdminComponent,
    AddQueueComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [AngularFirestore, firebaseService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
