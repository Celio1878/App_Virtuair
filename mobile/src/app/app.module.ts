import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
//import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

// Import the AF2 Module
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// Import moment module
import { MomentModule } from 'angular2-moment';

// import services e provider
// end import services e provider

// import pages
import { LoginPage } from '../pages/login/login';
import { RescuePage } from '../pages/rescue/rescue';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { TrainingInstructionsPage } from '../pages/training-instructions/training-instructions';
import { TrainingPage } from '../pages/training/training';
import { TrainingResultPage } from '../pages/training-result/training-result';
import { PmiInstructionsPage } from '../pages/pmi-instructions/pmi-instructions';
import { PmiPage } from '../pages/pmi/pmi';
import { PmiResultPage } from '../pages/pmi-result/pmi-result';
import { DeviceConnectPage } from '../pages/device-connect/device-connect';
import { ConfigPage } from '../pages/config/config'
// end import pages

import { BLE } from '@ionic-native/ble/ngx';
import { NativeAudio } from "@ionic-native/native-audio/ngx";

import {CRMService} from "../providers/crm-service";
import { DeviceService } from '../services/device-service';

import { environment } from '../environment';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { HostListener } from "@angular/core";

import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { Vibration } from '@ionic-native/vibration/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignInPage,
    RescuePage,
    HomePage,
    TrainingInstructionsPage,
    TrainingPage,
    TrainingResultPage,
    PmiInstructionsPage,
    PmiPage,
    PmiResultPage,
    DeviceConnectPage,
    ConfigPage,
  ],
  imports: [
    BrowserModule,
    //BrowserAnimationsModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MomentModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
    }),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignInPage,
    RescuePage,
    HomePage,
    TrainingInstructionsPage,
    TrainingPage,
    TrainingResultPage,
    PmiInstructionsPage,
    PmiPage,
    PmiResultPage,
    DeviceConnectPage,
    ConfigPage,
  ],
  providers: [
    SplashScreen,
    BLE,
    NativeAudio,
    CRMService,
    /* import services */
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeviceService,

    Diagnostic,
    LocationAccuracy,
    Vibration,

    InAppBrowser,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
