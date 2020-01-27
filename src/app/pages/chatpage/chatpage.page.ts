import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';
import { Events, Platform, IonContent } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.page.html',
  styleUrls: ['./chatpage.page.scss'],
})
export class ChatpagePage implements OnInit {
  
  @ViewChild("scrollElement",{read:'',static:true}) content: IonContent;
  user: any;
  newmessage;
  allmessages = [];

  constructor(
    private chatService: ChatService,
    private events: Events,
    private platform: Platform
  ) { 
    this.user = this.chatService.user
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.allmessages = this.chatService.chatmessages;
      this.content.scrollToBottom();
    })
  }

  ngOnInit() {
  }

  backButtonSubscription; 

  ionViewWillEnter() {
    this.chatService.getbuddymessages();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10,() => {
      window.history.back();
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  addmessage() {
    if(this.newmessage == ' ')
      console.log("blank");
    else{
      let msg = this.newmessage;
      this.newmessage = '';
      this.chatService.addnewmessage(msg).then(() => {
        this.content.scrollToBottom();
      })
    }
  }

}
