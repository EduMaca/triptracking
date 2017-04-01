import { Injectable } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';



@Injectable()
export class NotificationService {

  public current_toast: number;

  constructor( private _toastyService: ToastyService, private _toastyConfig: ToastyConfig) { 
    this._toastyConfig.theme = 'material';
    this._toastyConfig.position = 'bottom-right';
  }

  public addToast(title: string, msg: string, type: string) {
    let self = this;
    let toastOptions: ToastOptions = {
      title: title,
      msg: msg,
      showClose: false,
      timeout: 6000,
      theme: 'material',
      onAdd: function(toast: ToastData) {
        self.current_toast = toast.id;
      },
      onRemove: function(toast:ToastData) {
        self.current_toast = null;
      }
    };

    switch (type) {
      case 'success':
        this._toastyService.success(toastOptions);
        break;

      case 'error':
        this._toastyService.error(toastOptions);
        break;
      case 'warning':
        this._toastyService.warning(toastOptions);
        break;
      case 'info':
        this._toastyService.info(toastOptions);
        break;
      case 'wait':
        this._toastyService.wait(toastOptions);
        break;
    
      default:
        this._toastyService.default(toastOptions);
        break;
    }
  }

  public clearAll() {
    this._toastyService.clearAll();
  }

  removeToast(id: number) {
    this._toastyService.clear(id);
  }

}
