import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { ProductService } from '../../services/product.service';
import { DestroyComponent } from '../../components/destroy/destroy.component';
import { DataSourceProduct } from './data-source';
import { debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    CommonModule,
    CdkTableModule,
    ReactiveFormsModule
  ],
  providers: [
    ProductService
  ]
})
export class ProductsComponent extends DestroyComponent implements OnInit {

  dataSource = new DataSourceProduct();
  columns: string[] = ['logo', 'name', 'description', 'date_release', 'date_revision', 'actions'];
  pageSizeOptions: number[] = [5, 10, 20];
  search = new FormControl('', { nonNullable: true });
  pageSize = new FormControl(this.pageSizeOptions[0], { nonNullable: true });

  constructor(
    private productService: ProductService,
  ) {
    super();
  }


  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => this.dataSource.init(products, this.pageSizeOptions[0]));

    this.search.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(search => this.dataSource.find(search));

    this.pageSize.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(size => this.dataSource.changePageSize(size));
  }

  changeSize(size: number) {
    console.log(size);

  }

}
