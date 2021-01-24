import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

// @ts-ignore
import { auth } from 'firebase/app';

import { User } from '../../models/User';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  fireUser: any;
  currentUser: User;

  constructor(
      private http: HttpClient,
      public afs: AngularFirestore,
      public afAuth: AngularFireAuth
    ){
      this.reviveFromCache().then(()=>{}).catch((e)=>{
      });
  }

  // Sign in with email/password
  public emailLogin(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result);
        resolve(this.currentUser);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /*
   Send email verfificaiton when new user sign up
  */
  public sendVerificationMail() {
   return new Promise<any>(async (resolve, reject) => {
      (await this.afAuth.currentUser).sendEmailVerification()
      .then(() => {
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /*
    Reset Forggot password
  */
  public forgotPassword(passwordResetEmail: string) {
    return new Promise<any>((resolve, reject) => {
     this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  private setUserData(fireUser): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      this.fireUser = fireUser;
      let user = fireUser.user;

      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

      let userData: User = {
        uid: user.uid,
        created: (user.created ? user.created : new Date()),
        lastLogin: new Date(),
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      }

      userData = JSON.parse(JSON.stringify(userData));
      return resolve(userRef.set(userData, {
        merge: true
      }));
    });
  }
  public updateUserMail(newMail){
    return new Promise(async (resolve, reject) => {
      (await this.afAuth.currentUser).updateEmail(newMail).then((res)=>{
        // @ts-ignore
        resolve(res);
      }).catch((err) =>{
        reject(err);
      });
    });
  }
  public updateUser(){
    return this.setUserData(this.currentUser);
  }

  // Returns true when user is looged in
  public isLoggedIn(): boolean {
    return (this.currentUser) ? true : false;
  }

  public isAnon(): boolean {
    return (!this.currentUser.email) ? true : false;
  }

  public getUid(): Promise<string> {
    return new Promise((resolve, reject) => {
      if(!this.currentUser){
        this.reviveFromCache().then(()=>{
          return resolve(this.currentUser.uid);
        }).catch((e)=>{});
      } else {
          return resolve(this.currentUser.uid);
      }
    });
  }

  public reviveFromCache(){
    return new Promise((resolve, reject) => {
      /* Saving user data in localstorage when
        logged in and setting up null when logged out */
      this.afAuth.authState.subscribe(user => {
          if (user) {
              this.fireUser = user;
              const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
              userRef.ref.get().then((doc)=>{
                // @ts-ignore
                this.currentUser = doc.data();
                resolve(this.currentUser);
              });
              // todo native storage fallback?
          } else {
            reject('session failed');
          }
      });
    });
  }

  /*
    get the ID Token for auth with API Sever (firebase ID Token)
  */
  public getAuthToken() : Promise<string> {
  	if(!this.currentUser) return new Promise((resolve,reject) => { resolve('');	});
  	return this.fireUser.getIdToken().then((token) => {
      return 'Bearer '+token;
    }).catch((e) => {
      console.error('AUTH-SERVICE: session probably died');
    });
  }

  /*
    check if session is loaded
  */
  public isReady(){
    return new Promise((resolve, reject) => {
      this.getUid().then( (uid) => {
        return resolve(uid);
      });
    });
  }


  /*
    logout
  */
  public logout(){
     return new Promise((resolve, reject) => {
       this.afAuth.signOut().then(() => {
         this.currentUser = null;
         resolve();
       }).catch(()=>{
         reject();
       });
     });
  }

  /*
    Delete everyting the user owns
  */
  public deleteCurrentUser(){
     return new Promise(async (resolve, reject) => {
       const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.currentUser.uid}`);
       userRef.ref.delete();
      (await this.afAuth.currentUser).delete();
     });
  }

}
