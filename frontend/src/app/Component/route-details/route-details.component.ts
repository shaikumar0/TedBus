
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../service/experience.service';
import { BusService } from '../../service/bus.service';
import { CustomerService } from '../../service/customer.service';

@Component({
    selector: 'app-route-details',
    templateUrl: './route-details.component.html',
    styleUrls: ['./route-details.component.css']
})
export class RouteDetailsComponent implements OnInit {
    routeId: string = '';
    reviews: any[] = [];
    averageRating: number = 0;
    totalReviews: number = 0;

    // Dummy route info for now as we might not have an endpoint to fetch just route details by ID easily without a bus
    // In a real scenario, we would have a RouteService to fetch route details.
    routeInfo: any = {
        name: 'Loading...',
        description: 'Route details loading...',
        source: '',
        destination: '',
        path: [] // Array of {lat, lng}
    };

    newReview = {
        rating: 5,
        story: '',
        source: '',
        destination: ''
    };

    isSubmitting: boolean = false;
    selectedFiles: File[] = [];
    previewUrls: string[] = [];
    currentUser: any = null;

    private map: any;

    constructor(
        private route: ActivatedRoute,
        private experienceService: ExperienceService,
        private customerservice: CustomerService
    ) { }

    ngOnInit(): void {
        this.customerservice.user$.subscribe(user => {
            this.currentUser = user;
        });

        this.route.params.subscribe(params => {
            this.routeId = params['routeId'];
            if (this.routeId) {
                this.fetchReviews();
                // Here we could also fetch route details if we had an endpoint
                // simulating a fetch for route path
                // simulating a fetch for route path with dummy data for now until backend is fully hooked up with real data
                // In a real app, this would come from the route service
                this.routeInfo.path = [
                    { lat: 12.9716, lng: 77.5946 }, // Bangalore
                    { lat: 12.2958, lng: 76.6394 }, // Mysore
                    { lat: 11.4102, lng: 76.6913 }, // Ooty
                ];
                setTimeout(() => {
                    this.initMap();
                }, 100);
            }
        });

        // Extract query params for source/dest if passed
        this.route.queryParams.subscribe(params => {
            if (params['source']) this.routeInfo.source = params['source'];
            if (params['destination']) this.routeInfo.destination = params['destination'];
            this.newReview.source = this.routeInfo.source;
            this.newReview.destination = this.routeInfo.destination;

            if (this.routeInfo.source && this.routeInfo.destination) {
                this.routeInfo.name = `${this.routeInfo.source} to ${this.routeInfo.destination}`;
                this.routeInfo.description = `Bus route from ${this.routeInfo.source} to ${this.routeInfo.destination}`;
            }
        });
    }

    initMap(): void {
        // Fix for Leaflet default icon issues in Webpack/Angular
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        // Check if map already exists
        if (this.map) {
            this.map.remove();
        }

        // Using Bangalore as a default center if path is empty, though in init() we check for path length
        const defaultCenter: L.LatLngExpression = this.routeInfo.path.length > 0
            ? [this.routeInfo.path[0].lat, this.routeInfo.path[0].lng]
            : [12.9716, 77.5946];

        this.map = L.map('map').setView(defaultCenter, 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        if (this.routeInfo.path && this.routeInfo.path.length >= 2) {
            // Use the start and end points from the path for routing
            const waypoints = [
                L.latLng(this.routeInfo.path[0].lat, this.routeInfo.path[0].lng),
                // Add intermediate waypoints if any (excluding start and end)
                ...this.routeInfo.path.slice(1, -1).map((p: any) => L.latLng(p.lat, p.lng)),
                L.latLng(this.routeInfo.path[this.routeInfo.path.length - 1].lat, this.routeInfo.path[this.routeInfo.path.length - 1].lng)
            ];

            // Fallback Polyline (Red Dashed) - Shows direct path immediately
            const latLngs = this.routeInfo.path.map((p: any) => [p.lat, p.lng]);
            const fallbackPolyline = L.polyline(latLngs, {
                color: 'red',
                weight: 2,
                dashArray: '5, 10',
                opacity: 0.5
            }).addTo(this.map);
            this.map.fitBounds(fallbackPolyline.getBounds(), { padding: [50, 50] });

            (L.Routing as any).control({
                waypoints: waypoints,
                routeWhileDragging: false,
                show: false, // Hide the itinerary instructions
                addWaypoints: false, // Disable adding new waypoints by dragging
                fitSelectedRoutes: true,
                lineOptions: {
                    styles: [{ color: 'blue', opacity: 0.8, weight: 6 }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 100
                }
            })
                .on('routesfound', (e: any) => {
                })
                .on('routingerror', (e: any) => {
                    console.error('Routing error:', e);
                })
                .addTo(this.map);
        }
    }


    fetchReviews() {
        this.experienceService.getRouteReviews(this.routeId).subscribe({
            next: (res) => {
                if (res.success) {
                    this.reviews = res.data.reviews;
                    this.averageRating = res.data.averageRating;
                    this.totalReviews = res.data.totalReviews;
                }
            },
            error: (err) => console.error('Error fetching reviews:', err)
        });
    }

    onFileSelected(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFiles = Array.from(event.target.files);
            this.previewUrls = [];

            for (let file of this.selectedFiles) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.previewUrls.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }


    submitReview() {
        if (!this.newReview.story) {
            alert('Please write a review story.');
            return;
        }

        // We need a logged in user
        if (!this.currentUser) {
            alert('Please login to submit a review.');
            return;
        }
        const userId = this.currentUser._id;

        this.isSubmitting = true;

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('routeId', this.routeId);
        formData.append('source', this.newReview.source || 'Unknown');
        formData.append('destination', this.newReview.destination || 'Unknown');
        formData.append('story', this.newReview.story);
        formData.append('rating', this.newReview.rating.toString());

        for (let file of this.selectedFiles) {
            formData.append('photos', file);
        }


        this.experienceService.createExperience(formData).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.newReview.story = ''; // Clear form
                this.selectedFiles = [];
                this.previewUrls = [];
                this.fetchReviews(); // Refresh list
                alert('Review submitted successfully!');
            },
            error: (err) => {
                console.error("Error submitting review:", err);
                this.isSubmitting = false;
                alert('Failed to submit review.');
            }
        });
    }
}
