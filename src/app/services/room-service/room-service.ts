import { Injectable } from '@angular/core';

import { Room } from '../../models/Room';

import { AuthService } from './../auth-service/auth-service';
import { UserService } from './../user-service/user-service';

import { ToastController } from '@ionic/angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private rooms: Observable<Room[]>;
  private roomsCollection: AngularFirestoreCollection<Room>;

  constructor(private afs: AngularFirestore, private auth: AuthService, private userService: UserService, private toastController: ToastController) {
    this.roomsCollection = this.afs.collection<Room>('rooms');
    this.rooms = this.roomsCollection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;

              let creator =  null;
              //if(data.creator) creator = this.userService.getUser(data.creator.id);

              return { id, ...data };
            });
          })
    );
  }

  getRooms(): Observable<Room[]> {
    return this.rooms;
  }

  getRoom(id: string): Observable<Room> {
    return this.roomsCollection.doc<Room>(id).valueChanges().pipe(
      take(1),
      map(room => {
        console.log("bla");
        room.id = id;
        return room
      })
    );
  }

  getRoomTest(id: string): Observable<Room> {
    // @ts-ignore
    return this.roomsCollection.doc<Room>(id).snapshotChanges();
  }

  addRoom(room: Room): Promise<DocumentReference> {
    return new Promise<any>((resolve, reject) => {
      this.auth.getUid().then( (userId :string) => {
        console.log(this.auth.currentUserRef.ref);
        room.creator = this.auth.currentUserRef.ref;
        room.createdAt = new Date();
        console.log(room);
        //room = JSON.parse(JSON.stringify(room));
        return resolve(this.roomsCollection.add(room));
      });
    });
  }

  updateRoom(room: Room): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.auth.getUid().then( (userId :string) => {
        room.creator = userId;
        return resolve(this.roomsCollection.doc(room.id).set(room));
      });
    });
  }

  deleteRoom(id: string): Promise<void> {
    return this.roomsCollection.doc(id).delete();
  }

  joinRoom(room: Room): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.auth.getUid().then( (userId: string) => {
        userId = userId;

        if(!Array.isArray(room.participants)) room.participants = [];
        if(room.participants.filter( part => part.id == this.auth.currentUserRef.ref.id).length == 0){
           room.participants.push(this.auth.currentUserRef.ref);
           return resolve(this.roomsCollection.doc(room.id).update({participants: room.participants}));
        } else {
          return resolve();
        }
      });
    });
  }

  leaveRoom(room: Room): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.auth.getUid().then( (userId: string) => {
        userId = userId;
        if(!Array.isArray(room.participants)) room.participants = [];
        if(room.participants.filter( part => part.id == this.auth.currentUserRef.ref.id).length != 0){
           room.participants.splice(room.participants.indexOf(this.auth.currentUserRef.ref),1);
           return resolve(this.roomsCollection.doc(room.id).update({participants: room.participants}));
        } else {
          return resolve();
        }
      });
    });
  }

  hasJoinedRoom(room: Room){
    if(!room || !Array.isArray(room.participants)) return false;
    return (room.participants.filter( part => part.id == this.auth.currentUserRef.ref.id).length != 0);
  }

  /*
    sudo Bring me a Beer
  */
  bringMeBeer(){
    return new Promise(async (resolve,reject) => {
      const toast = await this.toastController.create({
        message: '🍺 you sir deserve a beer!',
        duration: 2000
      });
      toast.present();
      resolve({beer: true, message: "you sir deserve a beer!"} as any);
    });
  }

}
