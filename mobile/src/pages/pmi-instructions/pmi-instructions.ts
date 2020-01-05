import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { PmiPage } from '../pmi/pmi';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the PmiInstructionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pmi-instructions',
  templateUrl: 'pmi-instructions.html',
})
export class PmiInstructionsPage {

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private vibration: Vibration) {
  }

  ionViewDidLoad() {
    //console.log("Page: PmiInstructions");
  }

  vibrateOnClick(){
    this.vibration.vibrate(30);
  }

  goPmiPage() {
    this.nav.push(PmiPage);
  }

  log() {
    
  }

  showToast(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
}
