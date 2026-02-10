import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Experience } from '../model/experience.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private baseUrl = environment.apiUrl + '/experience';

  constructor(private http: HttpClient) { }

  getCommunityFeed(): Observable<Experience[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  createExperience(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  likeExperience(post: any): Observable<any> {
    let userId = "";
    const user = sessionStorage.getItem("Loggedinuser");
    if (user) {
      userId = JSON.parse(user)._id;
    }
    return this.http.post(`${this.baseUrl}/${post._id}/like`, { userId });
  }

  getRouteReviews(routeId: string): Observable<any> {
    // New endpoint is /route-reviews/:routeId
    const rootUrl = this.baseUrl.replace('/experience', '');
    return this.http.get(`${rootUrl}/route-reviews/${routeId}`);
  }
}
