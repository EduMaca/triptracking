import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { database } from 'firebase';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { AuthInfo } from '../../shared/services/auth/auth-info';
import { Account, User, AccountTypes } from '../../shared/models/models';
import { AuthModel } from '../../shared/models/authentication';

@Component({
  selector: 'app-new-subaccount',
  templateUrl: './new-subaccount.component.html',
  styleUrls: ['./new-subaccount.component.css']
})
export class NewSubaccountComponent implements OnInit {

  public _account: Account = <Account>{};
  public _user: User = <User>{};
  public _authData: AuthModel = <AuthModel>{};
  public _currentAccountId: string;

  constructor(private _af: AngularFire, private _ns: NotificationService, private _ar: ActivatedRoute, private _r: Router) {
    this._ar.params.subscribe((params) => {
      this._currentAccountId = params["id"];
    })
  }

  ngOnInit() {
  }

  submit() {
    this._ns.addToast('Aguarde...', 'Estamos criando uma nova conta para você!', 'wait');
    this._af.auth.createUser(this._authData).then((succ) => {
      let uid = succ.uid;
      if (uid != null) {
        succ.auth.updateProfile({ displayName: this._user.full_name, photoURL: '' }).then((updated) => {
          this._account.account_type = AccountTypes.other;
          this._account.agencyId = this._currentAccountId;
          this._account.createdAt = database.ServerValue.TIMESTAMP;
          this._account.users = 1;
          this._af.database.list('/accounts/').push(this._account).then((account_inserted) => {
            this._af.database.object('/users/' + uid).update({ accountId: account_inserted.key }).then((user_updated) => {
              this._ns.clearAll();
              this._ns.addToast('Ok', 'A conta ' + this._account.business + ' está pronta para o uso!', 'success');
              this._r.navigate(['/accounts']);
            }).catch((user_not_inserted) => {
              this._ns.clearAll();
              this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar adicionar um usuário na conta ' + this._account.business + '.', 'error');
            })
          }).catch((account_error) => {
            this._ns.clearAll();
            this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar a conta ' + this._account.business + '.', 'error');
          })
        }).catch((profile_error) => {
          this._ns.clearAll();
          this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar atualizar as informações desta conta.', 'error');
        })
      }
    }).catch((user_error) => {
      this._ns.clearAll();
              this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar um usuário para esta conta.', 'error');
    })
  }

}
