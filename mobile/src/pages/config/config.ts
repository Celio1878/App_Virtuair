import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private vibration: Vibration) {
  }

  ionViewDidLoad() {
    //console.log("Page: config");
  }
  openPrivacyPolicy() {
    window.open('https://www.nuresp.com.br/privacy.html', '_system');
  }

  vibrateOnClick() {
    this.vibration.vibrate(30);
  }

}
