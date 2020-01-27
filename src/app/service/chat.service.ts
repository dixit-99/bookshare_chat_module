import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  firechat = firebase.database().ref('/chat');
  user: any;
  chatmessages = [];

  constructor(
    private events:Events
  ) {

  }

  init(user) {
    this.user = user
  }

  addnewmessage(msg) {
    if (this.user) {
      var promise = new Promise((resolve, reject) => {
        this.firechat.child(firebase.auth().currentUser.uid).child(this.user.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firechat.child(this.user.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
            }).catch((err) => {
              reject(err);
          })
        })
      })
      return promise;
    }
  }

  getbuddymessages() {
    
    let temp;
    this.firechat.child(firebase.auth().currentUser.uid).child(this.user.uid).on('value', (snapshot) => {
      this.chatmessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.chatmessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }

}
