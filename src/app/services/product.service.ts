import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment.development';

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
}
