import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AngularFire } from 'angularfire2';


@Injectable()
export class AgencyGuard implements CanActivate {
	public allowed: boolean;

	constructor(private af: AngularFire, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.af.auth.map((auth) => {
			if(auth == null) {
				this.router.navigate(['/session/sign-in']);
				return false;
			} else {
				return true;
			}
		})
	}
}