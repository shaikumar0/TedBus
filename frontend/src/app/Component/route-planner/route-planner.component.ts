import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
    selector: 'app-route-planner',
    templateUrl: './route-planner.component.html',
    styleUrls: ['./route-planner.component.css']
})
export class RoutePlannerComponent implements OnInit, AfterViewInit {
    private map: L.Map | undefined;
    private routingControl: any;

    startPoint: string = '';
    endPoint: string = '';
    waypoints: { name: string, latLng?: L.LatLng }[] = [];

    startSuggestions: any[] = [];
    endSuggestions: any[] = [];
    waypointSuggestions: { [key: number]: any[] } = {};

    selectedStart: L.LatLng | null = null;
    selectedEnd: L.LatLng | null = null;

    routeSummary: { totalDistance: number, totalTime: number } | null = null;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    private initMap(): void {
        if (!document.getElementById('map')) return;

        this.map = L.map('map').setView([12.9716, 77.5946], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.fixMarkerIcons();
    }

    private fixMarkerIcons() {
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
    }

    searchLocation(query: string, type: 'start' | 'end' | 'waypoint', index?: number) {
        if (query.length < 3) {
            this.clearSuggestions(type, index);
            return;
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        this.http.get<any[]>(url).subscribe(data => {
            if (type === 'start') {
                this.startSuggestions = data;
            } else if (type === 'end') {
                this.endSuggestions = data;
            } else if (type === 'waypoint' && index !== undefined) {
                this.waypointSuggestions[index] = data;
            }
        });
    }

    selectLocation(location: any, type: 'start' | 'end' | 'waypoint', index?: number) {
        const latLng = L.latLng(location.lat, location.lon);

        if (type === 'start') {
            this.startPoint = location.display_name;
            this.selectedStart = latLng;
            this.startSuggestions = [];
            if (this.map) this.map.setView(latLng, 13);
        } else if (type === 'end') {
            this.endPoint = location.display_name;
            this.selectedEnd = latLng;
            this.endSuggestions = [];
        } else if (type === 'waypoint' && index !== undefined) {
            this.waypoints[index].name = location.display_name;
            this.waypoints[index].latLng = latLng;
            this.waypointSuggestions[index] = [];
        }

        this.calculateRoute();
    }

    clearSuggestions(type: 'start' | 'end' | 'waypoint', index?: number) {
        if (type === 'start') this.startSuggestions = [];
        else if (type === 'end') this.endSuggestions = [];
        else if (index !== undefined) this.waypointSuggestions[index] = [];
    }

    addWaypoint() {
        this.waypoints.push({ name: '' });
    }

    removeWaypoint(index: number) {
        this.waypoints.splice(index, 1);
        delete this.waypointSuggestions[index];
        this.calculateRoute();
    }

    calculateRoute() {
        if (!this.map || !this.selectedStart || !this.selectedEnd) return;

        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        const planWaypoints = [
            this.selectedStart,
            ...this.waypoints.filter(w => w.latLng).map(w => w.latLng!),
            this.selectedEnd
        ];

        this.routingControl = L.Routing.control({
            waypoints: planWaypoints,
            routeWhileDragging: true,
            show: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: true,
            lineOptions: {
                styles: [{ color: '#00Bfff', opacity: 0.8, weight: 6 }],
                extendToWaypoints: true,
                missingRouteTolerance: 100
            },
            altLineOptions: {
                styles: [{ color: '#888', opacity: 0.6, weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 100
            }
        })
            .on('routesfound', (e: any) => {
                const routes = e.routes;
                const summary = routes[0].summary;
                this.routeSummary = {
                    totalDistance: summary.totalDistance / 1000,
                    totalTime: summary.totalTime / 60
                };
            })
            .addTo(this.map);
    }
    searchBuses() {
        if (!this.startPoint || !this.endPoint) {
            alert('Please select start and end points first.');
            return;
        }

        // Extract city names (assuming format "City, State, Country")
        const departure = this.startPoint.split(',')[0].trim();
        const arrival = this.endPoint.split(',')[0].trim();

        // Default to today's date
        const date = new Date().toISOString().split('T')[0];

        this.router.navigate(['/select-bus'], {
            queryParams: {
                departure: departure,
                arrival: arrival,
                date: date
            }
        });
    }
}
