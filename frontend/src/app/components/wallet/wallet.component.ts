import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../Services/wallet.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  wallet: any;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.getWallet();
  }

  getWallet() {
    this.walletService.getMyWallet().subscribe({
      next: (res) => {
        this.wallet = res.wallet;
        console.log(this.wallet);
      },
      error: (err) => console.log(err)
    });
  }
}
