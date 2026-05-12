import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

 constructor(
  private authService: AuthService,
  private router: Router
) {}

  errorMessage: string = '';

  login = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  sendData() {

  if (this.login.valid) {

    this.authService.login(this.login.value).subscribe({

      next: (res) => {

        localStorage.setItem(
          "Authorization",
          "Bearer " + res.token
        );

        const decoded: any = JSON.parse(atob(res.token.split('.')[1]));

        this.authService.setRole(decoded.role);

        this.router.navigate(['/home']);
      },

      error: (err) => {
        this.errorMessage = err.error.message;
      }

    });

  }
}
}
