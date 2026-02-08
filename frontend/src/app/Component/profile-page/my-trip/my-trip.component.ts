import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-trip',
  templateUrl: './my-trip.component.html',
  styleUrl: './my-trip.component.css'
})
export class MyTripComponent implements OnInit, OnChanges {
  @Input() bookings: any[] = [];
  upcomingTrips: any[] = [];
  completedTrips: any[] = [];
  cancelledTrips: any[] = [];
  activeTab: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnChanges() {
    this.categorizeTrips();
  }

  ngOnInit() {
    this.categorizeTrips();
  }

  categorizeTrips() {
    if (!this.bookings) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cancelled Trips
    this.cancelledTrips = this.bookings.filter(booking => booking.status === 'CANCELLED');

    // Upcoming Trips: Future date AND NOT cancelled
    this.upcomingTrips = this.bookings.filter(booking => {
      if (booking.status === 'CANCELLED') return false;
      const dDate = new Date(booking.departureDetails?.date || booking.bookingDate);
      dDate.setHours(0, 0, 0, 0);
      return dDate >= today;
    });

    // Completed Trips: Past date AND NOT cancelled
    this.completedTrips = this.bookings.filter(booking => {
      if (booking.status === 'CANCELLED') return false;
      const dDate = new Date(booking.departureDetails?.date || booking.bookingDate);
      dDate.setHours(0, 0, 0, 0);
      return dDate < today;
    });

  }

  shareExperience(booking: any) {
    // Navigate to experience sharing page with booking details
    this.router.navigate(['/share-experience'], { state: { booking } });
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.http.post(`http://localhost:5000/cancel/${bookingId}`, {}).subscribe({
        next: (updatedBooking: any) => {
          alert('Booking cancelled successfully.');
          // Update local state to reflect cancellation immediately
          const index = this.bookings.findIndex(b => b._id === bookingId);
          if (index !== -1) {
            this.bookings[index].status = 'CANCELLED';
            this.categorizeTrips();
          }
        },
        error: (err) => {
          console.error('Error cancelling booking', err);
          alert('Failed to cancel booking.');
        }
      });
    }
  }

  setActiveTab(tab: 'upcoming' | 'completed' | 'cancelled') {
    this.activeTab = tab;
  }
}



