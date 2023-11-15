import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { DestroyComponent } from '../destroy/destroy.component';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent extends DestroyComponent {

  removing = false;

  constructor(
    private dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public product: Product,
    private productService: ProductService
  ) {
    super();
  }

  close() {
    this.dialogRef.close();
  }

  removeProduct() {
    this.removing = true;
    this.productService.removeProduct(this.product.id)
      .pipe(
        finalize(() => this.removing = false),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.dialogRef.close(this.product.id));
  }

}
