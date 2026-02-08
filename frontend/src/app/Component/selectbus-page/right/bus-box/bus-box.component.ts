import { Component, Input, OnInit } from '@angular/core';
import { ExperienceService } from '../../../../service/experience.service';

@Component({
  selector: 'app-bus-box',
  templateUrl: './bus-box.component.html',
  styleUrl: './bus-box.component.css'
})
export class BusBoxComponent implements OnInit {
  @Input() rating: number[] = [];
  @Input() operatorname: string = ''
  @Input() bustype: string = ''
  @Input() departuretime: string = ""
  @Input() reschedulable: number = 0
  @Input() livetracking: number = 0
  @Input() filledseats: any[] = []
  @Input() routedetails: any
  @Input() busid: string = ''
  @Input() date: string = ''


  avgrating: number = 0
  totalreview: number = 0
  seatprivce: number = 0
  bustypename: string = ''
  busdeparturetime: number = 0;
  busarrivaltime: number = 0

  showReviews: boolean = false;
  reviews: any[] = [];

  constructor(private experienceService: ExperienceService) { }

  ngOnInit(): void {
    // First calculate based on hardcoded ratings if any
    if (this.rating && this.rating.length > 0) {
      let sum = 0;
      this.rating.forEach((item) => {
        sum += item;
      });
      this.avgrating = sum / this.rating.length;
      this.totalreview = this.rating.length;
    }

    // Then fetch real reviews from DB
    if (this.routedetails && this.routedetails._id) {
      console.log("Fetching reviews for route:", this.routedetails._id);
      this.experienceService.getRouteReviews(this.routedetails._id).subscribe({
        next: (res) => {
          console.log("Reviews response:", res);
          if (res.success && res.data.totalReviews > 0) {
            // If we have real DB reviews, we use them instead of hardcoded ones
            this.avgrating = res.data.averageRating;
            this.totalreview = res.data.totalReviews;
            this.reviews = res.data.reviews;
          }
        },
        error: (err) => console.error("Error fetching route reviews:", err)
      });
    }

    if (this.bustype === 'standard') {
      this.seatprivce = 50 * Math.floor(this.routedetails.duration) / 2;
      this.bustypename = 'standard;'
    } else if (this.bustype === 'sleeper') {
      this.seatprivce = 100 * Math.floor(this.routedetails.duration) / 2;
      this.bustypename = 'sleeper;'
    } else if (this.bustype === 'A/C Seater') {
      this.seatprivce = 125 * Math.floor(this.routedetails.duration) / 2;
      this.bustypename = 'A/C Seater;'
    } else {
      this.seatprivce = 75 * Math.floor(this.routedetails.duration) / 2;
      this.bustypename = 'Non - A/C;'
    }
    const numericvalue = parseInt(this.departuretime, 10);
    this.busdeparturetime = numericvalue
    this.busarrivaltime = (numericvalue + this.routedetails.duration) % 24;
  }

  toggleReviews() {
    this.showReviews = !this.showReviews;
    console.log("Toggle reviews:", this.showReviews);
  }
}

