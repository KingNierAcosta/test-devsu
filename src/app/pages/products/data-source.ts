import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Product } from '../../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';

export class DataSourceProduct extends DataSource<Product> {

  data = new BehaviorSubject<Product[]>([]);
  originalData: Product[] = [];

  override connect(collectionViewer: CollectionViewer): Observable<readonly Product[]> {
    return this.data;
  }

  override disconnect(collectionViewer: CollectionViewer): void {
    this.data.complete();
  }

  init(products: Product[], size: number) {
    this.data.next(products.slice(0, size));
    this.originalData = products;
  }

  update(id: string, changes: Partial<Product>) {
    const products = this.data.getValue();
    const index = products.findIndex(it => it.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...changes
      }
      this.data.next(products);
    }
  }

  find(query: string) {
    const newProducts = this.originalData.filter(it => {
      const word = `${it.name}-${it.description}-${it.date_release}-${it.date_revision}`;
      return word.toLowerCase().includes(query.toLowerCase())
    });
    this.data.next(newProducts);
  }

  get count() {
    return this.data.getValue().length;
  }

  get total() {
    return this.originalData.length;
  }

  changePageSize(size: number) {
    this.data.next(this.originalData.slice(0, size));
  }

}
