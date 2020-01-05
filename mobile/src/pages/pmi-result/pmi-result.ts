import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { PmiPage } from '../pmi/pmi';
import { CRMService } from "../../providers/crm-service";
import { DeviceService } from '../../services/device-service';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the PmiResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pmi-result',
  templateUrl: 'pmi-result.html',
})
export class PmiResultPage implements OnInit {

  result = 0;
  reproductibility = false;

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private CRM: CRMService, private deviceService: DeviceService, private vibration: Vibration) {

    this.result = this.navParams.get('result');
    this.reproductibility = this.navParams.get('repro');
    this.nav.remove(1, 2);

  }

  async ngOnInit() {

    if(this.reproductibility) {
    let serial = this.deviceService.getSerialId()

    this.CRM.setCurrentSerial(serial.valueOf())
      .then(() => {
        this.CRM.savePMIResult(this.result)
          .then(()  => this.showToast("Resultado salvo"))
          .catch(() => this.showToast("Falha ao salvar resultado"));
      })
      .catch((err) => {
        alert(err)
      });
    }
    else {
      let toast = this.toastCtrl.create({
        message: "Infelizmente, seu teste variou muito e não será enviado para o seu profissional.",
        duration: 5000,
        cssClass: 'error'
      })

      toast.present()
    }
  }

  ionViewDidLoad() {
    this.vibration.vibrate(500);
    //console.log("Page: PmiResults");
  }

  vibrateOnClick() {
    this.vibration.vibrate(30);
  }

  goHomePage() {
    this.nav.setRoot(HomePage);
  }

  goPmiPage() {
    this.nav.push(PmiPage, {
    });
  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
}
