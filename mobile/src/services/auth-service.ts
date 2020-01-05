import { Injectable } from "@angular/core";
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
//import * as firebase from 'firebase/app';
import 'rxjs/add/operator/take'
//import { DEFAULT_AVATAR } from "./constants";

@Injectable()
export class AuthService {
  user: any;

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public storage: Storage) {

  }

  // get current user data from firebase
  getUserData() {
    // return this.afAuth.auth.currentUser;
  }

  // get passenger by id
  getUser(id) {
    // return this.db.object('users/' + id);
  }

  // login by email and password
  login(email, password) {
    // return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  // register new account
  register(email, password, name) {
    // return Observable.create(observer => {
    //   this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((authData: any) => {
    //     authData.name = name;
    //
    //     // update passenger object
    //     this.updateUserProfile(authData);
    //     observer.next();
    //   }).catch((error: any) => {
    //     if (error) {
    //       observer.error(error);
    //     }
    //   });
    // });
  }

  // update user display name and photo
  updateUserProfile(user) {
    // let name = user.name ? user.name : user.email;
    // let photoUrl = user.photoURL ? user.photoURL : DEFAULT_AVATAR;
    // let adress = user.adress ? user.adress : user.adress;
    // let numberAdress = user.numberAdress ? user.numberAdress : user.numberAdress;
    // let complement = user.complement ? user.complement : user.complement;
    // let district = user.district ? user.district : user.district;
    // let city = user.city ? user.city : user.city;
    // let state = user.state ? user.state : user.state;
    // let cep = user.cep ? user.cep : user.cep;
    //
    // this.getUserData().updateProfile(<any>{
    //   displayName: name,
    //   photoURL: photoUrl,
    //   adress: adress,
    //   numberAdress: numberAdress,
    //   complement: complement,
    //   district: district,
    //   city: city,
    //   state: state,
    //   cep: cep
    // });

    // var newKey = firebase.database().ref().child('users').push().key;
    // create or update pubs profile
    // this.db.object('users/' + user.uid).update({
    //   uid: user.uid,
    //   name: name,
    //   photoURL: photoUrl,
    //   email: user.email,
    //   phoneNumber: user.phoneNumber ? user.phoneNumber : '',
    //   adress: user.adress ? user.adress : '',
    //   numberAdress: user.numberAdress ? user.numberAdress : '',
    //   complement: user.complement ? user.complement : '',
    //   district: user.district ? user.district : '',
    //   city: user.city ? user.city : '',
    //   state: user.state ? user.state : '',
    //   cep: user.cep ? user.cep : '',
    //   userType: 'Cliente'
    // })
  }

  // create new user if not exist
  createUserIfNotExist(user) {
    // check if user does not exist
    // this.getUser(user.uid).take(1).subscribe(snapshot => {
    //   if (snapshot.$value === null) {
    //     // update passenger object
    //     this.updateUserProfile(user);
    //   }
    // });
  }
}
