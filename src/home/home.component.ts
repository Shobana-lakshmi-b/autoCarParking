import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import ParkingUtil from './parking/parking.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  totalParkingSlots = '5';
  noOfCarsParked = '2';

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let parkingSlot = this.getParsedValues(this.totalParkingSlots)
    let noOfCars = this.getParsedValues(this.noOfCarsParked)

    if (!ParkingUtil.isDetailsValid(parkingSlot, noOfCars)) return

    this.router.navigate(['details'], { queryParams: { 'totalSlot': parkingSlot, 'parkedCars': noOfCars },relativeTo:this.route});
  }

  getParsedValues(num:string):number {
    return parseInt(num,10)
  }

}
