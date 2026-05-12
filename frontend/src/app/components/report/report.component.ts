import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReportService } from '../../Services/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {

  loading = true;
  error = false;

  userRole: string = '';

  orders: any[] = [];
  transactions: any[] = [];
  users: any[] = [];

  totalOrders = 0;
  totalRevenue = 0;
  totalTransactions = 0;

  statusCounts: { label: string; count: number; color: string }[] = [];

  paymentCounts: { label: string; count: number }[] = [];

  monthlySpend: { month: string; total: number }[] = [];

  maxMonthlySpend = 1;

  constructor(
    private _ReportService: ReportService,
    private _Router: Router
  ) {}

  ngOnInit(): void {

    this.extractUserRole();

    if (this.userRole !== 'admin') {

      this.error = true;

      this.loading = false;

      this._Router.navigate(['/home']);

      return;
    }

    this.loadReport();
  }

  extractUserRole() {

    const token = localStorage.getItem('Authorization');

    if (!token) return;

    try {

      const pureToken = token.split(' ')[1];

      const decoded: any =
        JSON.parse(atob(pureToken.split('.')[1]));

      this.userRole = decoded.role;

      console.log('User Role:', this.userRole);

    } catch (e) {

      console.log('Error decoding token', e);
    }
  }

  loadReport(): void {

    this._ReportService.getSummaryReport().subscribe({

      next: (res) => {

        this.orders = res.orders || [];

        this.transactions = res.transactions || [];

        this.users = res.users || [];

        this.totalRevenue = res.totalRevenue || 0;

        this.totalTransactions =
          res.totalTransactions || 0;

        this.computeStats();

        this.loading = false;
      },

      error: (err) => {

        console.log(err);

        this.error = true;

        this.loading = false;
      }
    });
  }

  private computeStats(): void {

    this.totalOrders = this.orders.length;

    const statusColors: Record<string, string> = {

      pending: '#f59e0b',
      paid: '#10b981',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#06b6d4',
      cancelled: '#ef4444'
    };

    const statusMap: Record<string, number> = {};

    this.orders.forEach(o => {

      const s = o.status || 'pending';

      statusMap[s] = (statusMap[s] || 0) + 1;
    });

    this.statusCounts = Object.entries(statusMap).map(
      ([label, count]) => ({

        label,
        count,
        color: statusColors[label] || '#6b7280'
      })
    );

    const payMap: Record<string, number> = {};

    this.orders.forEach(o => {

      const p = o.paymentMethod || 'COD';

      payMap[p] = (payMap[p] || 0) + 1;
    });

    this.paymentCounts = Object.entries(payMap).map(
      ([label, count]) => ({

        label,
        count
      })
    );

    const monthMap: Record<string, number> = {};

    this.orders.forEach(o => {

      if (!o.createdAt) return;

      const d = new Date(o.createdAt);

      const k =
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      monthMap[k] =
        (monthMap[k] || 0) + (o.totalPrice || 0);
    });

    this.monthlySpend = Object.entries(monthMap)

      .sort(([a], [b]) => a.localeCompare(b))

      .slice(-6)

      .map(([month, total]) => ({

        month,
        total
      }));

    this.maxMonthlySpend = Math.max(
      ...this.monthlySpend.map(m => m.total),
      1
    );
  }

  
  barWidth(v: number, max: number) {
    return `${Math.round((v / max) * 100)}%`;
  }

  formatMonth(m: string) {

    const [y, mo] = m.split('-');

    return `${[
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ][+mo - 1]} ${y}`;
  }

  getStatusColor(s: string) {

    return ({
      pending:'#f59e0b',
      paid:'#10b981',
      processing:'#3b82f6',
      shipped:'#8b5cf6',
      delivered:'#06b6d4',
      cancelled:'#ef4444'

    } as any)[s] || '#6b7280';
  }

  donutDash(count: number, total: number) {

    const circ = 2 * Math.PI * 40;

    return `${(count / total) * circ}
            ${circ - (count / total) * circ}`;
  }

  getDonutOffset(index: number) {

    const circ = 2 * Math.PI * 40;

    let off = circ * 0.25;

    for (let i = 0; i < index; i++) {

      off -=
        (this.statusCounts[i].count / this.totalOrders)
        * circ;
    }

    return `${off}`;
  }
}