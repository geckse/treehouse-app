import { Injectable } from '@angular/core';

import { User } from '../../models/User';

import { AuthService } from './../auth-service/auth-service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: Observable<User[]>;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.usersCollection = this.afs.collection<User>('users');
      this.users = this.usersCollection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
    );
  }

  getUsers(): Observable<User[]> {
    return this.users;
  }

  getUser(id: string): Observable<User> {
    return this.usersCollection.doc<User>(id).valueChanges().pipe(
      take(1),
      map(user => {
        user.id = id;
        return user
      })
    );
  }

  addUser(user: User): Promise<DocumentReference> {
    return new Promise<any>((resolve, reject) => {
      this.auth.getUid().then( (userId :string) => {
        user.createdAt = new Date();
        user = JSON.parse(JSON.stringify(user));
        return resolve(this.usersCollection.add(user));
      });
    });
  }

  updateUser(user: User): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.auth.getUid().then( (userId :string) => {
        return resolve(this.usersCollection.doc(user.id).set(user));
      });
    });
  }

  deleteUser(id: string): Promise<void> {
    return this.usersCollection.doc(id).delete();
  }

}
