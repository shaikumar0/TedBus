import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-ticket-page',
    templateUrl: './ticket-page.component.html',
    styleUrls: ['./ticket-page.component.css']
})
export class TicketPageComponent implements OnInit {
    bookingDetails: any;

    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        this.bookingDetails = navigation?.extras.state?.['booking'];
    }

    ngOnInit(): void {
        if (!this.bookingDetails) {
            // Fallback or redirect if accessed directly without state
            console.warn('No booking details found in state');
            // For development/demo, we might want to show dummy data or redirect
            // this.router.navigate(['/']); 
        }
    }

    shareExperience() {
        this.router.navigate(['/share-experience'], { state: { booking: this.bookingDetails } });
    }

    goHome() {
        this.router.navigate(['/']);
    }
}
