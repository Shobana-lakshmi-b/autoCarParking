import { Component, Input, Output ,EventEmitter} from '@angular/core';

import { CarDetail } from '../parking.model';

@Component({
  selector: 'app-parking-table',
  templateUrl: './parking-table.component.html',
  styleUrls: ['./parking-table.component.css']
})

export class ParkingTableComponent {
  @Input('parkedCars') tableValue:CarDetail[] = []
  @Output() removeSelected = new EventEmitter

  constructor() { }

  removeCar(selectedCar:CarDetail) {
    this.removeSelected.emit(selectedCar)
  }

}
