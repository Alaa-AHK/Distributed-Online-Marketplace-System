import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  userRole: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.role$.subscribe(role => {
      this.userRole = role;
      this.isLoggedIn = !!role;
      console.log("Navbar Role Updated:", role);
    });

  }
  logout() {
    localStorage.removeItem('Authorization');
    this.authService.setRole(null);
    this.router.navigate(['/login']);
  }
}
