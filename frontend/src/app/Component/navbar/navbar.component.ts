import { Component, OnInit, NgZone } from '@angular/core';
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
  constructor(private router: Router, private customerservice: CustomerService, public themeService: ThemeService, public translate: TranslateService, private ngZone: NgZone) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  isloggedIn: boolean = false
  ngOnInit(): void {
    this.customerservice.user$.subscribe(user => {
      this.isloggedIn = !!user;
      if (!this.isloggedIn) {
        this.themeService.setLightMode();
        setTimeout(() => {
          this.rendergooglebutton();
        }, 100);
      }
    });



    this.checkGoogleScript();
  }

  private checkGoogleScript() {
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleSignIn();
    } else {
      setTimeout(() => this.checkGoogleScript(), 100);
    }
  }

  private initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        this.ngZone.run(() => {
          this.handlelogin(response);
        });
      }
    });
    this.rendergooglebutton();
  }

  ngAfterViewInit(): void {
    // Render button is now handled in initializeGoogleSignIn
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
        this.customerservice.setLoggedInUser(response);
        this.themeService.setLightMode();
      },
      error: (error) => {
        console.error('Post request failed', error)
      }
    })
  }
  handlelogout() {
    google.accounts.id.disableAutoSelect();
    this.customerservice.clearLoggedInUser();
    this.themeService.setLightMode();
  }
  navigate(route: string) {
    this.router.navigate([route])
  }
}


