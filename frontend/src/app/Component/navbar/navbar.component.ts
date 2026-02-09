import { Component, OnInit } from '@angular/core';
declare var google: any;
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ThemeService } from '../../service/theme.service';


import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private customerservice: CustomerService, public themeService: ThemeService, public translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  isloggedIn: boolean = false
  ngOnInit(): void {
    if (sessionStorage.getItem("Loggedinuser")) {
      this.isloggedIn = true
    } else {
      this.isloggedIn = false;
      this.themeService.setLightMode();
    }


    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        this.handlelogin(response);

      }
    })
  }
  ngAfterViewInit(): void {
    this.rendergooglebutton();
  }
  private rendergooglebutton(): void {
    const googlebtn = document.getElementById('google-btn');
    if (googlebtn) {
      google.accounts.id.renderButton(googlebtn, {
        theme: 'outline',
        size: 'medium',
        shape: 'pill',
        width: 150,
      })
    }
  }

  private decodetoken(token: String) {
    return JSON.parse(atob(token.split(".")[1]))
  }
  handlelogin(response: any) {
    const payload = this.decodetoken(response.credential)
    // console.log(payload)
    this.customerservice.addcustomermongo(payload).subscribe({
      next: (response) => {
        console.log('POST success', response);
        sessionStorage.setItem("Loggedinuser", JSON.stringify(response))
        this.themeService.setLightMode();
      },
      error: (error) => {
        console.error('Post request failed', error)
      }
    })
  }
  handlelogout() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('Loggedinuser');
    this.themeService.setLightMode();
    window.location.reload()
  }
  navigate(route: string) {
    this.router.navigate([route])
  }
}


