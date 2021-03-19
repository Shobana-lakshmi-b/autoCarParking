import { ServerCarDetails, CarDetail } from './parking.model';

export default class ParkingUtil {
  static convertToLocalCars(serverCars: ServerCarDetails, noOfCarsParked:number): CarDetail[] {
    const localCars = []
    for (let i = 1; i <= noOfCarsParked; i++) {
      const index = i % 5
      const serverCar = { ...serverCars['data'][index] }
      serverCar.slotNo = index == 0 ? '5' : i.toString();
      localCars.push(serverCar)
    }
    return localCars
  }

   static isDetailsValid(parkingSlot: number, noOfCars: number) : boolean {
      if (isNaN(parkingSlot) || isNaN(noOfCars) || parkingSlot < 1 || noOfCars < 0) {
        alert("Please provide valid details")
        return false
      }
      if (noOfCars > parkingSlot) {
        alert("Cars parked cannot be greater than parking slots")
        return false
      }
      if (parkingSlot > 9999999) {
        alert("Currently parking slots greater than 9999999 is not supported")
        return false
      }
      return true
    }

}
