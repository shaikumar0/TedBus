import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
import { SelectbusPageComponent } from './Component/selectbus-page/selectbus-page.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { TicketPageComponent } from './Component/ticket-page/ticket-page.component';
import { ShareExperienceComponent } from './Component/share-experience/share-experience.component';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';
import { CommunityComponent } from './Component/community-page/community.component'
import { RouteDetailsComponent } from './Component/route-details/route-details.component';
const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'select-bus', component: SelectbusPageComponent },
  { path: 'payment', component: PaymentPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'ticket', component: TicketPageComponent },
  { path: 'share-experience', component: ShareExperienceComponent },
  { path: 'route-details/:routeId', component: RouteDetailsComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
