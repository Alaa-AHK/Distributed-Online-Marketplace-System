import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private _AuthService:AuthService,private router:Router){}
login=new FormGroup({
  email:new FormControl(null,[Validators.email,Validators.required]),
  password:new FormControl(null,[Validators.required])
})
sendData(){
  if(this.login.valid){
 this._AuthService.login(this.login.value).subscribe({
    next:(res)=>{
      console.log(res);
      localStorage.setItem("Authorization", 'Bearer ' + res.token);
    this.router.navigate(['/home'])},
    error:(err)=>{console.log(err)},
    complete:()=>{console.log("complete")}
  })
  }
 
  
}
}
