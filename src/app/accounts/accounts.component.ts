import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NotificationService } from '../shared/services/notification/notification.service';
import { AuthInfo } from '../shared/services/auth/auth-info';
import { Account, User} from '../shared/models/models';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public _currentUser: User = <User>{};
  public _accounts: Array<Account> = [];

  constructor(private _af: AngularFire, private _ai: AuthInfo, private _ns: NotificationService) { 
    this._ai.getInfo().subscribe((ai) => {
      this._currentUser = ai;
      this.getChildAccounts(this._currentUser.accountId);
    })
  }

  ngOnInit() {
  }

  getChildAccounts(account_id: string) {
    this._af.database.list('/accounts').$ref.orderByChild('agencyId').equalTo(account_id).once('value').then((accounts) => {
      accounts.forEach((account) => {
        let n_account: Account = {
          $key: account.key,
          website: account.val().website,
          business: account.val().business,
          phone: account.val().phone,
          status: account.val().status,
          account_type: account.val().account_type,
          agencyId: account.val().agencyId,
          users: account.val().users,
          createdAt: account.val().createdAt,
        }
        this._accounts.push(n_account);
      })
    })
  }

  changeStatus(account: Account) {
    let key = account.$key;
    delete account.$key;
    this._ns.addToast('Aguarde...', 'Estamos desativando esta conta', 'wait');
    this._af.database.object('/accounts/' + key).update(account).then((updated) => {
      account.$key = key;
      this._ns.clearAll();
      this._ns.addToast('Ok', 'A conta ' + account.business + ' foi desativada', 'success');
    }).catch((error) => {
      account.$key = key;
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar atualizar o status da conta ' + account.business + '.', 'error');
    })
  }

}
