import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Customer } from '../model/customer.model';
import { url } from '../config';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiurl: string = url + 'customer/'

  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getUserFromStorage() {
    if (typeof sessionStorage !== 'undefined') {
      const user = sessionStorage.getItem("Loggedinuser");
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  setLoggedInUser(user: any) {
    sessionStorage.setItem("Loggedinuser", JSON.stringify(user));
    this.userSubject.next(user);
  }

  clearLoggedInUser() {
    sessionStorage.removeItem("Loggedinuser");
    this.userSubject.next(null);
  }

  addcustomermongo(user: any): Observable<Customer> {
    const customer: Customer = {
      name: user.name,
      email: user.email,
      googleId: user.id,
      profilepicture: user.picture
    }
    return this.http.post<Customer>(this.apiurl, customer)
  }
}
