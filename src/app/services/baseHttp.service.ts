import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISearchResponse } from '../models/iSearchResponse';

export class BaseHttpService<T> {

    private header: HttpHeaders  = new HttpHeaders();
    constructor(private httpClient: HttpClient,
                private baseUrl: string,
                private endpoint: string) {
        this.header.append('content-type', 'application/json');
        this.header.append('Access-Control-Allow-Origin', '*');
    }

    getList(httpParams: HttpParams): Observable<ISearchResponse> {
        return this.httpClient
        .get<ISearchResponse>(`${this.baseUrl}/${this.endpoint}` , {
            params: httpParams,
            headers: this.header
        } );
    }

    getById(id: string): Observable<T> {
     return this.httpClient
     .get<T>(`${this.baseUrl}/${this.endpoint}${id}`, {
        headers: this.header
     });
    }

    create(item: T): Observable<T> {
        return this.httpClient
          .post<T>(`${this.baseUrl + this.endpoint}`, item, {
              headers: this.header
          });
    }

    put(id: string,item: T): Observable<T> {
        return this.httpClient
          .put<T>(`${this.baseUrl}/${this.endpoint}/${id}`, item, {
              headers: this.header
          });
    }
}
