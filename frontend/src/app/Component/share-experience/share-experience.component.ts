import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExperienceService } from '../../service/experience.service';

@Component({
    selector: 'app-share-experience',
    templateUrl: './share-experience.component.html',
    styleUrls: ['./share-experience.component.css']
})
export class ShareExperienceComponent implements OnInit {
    booking: any;
    story: string = '';
    rating: number = 5;
    photoUrl: string = '';
    isSubmitting: boolean = false;

    selectedFiles: File[] = [];
    previewUrls: string[] = [];

    constructor(public router: Router, private experienceService: ExperienceService) {
        const navigation = this.router.getCurrentNavigation();
        this.booking = navigation?.extras.state?.['booking'];
    }

    ngOnInit(): void {
        if (!this.booking) {
            alert("No booking found to share experience for.");
            this.router.navigate(['/']);
        }
    }

    setRating(star: number) {
        this.rating = star;
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

    submitExperience() {
        if (!this.story) {
            alert("Please write a story about your journey.");
            return;
        }

        this.isSubmitting = true;

        const formData = new FormData();
        formData.append('userId', this.booking.customerId || 'anonymous');
        formData.append('journeyId', this.booking._id || '');
        formData.append('source', this.booking.departureDetails?.city || '');
        formData.append('destination', this.booking.arrivalDetails?.city || '');
        formData.append('story', this.story);
        formData.append('rating', this.rating.toString());

        for (let file of this.selectedFiles) {
            formData.append('photos', file);
        }

        this.experienceService.createExperience(formData).subscribe({
            next: (res) => {
                alert('Thank you for sharing your experience!');
                this.router.navigate(['/community']);
            },
            error: (err) => {
                console.error('Error sharing experience:', err);
                alert('Failed to share experience. Please try again.');
                this.isSubmitting = false;
            }
        });
    }
}
