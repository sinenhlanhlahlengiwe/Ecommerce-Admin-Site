import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FakestoreService } from '../../services/fakestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private fakestoreService: FakestoreService, private router: Router) {}

  login() {
    this.fakestoreService
      .login({ username: this.username, password: this.password })
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/products']);
        },
        (error) => {
          alert('Invalid credentials');
        }
      );
  }
}
