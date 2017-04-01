import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/services/auth/auth-guard';
import { AgencyGuard } from './shared/services/auth/agency-guard';
//login components
import { SessionComponent } from './session/session.component';
import { SignInComponent } from './session/sign-in/sign-in.component';
import { SignUpComponent } from './session/sign-up/sign-up.component';
import { PasswordRecoverComponent } from './session/password-recover/password-recover.component';
import { PasswordEditComponent } from './session/password-edit/password-edit.component';


import { DashboardComponent } from './dashboard/dashboard.component';


//account
import { AccountComponent } from './account/account.component';
import { NewAccountComponent } from './account/new-account/new-account.component';

import { AccountsComponent } from './accounts/accounts.component';
import { NewSubaccountComponent } from './accounts/new-subaccount/new-subaccount.component';


//forms
import { FormsComponent } from './forms/forms.component';
import { FormDetailComponent } from './forms/form-detail/form-detail.component';

//fields
import { FieldsComponent } from './fields/fields.component';


//leads
import { LeadsComponent } from './leads/leads.component';
import { LeadDetailComponent } from './leads/lead-detail/lead-detail.component';
import { AddLeadComponent } from './leads/add-lead/add-lead.component';

const appRoutes: Routes = [
	{
		path: 'session', component: SessionComponent, children: [
			{ path: 'sign-in', component: SignInComponent },
			{ path: 'sign-up', component: SignUpComponent },
			{ path: 'password-recover', component: PasswordRecoverComponent },
			{ path: 'password-edit', component: PasswordEditComponent },
		]
	},
	{
		path: 'account', canActivate: [AuthGuard], children: [
			{ path: 'new', component: NewAccountComponent }
		], component: AccountComponent
	},
	{
		path: 'forms', canActivate: [AuthGuard], children: [
			{ path: ':id', component: FormDetailComponent },
		], component: FormsComponent
	},
	{ path: 'fields', component: FieldsComponent, canActivate: [AuthGuard] },
	{
		path: 'leads', canActivate: [AuthGuard], children: [
			{ path: 'add', component: AddLeadComponent },
			{ path: ':id', component: LeadDetailComponent },
			{ path: '', component: LeadsComponent }
		]
	},
	{
		path: 'accounts', canActivate: [AuthGuard], children: [
			{ path: 'new/:id', component: NewSubaccountComponent },
			{ path: '', component: AccountsComponent },
		]
	},
	{ path: '', component: DashboardComponent, canActivate: [AuthGuard] }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
