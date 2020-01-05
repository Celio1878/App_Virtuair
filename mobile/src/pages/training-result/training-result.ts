import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CRMService } from "../../providers/crm-service";
import { DeviceService } from '../../services/device-service';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the TrainingResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-training-result',
  templateUrl: 'training-result.html',
})
export class TrainingResultPage implements OnInit {


  training;
  med;
  efforts;

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private crmService: CRMService,
    private deviceService: DeviceService, private vibration: Vibration) {

    let receivedMed = navParams.get('med');
    this.med = +receivedMed.toFixed(1);
    this.training = this.med;
    this.efforts = navParams.get('eff');
    this.nav.remove(1, 2);

  }

  async ngOnInit() {
    let serial = this.deviceService.getSerialId()

    this.crmService.setCurrentSerial(serial.valueOf())
      .then(() => {
        this.crmService.saveTrainingResult({ med: this.med, efficacy: this.efforts })
          .then(() => this.showToast("Resultado salvo"))
          .catch(() => this.showToast("Falha ao salvar resultado"));
      })
      .catch((err) => {
        alert(err)
      });

  }

  ionViewDidLoad() {
    this.vibration.vibrate(500);
    //console.log("Page: TrainingResult");
  }

  vibrateOnClick() {
    this.vibration.vibrate(30);
  }

  goHomePage() {
    this.nav.setRoot(HomePage);
  }
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
