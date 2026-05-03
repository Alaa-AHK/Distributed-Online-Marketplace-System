import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { WalletService } from '../../Services/wallet.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = null;
  wallet: any;
  showEdit: boolean = false;

  editData: any = {
    userName: '',
    email: ''
  };
  showDeposit: boolean = false;
depositAmount: number = 0;

  constructor(private userService: UserService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getWallet();
    this.deposit()
  }
  deposit() {
  if (!this.depositAmount || this.depositAmount <= 0) {
    alert("Enter valid amount");
    return;
  }

  this.walletService.deposit(this.depositAmount).subscribe({
    next: (res) => {
      console.log("Deposit success:", res);

      // 🔄 تحديث الرصيد بعد الشحن
      this.getWallet();

      // reset
      this.depositAmount = 0;
      this.showDeposit = false;
    },
    error: (err) => console.log(err)
  });
}
  getWallet() {
  this.walletService.getMyWallet().subscribe({
    next: (res) => this.wallet = res.wallet,
    error: (err) => console.log(err)
  });
}

  getProfile() {
    this.userService.getMe().subscribe({
      next: (res) => {
        this.user = res.user;

        // fill edit form
        this.editData.userName = this.user.userName;
        this.editData.email = this.user.email;
      },
      error: (err) => console.log(err)
    });
  }

  updateProfile() {
    const userId = this.user._id;

    this.userService.updateUser(userId, this.editData).subscribe({
      next: (res) => {
        console.log("Updated:", res);

        this.user = res.updatedUser;
        this.showEdit = false;
      },
      error: (err) => console.log(err)
    });
  }
}
