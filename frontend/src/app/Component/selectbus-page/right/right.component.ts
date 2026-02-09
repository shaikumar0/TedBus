import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from '../../../service/bus.service';
import { Bus } from '../../../model/bus.model';
import { Route } from '../../../model/routes.model';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrl: './right.component.css'
})
export class RightComponent implements OnInit {
  matchedbus: Bus[] = []
  routes: Route[] = []
  seats: { [key: string]: any } = {}


  departurevar: string = ''
  arrival: string = ''
  date: string = ''

  constructor(private route: ActivatedRoute, private busservice: BusService) { }

  getkeys() {
    return Object.keys(this.seats)
  }
  isBusFound: boolean = true;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.departurevar = params['departure'];
      this.arrival = params['arrival'];
      this.date = params['date'];

      this.fetchBuses();
    });
  }

  fetchBuses() {
    this.isLoading = true;
    this.busservice.GETBUSDETAILS(this.departurevar, this.arrival, this.date).subscribe({
      next: (response: any) => {
        this.matchedbus = response.matchedBuses;
        this.routes = response.route;
        this.seats = response.busidwithseatobj;
        this.isLoading = false;

        if (this.matchedbus.length === 0) {
          this.isBusFound = false;
        } else {
          this.isBusFound = true;
        }
      },
      error: (err) => {
        console.error("Error fetching buses", err);
        this.isLoading = false;
        this.isBusFound = false;
        this.matchedbus = [];
      }
    });
  }

}
