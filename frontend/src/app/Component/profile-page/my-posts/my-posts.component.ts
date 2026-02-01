import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

  myPosts: any[] = [];

  ngOnInit(): void {
    // TEMP dummy data (replace with API later)
    this.myPosts = [
      {
        source: 'Chennai',
        destination: 'Coimbatore',
        story: 'Very comfortable journey.',
        rating: 5,
        likes: 10
      },
      {
        source: 'Bangalore',
        destination: 'Hyderabad',
        story: 'Bus was on time but AC was low.',
        rating: 3,
        likes: 4
      }
    ];
  }
}
