import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { firebaseConfig } from '../../app.firebaseconfig';
import * as firebase from 'firebase';

import { Request } from 'src/app/models/Request';
import { AlertController, Platform } from '@ionic/angular';
import { ChatService } from 'src/app/service/chat.service';

// firebase.initializeApp(firebaseConfig);

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  firedata = firebase.database().ref('/chatusers');

  friends: any[];
  newReq: Request ={
    sender: '',
    reciever: ''
  };

  constructor(
    private router: Router,
    private alertCntrl: AlertController,
    private chatService: ChatService,
    private platform: Platform
  ) { }

  async presentAlert() {
    const alert = await this.alertCntrl.create({
      message: 'You Can Not Chat With Your Self',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    this.firedata.orderByChild('uid').once('value',(snapshot) => {
      let user = snapshot.val()
      let temp =[]
      for(var key in user){
        temp.push(user[key])
      }
      this.friends = temp
    },
    error => console.log(error)
  )
  }

  backButtonSubscription; 

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(2,() => {
      navigator['app'].exitApp();
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  chat(user){
    this.newReq.sender = firebase.auth().currentUser.uid
    this.newReq.reciever = user.uid
    if(this.newReq.sender == this.newReq.reciever)
      this.presentAlert()
    else{
      this.chatService.init(user)
      this.router.navigateByUrl('/chatpage')
    }
  }

}
