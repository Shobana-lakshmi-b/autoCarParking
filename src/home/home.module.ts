import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { ParkingComponent } from './parking/parking.component';
import { ParkingService} from './parking/parking.service';
import { ParkingTableComponent } from './parking/parking-table/parking-table.component';

export const homePageRoutes: Routes = [
  { path: '', component: HomeComponent,pathMatch:'full' },
  { path: 'details', component: ParkingComponent }
]

@NgModule({
  declarations: [
    HomeComponent,
    ParkingComponent,
    ParkingTableComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(
    homePageRoutes
  ),
],
  providers: [ParkingService],
})
export class HomeModule { }
