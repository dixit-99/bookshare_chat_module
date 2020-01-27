import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  firedata = firebase.database().ref('/chatusers');

  constructor(
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signup(form) {
    this.ngFireAuth.auth.createUserWithEmailAndPassword(form.value.email, form.value.password).then(() => {
        this.ngFireAuth.auth.currentUser.updateProfile({
         displayName: form.value.nickName 
        }).then(() => {
          this.firedata.child(this.ngFireAuth.auth.currentUser.uid).set({
            uid: this.ngFireAuth.auth.currentUser.uid,
            displayName: form.value.nickName
          }).then(() => {
              this.router.navigateByUrl('/tabs/chats')
            },
            error => console.log(error)
          )
        })
      }
    )
  }

}
