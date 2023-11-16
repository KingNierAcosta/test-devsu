import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { ProductService } from '../../services/product.service';
import { DestroyComponent } from '../../components/destroy/destroy.component';
import { DataSourceProduct } from './data-source';
import { debounceTime, filter, finalize, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { Product } from '../../models/product.model';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    CommonModule,
    CdkTableModule,
    OverlayModule,
    ReactiveFormsModule,
    RouterModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    DialogModule
  ]
})
export class ProductsComponent extends DestroyComponent implements OnInit {

  dataSource = new DataSourceProduct();
  columns: string[] = ['logo', 'name', 'description', 'date_release', 'date_revision', 'actions'];
  pageSizeOptions: number[] = [5, 10, 20];
  search = new FormControl('', { nonNullable: true });
  pageSize = new FormControl(this.pageSizeOptions[0], { nonNullable: true });
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: Dialog
  ) {
    super();
  }


  ngOnInit(): void {
    this.loading = true;
    this.productService.getProducts()
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.destroy$)
      )
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


  editProduct(element: Product) {
    this.router.navigate(['/edit', element.id], { state: { data: element } })
  }

  removeProduct(element: Product) {
    const modalRef = this.dialog.open(DeleteModalComponent, {
      data: element
    });

    modalRef.closed
      .pipe(
        filter(output => !!output),
        takeUntil(this.destroy$)
      )
      .subscribe(output => {
        this.dataSource.delete(output as string);
      })
  }

}
