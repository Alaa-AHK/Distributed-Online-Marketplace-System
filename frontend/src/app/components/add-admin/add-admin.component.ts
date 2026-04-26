import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
  constructor(private _UserService: UserService) {}
  Admin=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl(null,[Validators.required]),
    userName:new FormControl(null,[Validators.required])
  })

  addAdmin() {
    this._UserService.addAdmin(this.Admin.value).subscribe({
      next: (res) => {
        console.log('Admin added successfully', res);
        alert('Admin added successfully ');
      },
      error: (err) => {
        console.error('Error adding admin', err);
        alert('Error ');
      }
    });
  }

}
