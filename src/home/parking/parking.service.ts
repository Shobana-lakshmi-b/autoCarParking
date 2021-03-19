import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ParkingService {

  constructor(private http:HttpClient) {}

  fetchParkedCars() {
    return this.http.get("./assets/parking-details.json").toPromise()
  }

}
