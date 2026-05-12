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
    private _AuthService: AuthService,
    private router: Router,
    private authService: AuthService
  ) {}

  errorMessage: string = '';

  login = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  sendData() {

    if (this.login.valid) {

      this._AuthService.login(this.login.value).subscribe({

        next: (res) => {

          console.log(res);

          // 💾 SAVE TOKEN
          localStorage.setItem(
            "Authorization",
            "Bearer " + res.token
          );

          //DECODE ROLE
          const decoded: any = JSON.parse(atob(res.token.split('.')[1]));

          //UPDATE ROLE STATE (IMPORTANT)
          this.authService.setRole(decoded.role);

          //NAVIGATE
          this.router.navigate(['/home']);
        },

        error: (err) => {
          console.log(err);
          this.errorMessage = err.error.message;
        }

      });

    }
  }
}
