import { Component, OnInit } from '@angular/core';
import { BusService } from '../../service/bus.service';
import { Booking } from '../../model/booking.model';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  selecteditem: string = 'trips';
  currentcustomer: any = null
  currentname: string = ''
  currentemail: string = ''
  mytrip: Booking[] = []
  handlelistitemclick(selected: string): void {
    this.selecteditem = selected
  }
  constructor(private busbooking: BusService, private customerservice: CustomerService) { }
  ngOnInit(): void {
    this.customerservice.user$.subscribe(user => {
      this.currentcustomer = user;
      if (user) {
        this.currentname = user.name;
        this.currentemail = user.email;
        this.busbooking.getbusmongo(user._id).subscribe((response: any) => {
          this.mytrip = response
          console.log(this.mytrip)
        })
      } else {
        this.currentname = '';
        this.currentemail = '';
        this.mytrip = [];
      }
    });
  }
}
