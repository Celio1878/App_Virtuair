import { Component, ApplicationRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, AlertController, ToastController } from 'ionic-angular';
// import { AngularFireDatabase} from '@angular/fire/database';

//Services
//import { TrainingInstructionsPage } from '../training-instructions/training-instructions';
import { HomePage } from '../home/home';
import { Observable } from 'rxjs/Observable';
//import { Subscription } from 'rxjs';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../services/device-service';

//Permissões necessárias para usar o BLE
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the DeviceConnectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class BLEDevice {
  public name: string
  public id: string
}

@IonicPage()
@Component({
  selector: 'page-device-connect',
  templateUrl: 'device-connect.html',
})
export class DeviceConnectPage {

  output: String;

  bleDevices: BLEDevice[]

  toast: any;
  loading: any;

  bleEnabled: boolean = false;
  locationEnabled: boolean = false;

  connectionstring = "bluetooth desconectado";
  currentPlatform: String;

  hidtest: boolean = false;

  constructor(public nav: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController, public toastCtrl: ToastController,
    private ble: BLE, private deviceService: DeviceService,
    private locationAccuracy: LocationAccuracy,
    private bleEvent: Events, private locationEvent: Events,
    private applicationRef: ApplicationRef, private vibration: Vibration,
    private loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    //console.log("Page: DeviceConnect")

    this.checkBleStatus();
    this.checkLocationStatus();

    try {
      this.bleEvent.unsubscribe('ble:update');
    }
    finally {
      this.bleEvent.subscribe('ble:update', (val: boolean) => {
        if (this.bleEnabled != val) {
          this.updateBleStatus(val);
        }
      });
    }

    try {
      this.locationEvent.unsubscribe('location:update');
    }
    finally {
      this.locationEvent.subscribe('location:update', (val: boolean) => {
        this.updateLocationStatus(val);
      });
    }
  }

  ionViewWillLeave() {
    if(this.toast != null) {
      this.toast.dismiss();
    }
  }

  vibrateOnClick(){
    this.vibration.vibrate(30);
  }

  updateBleStatus(status: boolean) {
    this.bleEnabled = status;
    //console.log("Mudou BLE para: " + this.bleEnabled);
    try { this.applicationRef.tick(); } catch (e) { }
  }

  updateLocationStatus(status: boolean) {
    this.locationEnabled = status;
    //console.log("Mudou LOC para: " + this.locationEnabled);
    try { this.applicationRef.tick(); } catch (e) { }
  }

  checkBleStatus() {
    this.bleEnabled = this.deviceService.isBluetoothEnabled()
    return this.bleEnabled;
  }

  checkLocationStatus() {
    this.locationEnabled = this.deviceService.isLocationEnabled();
    return this.locationEnabled;
  }

  startConnectionPeripheral() {
    return new Promise((resolve, reject) => {
      //BLE e LOC desligados
      if (!this.checkLocationStatus() && !this.checkBleStatus()) {
        this.presentSimpleAlert('Atenção',
                                'Precisamos que você ative o bluetooth e a localização do seu telefone para continuar.',
                                'Ok');
        //Solicita BLE
        this.ble.enable()
          //User aceitou BLE, solicita LOC
          .then(() => this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            //User aceita LOC
            .then(() => {
              //console.log("LOC ativado pelo usuário");
              return resolve();
            })
            //User nega LOC
            .catch((error) => {
              //console.error("Usuário cancelou por: " + error);
              return reject();
            }))
          //User negou BLE
          .catch((error) => {
            //console.error("Usuário cancelou por: " + error);
            return reject()
          });
      }

      //Apenas BLE desligado
      else if (!this.checkBleStatus()) {
        this.presentSimpleAlert('Bluetooth desativado',
                                'Precisamos que você ative o Bluetooth do seu telefone para continuar.',
                                'Ok');

        this.ble.enable()
          .then(() => {
            //console.log("BT ativado pelo usuário");
            return resolve();
          })
          .catch((error) => {
            //console.error("Usuário cancelou por: " + error)
            return reject();
          });
      }

      //Apenas LOC desligado
      else if (!this.checkLocationStatus()) {
        this.presentSimpleAlert('Localização desativada',
                                'Precisamos que você ative a localização do seu telefone para continuar.',
                                'Ok');

        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(() => {
            //console.log("LOC ativado pelo usuário");
            return resolve();
          })
          .catch((error) => {
            //console.error("Usuário cancelou por: " + error);
            return reject();
          });
      }

      //Todos os periféricos ligados
      else {
        return resolve();
      }

    });
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

  startScanning() {
    //Caso BT e Localização estejam desabilitados, pede para 
    this.startConnectionPeripheral().then(() => {
      let searchForBLEDevices = (): Observable<BLEDevice> => {
        return this.ble.scan([], 10)
      }

      let addBLEDeviceToList = (device: BLEDevice) => {
        if(device.name != null){
          if (device.name.match(/virtuair/gi) != null) {
            this.bleDevices.push(device)
          }
        }

      }

      let stopScan = () => {

        this.ble.stopScan().then(() => {
          this.toast.dismiss()
        }).catch(error => {
          //console.error(`falha ao parar escaneamento`, error)
          this.toast.dismiss()
        })
      }

      this.bleDevices = []

      this.toast = this.toastCtrl.create({
        message: "Buscando dispositivos...",
        duration: 300000
      })

      this.toast.present()

      searchForBLEDevices().subscribe(addBLEDeviceToList)

      setTimeout(stopScan, 10000)
    })
      .catch(() => {
        this.presentSimpleAlert('Atenção','Todos os periféricos precisam ser ativados', 'Ok');
      });

  }

  success = (data) => this.showToast(data);

  fail = (error) => this.showToast(error);

  selectDevice(address: any) {

    let askForConnectionAlert = this.alertCtrl.create({
      title: 'Conectar',
      message: 'Deseja se conectar a este dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Conectar',
          handler: () => {
            this.deviceService.setCurrentDeviceId(address)
            
            this.loading = this.loadingCtrl.create({
              content: 'Conectando, aguarde...'
            })
            this.loading.present();

            this.deviceService.connect(address)
              .then(() => {
                this.loading.dismiss();
                this.vibration.vibrate(300);
                this.nav.pop();
                /*console.log('Deu');*/ }) //Tenta conectar
              .catch((error) => {
                this.bleDevices.length = 0;
                this.loading.dismiss();
                this.presentSimpleAlert('Erro ao conectar', error, 'Ok');
              })
          }
        }
      ]
    });

    askForConnectionAlert.present();
  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Desconectar?',
      message: 'Deseja desconectar-se deste dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Desconectar',
          handler: () => {
            let ldn = this.loadingCtrl.create({
              content: 'Desconectando...'
            });

            ldn.present();

            this.deviceService.disconnect().then(() => {
              ldn.dismiss();
              this.goHomePage();
            });
          }
        }
      ]
    });
    alert.present();
  }


  getBLEDeviceIdentification(bleDevice: BLEDevice): string {
    if (bleDevice.name != null) {
      return `${bleDevice.name} - ${bleDevice.id}`
    } else {
      return `${bleDevice.id}`
    }
  }

  isConnected(): boolean{
    return this.deviceService.isConnected();
  }

  presentSimpleAlert(title: string, message: string, buttonText: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{ text: buttonText }],
      enableBackdropDismiss: false,
    });
    alert.present();
  }

}
