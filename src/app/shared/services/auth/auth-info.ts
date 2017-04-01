import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../notification/notification.service';
import { User } from '../../models/models';

@Injectable()
export class AuthInfo {
    public _loggedUser: User = <User>{};

    constructor(private _af: AngularFire, private _ns: NotificationService, private _r: Router) {
    }

    public getInfo(): Observable<any> {
        return Observable.create((observe) => {
            this._af.auth.subscribe((auth) => {
                if (auth != null) {
                    this._af.database.object('/users/' + auth.uid).subscribe((userData) => {
                        this._loggedUser.email = auth.auth.email;
                        this._loggedUser.accountId = userData.accountId;
                        this._loggedUser.full_name = auth.auth.displayName;
                        this._loggedUser.uid = auth.uid;
                        observe.next(this._loggedUser);
                        observe.complete();
                    })
                }
            })
        })

    }

    public hasAccount(): boolean {
        let has: boolean = false;
        if (!this._loggedUser.accountId) {
            has = false;
        } else {
            has = true;
        }
        return has;
    }

    public logoff() {
        this._af.auth.logout().then((success) => {
            this._ns.addToast('Ok', 'Você saiu do TripTracking', 'success');
            this._r.navigate(['/session/sign-in']);
        }).catch((err) => {
            this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar sair do TripTracking', 'error');
        })
    }
}