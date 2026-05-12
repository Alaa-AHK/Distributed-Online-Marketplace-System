import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
    export class ReportService {

    private baseUrl = 'http://localhost:3000/report';

    constructor(private _HttpClient: HttpClient) {}

    private getHeaders(): HttpHeaders {

        const token = localStorage.getItem("Authorization") || '';

        return new HttpHeaders().set('Authorization', token);
    }

    isAdmin(): boolean {

        const role = localStorage.getItem('userRole')?.toLowerCase();

        return role === 'admin';
    }

    getSummaryReport(): Observable<any> {

    const token = localStorage.getItem('Authorization');

    const headers = new HttpHeaders().set(
        'Authorization',
        token || ''
    );

    return this._HttpClient.get(
        `${this.baseUrl}/summary`,
        { headers }
    );
    }
    }