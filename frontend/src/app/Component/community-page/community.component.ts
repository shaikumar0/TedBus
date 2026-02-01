import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../service/experience.service';
import { Experience } from '../../model/experience.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  posts: Experience[] = [];

  constructor(private experienceService: ExperienceService) { }

  baseUrl = 'http://localhost:5000/';

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    this.experienceService.getCommunityFeed().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Community posts:', data);
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      }
    });
  }

  toggleLike(post: any) {
    this.experienceService.likeExperience(post).subscribe({
      next: (res) => {
        if (res.success) {
          // Update UI
          if (res.liked) {
            post.likesCount = (post.likesCount || 0) + 1;
            // Optional: mark as liked locally if you track it
          } else {
            post.likesCount = (post.likesCount || 0) - 1;
          }
        }
      },
      error: (err) => {
        console.error('Error liking post:', err);
      }
    });
  }

  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available'; // Fallback image
  }
}
