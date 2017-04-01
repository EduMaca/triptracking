import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { ToastyModule } from 'ng2-toasty';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from "ngx-tooltip";
import {PopoverModule} from "ngx-popover";

import { AuthGuard } from './shared/services/auth/auth-guard';
import { AgencyGuard } from './shared/services/auth/agency-guard';

import { NotificationService } from './shared/services/notification/notification.service';
import { AuthInfo } from './shared/services/auth/auth-info';

import { appRouting } from './app.routes';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionComponent } from './session/session.component';
import { SignInComponent } from './session/sign-in/sign-in.component';
import { SignUpComponent } from './session/sign-up/sign-up.component';
import { PasswordRecoverComponent } from './session/password-recover/password-recover.component';
import { PasswordEditComponent } from './session/password-edit/password-edit.component';
import { AccountComponent } from './account/account.component';
import { NewAccountComponent } from './account/new-account/new-account.component';
import { FormsComponent } from './forms/forms.component';
import { FormDetailComponent } from './forms/form-detail/form-detail.component';
import { FormFieldsComponent } from './forms/form-detail/form-fields/form-fields.component';
import { FieldsComponent } from './fields/fields.component';
import { LeadsComponent } from './leads/leads.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { LeadDetailComponent } from './leads/lead-detail/lead-detail.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AddLeadComponent } from './leads/add-lead/add-lead.component';
import { ProposalComponent } from './leads/lead-detail/proposal/proposal.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewSubaccountComponent } from './accounts/new-subaccount/new-subaccount.component';

const firebaseConfig = {
  apiKey: "AIzaSyBGQzoa71pbK86BcrYhIhAvLsgSuOlPY9M",
  authDomain: "triptracking-9a432.firebaseapp.com",
  databaseURL: "https://triptracking-9a432.firebaseio.com",
  storageBucket: "triptracking-9a432.appspot.com"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SessionComponent,
    SignInComponent,
    SignUpComponent,
    PasswordRecoverComponent,
    PasswordEditComponent,
    AccountComponent,
    NewAccountComponent,
    FormsComponent,
    FormDetailComponent,
    FormFieldsComponent,
    FieldsComponent,
    LeadsComponent,
    GlobalSearchComponent,
    LeadDetailComponent,
    PaginationComponent,
    AddLeadComponent,
    ProposalComponent,
    AccountsComponent,
    NewSubaccountComponent,
  ],
  imports: [
    appRouting,
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    ToastyModule.forRoot(),
    Ng2Bs3ModalModule,
    TooltipModule,
    PopoverModule
  ],
  providers: [AuthGuard, NotificationService, AuthInfo, AgencyGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
