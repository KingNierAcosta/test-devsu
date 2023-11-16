import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Product } from '../../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';

export class DataSourceProduct extends DataSource<Product> {

  data = new BehaviorSubject<Product[]>([]);
  private _originalData: Product[] = [];
  private _filterData: Product[] = [];
  private _size: number = 5;
  private _totalPage!: number;
  private _currentPage: number = 1;
  private _query: string = '';

  override connect(collectionViewer: CollectionViewer): Observable<readonly Product[]> {
    return this.data;
  }

  override disconnect(collectionViewer: CollectionViewer): void {
    this.data.complete();
  }

  init(products: Product[], size: number) {
    products= [].concat(...Array(10).fill(products));
    this._size = size;
    this._totalPage = Math.ceil(products.length / size);
    this._currentPage = 1;
    this._originalData = products;
    this._filterData = products;
    this.data.next(products.slice(0, size));
  }

  update(id: string, changes: Partial<Product>) {
    const index = this._originalData.findIndex(it => it.id === id);
    if (index === -1) return;

    this._originalData[index] = {
      ...this._originalData[index],
      ...changes
    }
    this.verificateQueryAndUpdateData();
  }

  private verificateQueryAndUpdateData() {
    if (this._query.length) {
      const query = this._query;
      this._query = '';
      this.find(query);
    } else {
      this._filterData = this._originalData;
      this.updatePagination();
    }
  }


  find(query: string) {
    const lowerCaseQuery = query.trim().toLowerCase();
    if (lowerCaseQuery === this._query) return;
    this._query = lowerCaseQuery;

    this._filterData = this._originalData.filter(it => {
      const word = `${it.name}-${it.description}-${it.date_release}-${it.date_revision}`;
      return word.toLowerCase().includes(this._query)
    });
    this.updatePagination();
  }

  delete(id: string) {
    this._originalData = this._originalData.filter(it => it.id.toLowerCase() !== id.toLowerCase());
    this.verificateQueryAndUpdateData();
  }

  get count() {
    return this.data.getValue().length;
  }

  get total() {
    return this._filterData.length;
  }

  get totalPage() {
    return this._totalPage || 0;
  }

  get currentPage() {
    return this._currentPage;
  }

  changePageSize(size: number) {
    this._size = size;
    const query = this._query;
    this._query = '';
    !query.length ? this.resetData() : this.find(query);
  }

  get hasPrev(): boolean {
    return this._currentPage > 1;
  }

  prev() {
    if (!this.hasPrev) return;

    this._currentPage--;
    this.updatePagination();
  }

  get hasNext(): boolean {
    return this._currentPage < this._totalPage;
  }

  next() {
    if (!this.hasNext) return;

    this._currentPage++;
    this.updatePagination();
  }

  private updatePagination() {
    this._totalPage = Math.ceil(this._filterData.length / this._size);
    const startIndex = (this._currentPage - 1) * this._size;
    const endIndex = startIndex + this._size;
    this.data.next(this._filterData.slice(startIndex, endIndex));
  }

  private resetData() {
    this._filterData = this._originalData;
    this._currentPage = 1;
    this.updatePagination();
  }

}
