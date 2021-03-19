import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ParkingService } from './parking.service';
import { CarDetail, ServerCarDetails } from './parking.model'
import ParkingUtil from './parking.util';

const DEFAULT_COLOR_LABEL = 'Choose color'

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.css']
})


export class ParkingComponent implements OnInit {
  noOfCarsParked: number = 0;
  amountCollected: number = 0
  totalParkingSlots: number = 1;
  availableSlots: number = 1

  selectedColor: string = DEFAULT_COLOR_LABEL
  selectedRegNo: string = ''
  newCarRegNo: string = ''
  newCarColor: string = ''
  lastOperation: '' | 'ADD' | 'REMOVE' = ''

  parkedCarColors: string[] = []
  selectedCar: CarDetail = new CarDetail;
  parkedCars: CarDetail[] = []
  parkedCarsClone: CarDetail[] = [];
  numberPlateRegex: RegExp = /^[A-Z]{2}[-][0-9]{1,2}[-][A-Z]{1,2}[-][0-9]{3,4}$/

  constructor(private route: ActivatedRoute, private service: ParkingService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.totalParkingSlots = +params['totalSlot'];
      this.noOfCarsParked = +params['parkedCars']
      this.validateRouteParams()
    })
  }

  validateRouteParams() {
    if (!ParkingUtil.isDetailsValid(this.totalParkingSlots, this.noOfCarsParked)) {
      this.router.navigate(['home'])
      return
    }
    this.updateCarDetails()
  }

  updateCarDetails() {
    this.availableSlots = this.totalParkingSlots - this.noOfCarsParked
    this.service.fetchParkedCars().then(response => {
      const serverCars = <ServerCarDetails>response
      this.parkedCars = ParkingUtil.convertToLocalCars(serverCars, this.noOfCarsParked)
      this.parkedCarsClone = [...this.parkedCars]
    })
  }

  addNewCar() {
    if (!this.isCarDetailsValid()) return
    const newCar = this.getNewCarDetail()
    this.parkedCars.push(newCar)
    this.parkedCarsClone.push(newCar)
    this.newCarRegNo = this.newCarColor = ''
    this.selectedCar = newCar
    this.lastOperation = 'ADD'
    this.decrementAvailableSlot()
    this.filterCars()
  }

  isCarDetailsValid(): boolean {
    if (!this.newCarRegNo || !this.newCarColor) {
      alert("Provide car number and color")
      return false
    }
    if (!this.numberPlateRegex.test(this.newCarRegNo.toUpperCase().trim())) {
      alert("Car number is not valid,It should be in format KA-00-AZ-0000 ")
      return false
    }
    return true
  }

  getNewCarDetail() {
    const newCar = new CarDetail
    newCar.carNumber = this.newCarRegNo.toUpperCase().trim()
    newCar.color = this.newCarColor = this.newCarColor.charAt(0).toUpperCase() + this.newCarColor.slice(1)
    newCar.date = (new Date()).toString()
    newCar.slotNo = this.getAvailableSlotNumber()
    return newCar
  }

  getAvailableSlotNumber(): string {
    const usedSlots = this.parkedCarsClone.map(car => car.slotNo)
    let slot = 1
    while (slot <= this.totalParkingSlots) {
      if (!usedSlots.find(usedSlot => usedSlot == slot.toString())) {
        break
      }
      slot++
    }
    return slot.toString()
  }

  decrementAvailableSlot() {
    this.availableSlots -= 1;
  }

  filterCars() {
    let filteredDetails: CarDetail[] = [...this.parkedCarsClone]
    if (this.selectedRegNo) {
      filteredDetails = filteredDetails.filter(car => car.carNumber == this.selectedRegNo)
    }
    if (this.selectedColor != '' && this.selectedColor != DEFAULT_COLOR_LABEL) {
      filteredDetails = filteredDetails.filter(car => car.color == this.selectedColor)
    }
    this.parkedCars = filteredDetails
  }

  removeCar(selectedCar: CarDetail) {
    this.parkedCars = this.parkedCars.filter(car => car != selectedCar)
    this.parkedCarsClone = this.parkedCarsClone.filter(car => car.slotNo != selectedCar.slotNo)
    this.amountCollected += 20
    this.selectedCar = selectedCar
    this.lastOperation = 'REMOVE'
    this.incrementAvailableSlot()
  }

  incrementAvailableSlot() {
    this.availableSlots += 1;
  }

  updateColor(color: string) {
    this.selectedColor = color
  }

  closeAlert() {
    this.lastOperation = '';
  }

  resetFilterSearch() {
    this.selectedColor = ''
    this.selectedRegNo = ''
    this.parkedCars = [...this.parkedCarsClone]
  }

  query() {
    this.amountCollected = 0
    this.selectedColor = ''
    this.selectedRegNo = ''
    this.lastOperation = ''
    this.updateCarDetails()
  }

  updateColorOptions() {
    this.parkedCarColors = [DEFAULT_COLOR_LABEL, ...this.getParkedCarColors()]
  }

  getParkedCarColors(): string[] {
    let filterFrom: CarDetail[] = this.parkedCarsClone
    if (this.selectedRegNo) {
      filterFrom = this.parkedCarsClone.filter(car => car.carNumber == this.selectedRegNo)
    }
    const carColours = filterFrom.map(x => x.color)
    return carColours.filter((item, index) => {
      return carColours.indexOf(item) == index;
    })
  }


}
