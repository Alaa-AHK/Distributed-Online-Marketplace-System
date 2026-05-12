import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiAnswerResponse {
  answer: string;
  error?: string;
  raw?: string;
}

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<AiAnswerResponse> {
    return this.http.post<AiAnswerResponse>(`${this.apiUrl}/ai/ask`, { question });
  }
}
