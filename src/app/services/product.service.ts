import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment.development';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly urlBase = `${environment.apiUrl}/ipf-msa-productosfinancieros/`;

  constructor(
    private http: HttpClient
  ) { }


  getProducts() {
    return this.http.get<Product[]>(`${this.urlBase}bp/products`);
  }

  addProduct(body: Product) {
    return this.http.post<Product>(`${this.urlBase}bp/products`, body);
  }

  editProduct(body: Product) {
    return this.http.put<Product>(`${this.urlBase}bp/products`, body);
  }

  removeProduct(id: string) {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(`${this.urlBase}bp/products`, { params, responseType: 'text' });
  }

  uniqueProductId(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      let params = new HttpParams();
      params = params.append('id', control.value);
      return this.http.get<boolean>(`${this.urlBase}bp/products/verification`, { params })
        .pipe(
          map(existId => (existId ? { uniqueId: true } : null)),
          catchError(() => of(null))
        )
    };
  }
}
