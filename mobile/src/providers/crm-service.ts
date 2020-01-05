import { Inject, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import * as firebase from "firebase/app";
import "firebase/database";

import { FirebaseApp } from '@angular/fire';

@Injectable()
export class CRMService {
  currentSerial: string;
  userId: string = null;
  connectionObject: any;
  dbRef: string;
  userEmail: string = null;
  sdkDb: any;
  constructor(private db: AngularFireDatabase, @Inject(FirebaseApp) fb: FirebaseApp) {
    this.sdkDb = fb.database();
    this.currentSerial = '';
  }
  setCurrentSerial(serial: string):Promise<void> {
    this.currentSerial = serial;

    return new Promise<void>(async (resolve,reject) => {
      this.db.list('avaliableForConnection', ref => ref.orderByChild('deviceSerial').equalTo(serial))
      .valueChanges().subscribe(values => {
        if (values && values[0]) {
          this.connectionObject = values[0];
          resolve()
        } else {
          //console.error('Dispositivo não registrado, favor entrar em contato com o fornecedor');
          let error  = new Error('Dispositivo não registrado, favor entrar em contato com o fornecedor')
          reject(error)
          
        }
      }, err => { new Error('Firebase subscribe error'); reject(err) })
    })
    
    
  }
  savePMIResult(result: number) {
    const newKey = this.sdkDb.ref('results').push().key;
    let dataToSave = {}
    let pmiTest = {
      date: firebase.database.ServerValue.TIMESTAMP,
      result: result,
      device: this.currentSerial,
      clientId: this.connectionObject.clientId,
      clientEmail: this.connectionObject.clientEmail,
      partner: this.connectionObject.owner,
      key: newKey
    }
    dataToSave[`pmiPerClient/${this.connectionObject.clientId}/${newKey}/`] = pmiTest;
    return this.sdkDb.ref().update(dataToSave);
  }
  saveTrainingResult(result: any) {
    const newKey = this.sdkDb.ref('results').push().key;
    let dataToSave = {}
    let trainingTest = {
      date: firebase.database.ServerValue.TIMESTAMP,
      mean: result.med,
      efficacy: result.efficacy,
      device: this.currentSerial,
      clientId: this.connectionObject.clientId,
      clientEmail: this.connectionObject.clientEmail,
      partner: this.connectionObject.owner,
      key: newKey
    }
    dataToSave[`trainingPerClient/${this.connectionObject.clientId}/${newKey}/`] = trainingTest;
    return this.sdkDb.ref().update(dataToSave);
  }
 
}
