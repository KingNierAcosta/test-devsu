import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { DeleteModalComponent } from './delete-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ProductService } from '../../services/product.service';
import { delay, of } from 'rxjs';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;
  let mokService: Partial<ProductService>;
  let mokDialogRef: DialogRef;
  const productId = '10';

  beforeEach(async () => {
    mokService = {
      removeProduct(id: string) {
        return of('').pipe(delay(2000));
      },
    };

    mokDialogRef = {
      close() {},
    } as DialogRef;

    await TestBed.configureTestingModule({
      imports: [DeleteModalComponent],
      providers: [
        { provide: DialogRef, useValue: mokDialogRef },
        { provide: DIALOG_DATA, useValue: { id: productId } },
        { provide: ProductService, useValue: mokService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    jest.spyOn(mokDialogRef, 'close');
    component.close();
    expect(mokDialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog after remove product', fakeAsync(() => {
    jest.spyOn(mokService, 'removeProduct');
    jest.spyOn(mokDialogRef, 'close');
    component.removeProduct();
    tick(2000);
    expect(mokService.removeProduct).toHaveBeenCalledWith(productId);
    expect(mokService.removeProduct).toHaveBeenCalledTimes(1);
    expect(mokDialogRef.close).toHaveBeenCalledTimes(1);
  }));
});
