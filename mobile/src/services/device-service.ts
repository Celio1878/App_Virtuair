import { Injectable } from "@angular/core";
import { BLE } from "@ionic-native/ble/ngx";
//import { Device } from "../device";
import { Observable, /*observable*/ } from "rxjs";
import { map } from "rxjs/operators";
import { App, Platform, Events, ToastController, AlertController } from 'ionic-angular';

//Permissões necessárias para usar o BLE
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Storage } from '@ionic/storage'

//import { promise } from "selenium-webdriver";
//import { ValueConverter } from "@angular/compiler/src/render3/view/template";

@Injectable()
export class DeviceService {
    private readingPressureValuesObservable: Observable<number>

    private currentDeviceId: string
    private peripheral: any

    private bleEnabled: boolean;
    private locationEnabled: boolean;
    private bleConnected: boolean = false;

    public readonly sampleRate: number = 100;
    public readonly sampleFrequency: number = 50;

    private currentSerialId: String;
    private batteryLevel: number;

    constructor(private ble: BLE,
        private platform: Platform,
        private diagnostic: Diagnostic,
        private bleEvent: Events,
        private locationEvent: Events,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public appCtrl: App,
        public storage: Storage) {

        this.currentDeviceId = null
    }

    checkStatus() {
        //Primeiro update das variáveis
        this.ble.isEnabled()
            .then(() => {
                this.bleEnabled = true;
                //console.log("BLE atualizado: " + this.bleEnabled) 
            })
            .catch(() => {
                this.bleEnabled = false;
                //console.log("BLE atualizado: " + this.bleEnabled)
            });

        //Força location = true para outras plataformas senão android
        if (this.platform.is("android")) {
            this.diagnostic.isLocationEnabled()
                .then((isAlive: boolean) => {
                    this.locationEnabled = isAlive;
                    //console.log("Location atualizada: " + this.locationEnabled)
                })
                .catch((error) => {
                    //console.log("Locale Error: " + error)
                });
        }
        else {
            this.locationEnabled = true;
        }

        this.bleEvent.publish('ble:update', this.bleEnabled);
        this.locationEvent.publish('location:update', this.locationEnabled);

        //BLE
        this.diagnostic.registerBluetoothStateChangeHandler((state) => {
            if (state === this.diagnostic.bluetoothState.POWERED_ON) {
                this.bleEnabled = true;
                //console.log("BLE Activated");
            }
            else {
                this.bleEnabled = false;
                //console.log("BLE Deactivated.");
            }

            this.bleEvent.publish('ble:update', this.bleEnabled);
        });

        //Location - só confere se for Android
        if (this.platform.is("android")) {
            this.diagnostic.registerLocationStateChangeHandler((state) => {
                if (state !== this.diagnostic.locationMode.LOCATION_OFF) {
                //if ((this.platform.is("android") && state !== this.diagnostic.locationMode.LOCATION_OFF)
                //    || (this.platform.is("ios")) && (state === this.diagnostic.permissionStatus.GRANTED
                //        || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)){
                    this.locationEnabled = true;
                    //console.log("Location Activated.");
                }
                else {
                    this.locationEnabled = false;
                    //console.log("Location Deactivated.");
                }

                this.locationEvent.publish('location:update', this.locationEnabled);
            });
        }
    }

    setCurrentDeviceId(deviceId) {
        this.currentDeviceId = deviceId
    }

    isDeviceSelected(): boolean {
        return this.currentDeviceId != null
    }

    getCurrentDeviceId() {
        return this.currentDeviceId
    }

    startReadingPressureValues(deviceId: string = null): Promise<Observable<number>> {
        //console.log("iniciando leitura");

        if (deviceId != null) {
            this.setCurrentDeviceId(deviceId)
        }

        let serviceToConnect = "0000ed00-1212-efde-05f3-78aeeabcdd74"
        let characteristicToConnect = "0000ed01-1212-efde-05f3-78aeeabcdd74"

        this.readingPressureValuesObservable = null



        return new Promise<Observable<number>>(async (resolve, reject) => {

            if (this.readingPressureValuesObservable != null) {
                return resolve(<any>this.readingPressureValuesObservable)
            }

            if (this.currentDeviceId == null) {
                return reject(new Error("dispositivo não selecionado"))
            }

            //console.log("Ligando Pressure:Notify")
            this.readingPressureValuesObservable = this.ble.startNotification(this.currentDeviceId, serviceToConnect, characteristicToConnect)
                .pipe(map(pressureCharacteristicBuffer => new Int32Array(pressureCharacteristicBuffer)[0]))
                .catch(e => {
                    //TODO Catch
                    this.readingPressureValuesObservable = this.ble.startNotification(this.currentDeviceId, serviceToConnect, characteristicToConnect)
                        .pipe(map(pressureCharacteristicBuffer => new Int32Array(pressureCharacteristicBuffer)[0]))
                    //console.log("Notify Err: " + e);
                    return Observable.empty()
                });

            resolve(this.readingPressureValuesObservable);

        })
    }

    stopReadingPressureValues(deviceId: string = null) {
        let serviceToConnect = "0000ed00-1212-efde-05f3-78aeeabcdd74";
        let characteristicToConnect = "0000ed01-1212-efde-05f3-78aeeabcdd74";

        if (deviceId != null) {
            this.setCurrentDeviceId(deviceId)
        }

        console.log("Pressure:Notify - Stopping")
        return new Promise((resolve, reject) => {
            this.ble.stopNotification(this.currentDeviceId, serviceToConnect, characteristicToConnect)
                .then(() => {
                    //console.log("Pressure:Notify - Off");
                    return resolve();
                })
                .catch(() => {
                    //console.log("Pressure:Notify - Off");
                    return reject();
                });
        });
    }

    readBatteryLevel(deviceId: string = null) {
        //console.log("Lendo Bateria")
        if (deviceId != null) {
            this.setCurrentDeviceId(deviceId)
        }

        let serviceToConnect = "180F"
        let characteristicToConnect = "2A19"//"00002A25-0000-1000-8000-00805F9B34FB"

        return new Promise<number>(async (resolve, reject) => {
            if (this.currentDeviceId == null) {
                return reject(new Error("dispositivo não selecionado"))
            }

            return this.ble.read(this.peripheral.id, serviceToConnect, characteristicToConnect)
                .then((data) => {
                    let numb: number;
                    let array: any = new Uint8Array(data);
                    numb = array[0];
                    resolve(numb);
                })
                .catch(error => {
                    //console.log("Não leu Bateria");
                    reject(error);
                })
        })
    }

    readSerialId(deviceId: string = null): Promise<string> {
        //console.log("Lendo Serial")
        if (deviceId != null) {
            this.setCurrentDeviceId(deviceId)
        }

        let serviceToConnect = "180A"
        let characteristicToConnect = "2A25"//"00002A25-0000-1000-8000-00805F9B34FB"

        return new Promise<string>(async (resolve, reject) => {
            if (this.currentDeviceId == null) {
                return reject(new Error("dispositivo não selecionado"))
            }

            return this.ble.read(this.peripheral.id, serviceToConnect, characteristicToConnect)
                .then(data => {
                    let array: any = new Uint8Array(data);
                    array.map((value) => ('0' + value));
                    let HexString = "";
                    for (var i = 0; i < array.length; i++) {
                        HexString += String.fromCharCode(array[i]);
                    }
                    //console.log(HexString);

                    //HexString = "AABBCCDD";

                    resolve(HexString);
                })
                .catch(error => {
                    //console.log("Não leu Serial");
                    reject(error);
                })
        })
    }

    //Lê a versão do FW do BLE, atualmente info chega no formato BLE_STM, como 1.0.0_1.0.0
    readFirmwareVersion(deviceId: string = null): Promise<string> {

        if (deviceId != null) {
            this.setCurrentDeviceId(deviceId)
        }

        let serviceToConnect = "180A"
        let characteristicToConnect = "2A26"

        return new Promise<string>(async (resolve, reject) => {
            if (this.currentDeviceId == null) {
                return reject(new Error("dispositivo não selecionado"))
            }

            return this.ble.read(this.peripheral.id, serviceToConnect, characteristicToConnect)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }

    getSerialId() {
        return this.currentSerialId;
    }

    disconnect(): Promise<void> {

        if (this.currentDeviceId == null) {
            return Promise.resolve()
        }

        return new Promise((resolve, reject) => {
            //this.connect$.unsubscribe();
            this.ble.disconnect(this.currentDeviceId).then(() => {
                this.readingPressureValuesObservable = null;
                this.currentDeviceId = null;
                this.peripheral = null;
                this.bleConnected = false;

                //console.log(`desconectando...`);

                resolve();


            }).catch(error => reject(error))
        })


    }

    connect(deviceId: string = null): Promise<void> {

        if (this.peripheral != null) {
            return Promise.resolve()
        }

        if (deviceId != null) {
            this.setCurrentDeviceId(deviceId)
        }


        return new Promise(async (resolve, reject) => {

            let onConnect = (peripheral) => {

                //console.log(`conexão bem sucedida`)
                this.peripheral = peripheral

                this.readFirmwareVersion()
                    .then((version) => {
                        //Tenta ler o Serial do dispositivo
                        this.readSerialId()
                            .then((serial) => {
                                this.currentSerialId = serial;

                                //Lê o valor de bateria depois de 1.1s conectado
                                setTimeout(() => {
                                    this.readBatteryLevel()
                                        .then((level) => {
                                            this.batteryLevel = level;
                                            let batteryToast = this.toastCtrl.create({
                                                message: "Nível da bateria do dispositivo: " + this.batteryLevel + "%",
                                                duration: 2500
                                            })
                                            batteryToast.present();
                                            //console.log("Bateria: " + this.batteryLevel + "%");
                                        })
                                        .catch((error) => {
                                            let batteryToast = this.toastCtrl.create({
                                                message: "Impossível ler o nível de bateria do seu dispositivo.",
                                                duration: 2500
                                            })
                                            batteryToast.present();
                                        })
                                }, 1100);

                                //Salva como último device conectado
                                this.storage.ready()
                                    .then(() => {
                                        this.storage.set('lastConnectedDevice', deviceId);
                                    });

                                //FW e Serial lidos, resolve a promise connect
                                this.bleConnected = true;
                                return resolve();

                            })
                            //Rejeita caso não tenha lido o Serial
                            .catch((error) => {
                                this.bleConnected = false;
                                this.peripheral = null;

                                this.ble.disconnect(this.currentDeviceId);
                                return reject('Não foi possível identificar o dispositivo, tente novamente.');
                            });
                    })
                    //Rejeita caso não tenha lido o FW
                    .catch((error) => {
                        this.bleConnected = false;
                        this.peripheral = null;

                        this.ble.disconnect(this.currentDeviceId);
                        return reject('Versão do dispositivo incompatível com o aplicativo. Por favor, entre em contato com seu fornecedor.');
                    });
            }

            let onDisconnect = () => {
                //console.log(`desconectando...`)
                this.bleConnected = false;
                this.peripheral = null;
                this.currentDeviceId = null;

                this.presentSimpleAlert('Erro',
                    'Conexão com o dispositivo perdida.',
                    'Ok');

                this.appCtrl.getRootNav().popToRoot();
            }

            let scanError = error => {
                //console.error(`erro ao escanear`, error)
                reject(error)
            }

            let connectIfDeviceIsRight = device => {
                ////console.log(`encontrado dispositivo ${device.id}`)
                if (device.id == this.currentDeviceId) {
                    //console.log(`conectando ao dispositivo ${device.id}`)
                    this.ble.connect(this.currentDeviceId).subscribe(onConnect, onDisconnect)
                }
            }

            let rejectIfTimeout = () => {
                setTimeout(() => {
                    if (this.peripheral == null) {
                        reject("Tempo limite para conexão expirou")
                    }
                }, 10000)
            }

            this.ble.scan([], 8).subscribe(connectIfDeviceIsRight, scanError)

            rejectIfTimeout()
        })


    }

    //Sample Rate
    getSampleRate() {
        return this.sampleRate;
    }

    getPacketRate() {
        return this.sampleFrequency;
    }

    getSamplesPerPacket() {
        return Math.round(this.sampleRate / this.sampleFrequency);
    }


    //Permissões e status dos periféricos
    isBluetoothEnabled() {
        if (this.bleEnabled)
            return true;
        else return false;
    }

    isLocationEnabled() {
        return this.locationEnabled;
    }

    isConnected() {
        return this.bleConnected;
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