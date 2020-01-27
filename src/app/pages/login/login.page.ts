import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User

  constructor(
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signin(form) {
    this.user = form.value
    this.ngFireAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(() => {
      this.router.navigateByUrl('/tabs/chats')
      },
      error => console.log(error)
    )
  }

  signup() {
    this.router.navigateByUrl('/signup')
  }

}
