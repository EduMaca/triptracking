import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';

import { NotificationService } from './shared/services/notification/notification.service';
import { AuthInfo } from './shared/services/auth/auth-info';

import { User } from './shared/models/models';

declare var $: any;


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	public currentPath: string = '';
	public currentUser: User = <User>{};

	constructor(private _r: Router, private _af: AngularFire, private _ns: NotificationService, private _ai: AuthInfo) {
		this.currentUser = this._ai._loggedUser;
		this._r.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.currentPath = e.url;
				this._ai.getInfo().subscribe((auth) => {
					this.currentUser = auth;
					if (this.currentUser.email != null) {
						if (!this._ai.hasAccount())
							this._r.navigate(['/account/new'])
					}
				})

			}

			if (e instanceof NavigationStart) {
				if (e.url.indexOf('session') < 0) {
					if (!$("body").hasClass('full-content')) {
						$("body").addClass('full-content');
					}
					
				} else {
					$("body").removeClass('full-content');
				}
			}

		})
	}

	ngOnInit() {
	}


	logout() {
		this._ai.logoff();
	}

}
