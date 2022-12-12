import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class NgxService {
  constructor(private http: HttpClient) {}
  getPdf(ob: string): Observable<any> {
    let postData = {
      data: ob,
    };
    return this.http.post('http://localhost:4000/', postData);
  }
}
