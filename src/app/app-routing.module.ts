import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueueComponent } from './queue/queue.component';
import { AuthGuard } from './page-guard/auth-guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { AdminComponent } from './admin/admin.component';
import { AddQueueComponent } from './add-queue/add-queue.component';


const routes: Routes = [
  { path: '', redirectTo : 'welcome/0', pathMatch: 'full'},
  { path: 'welcome/:id', component: WelcomeComponent},
  { path: 'queue/:id/:queueId', component: QueueComponent},
  { path:'admin/:queueId', component: AdminComponent},
  { path: 'admin', component: AddQueueComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
