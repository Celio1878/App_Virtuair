import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { TrainingPage } from '../training/training';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the TrainingInstructionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-training-instructions',
  templateUrl: 'training-instructions.html',
})
export class TrainingInstructionsPage {

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private vibration: Vibration) {
  }

  ionViewDidLoad() {
    //console.log("Page: TrainingInstructions");
  }

  vibrateOnClick(){
    this.vibration.vibrate(30);
  }

  goTrainingPage() {
    this.nav.push(TrainingPage);
  }

}
