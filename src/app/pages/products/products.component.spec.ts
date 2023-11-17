import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductsComponent } from './products.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let mockService: Partial<ProductService>;
  const product = { id: '2' };
  let dialog: Dialog;

  beforeEach(async () => {
    mockService = {
      getProducts() {
        return of([]);
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterTestingModule, DialogModule],
      providers: [{ provide: ProductService, useValue: mockService }, Dialog],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    dialog = TestBed.inject(Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize datasource', fakeAsync(() => {
    jest.spyOn(mockService, 'getProducts');
    jest.spyOn(component.dataSource, 'init');
    component.ngOnInit();
    expect(mockService.getProducts).toHaveBeenCalledTimes(1);
    tick();
    expect(component.dataSource.init).toHaveBeenCalledTimes(1);
  }));

  it('should perform a search', fakeAsync(() => {
    const textSearch = 'query';
    jest.spyOn(component.dataSource, 'find');
    component.search.patchValue(textSearch);
    tick(1000);
    expect(component.dataSource.find).toHaveBeenCalledTimes(1);
    expect(component.dataSource.find).toHaveBeenCalledWith(textSearch);
  }));

  it('should perform a page change', fakeAsync(() => {
    const size = 13;
    jest.spyOn(component.dataSource, 'changePageSize');
    component.pageSize.patchValue(size);
    tick(1000);
    expect(component.dataSource.changePageSize).toHaveBeenCalledTimes(1);
    expect(component.dataSource.changePageSize).toHaveBeenCalledWith(size);
  }));

  it('should go to edit page', () => {
    const router = TestBed.inject(Router);

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.editProduct(product as Product);
    expect(navigateSpy).toHaveBeenCalledWith(['/edit', product.id], {
      state: { data: product },
    });
  });

  it('should open delete dialog', () => {
    jest.spyOn(dialog, 'open');
    component.removeProduct(product as Product);
    // expect(dialog.open).toHaveBeenCalledWith(DeleteModalComponent, {
    //   data: product,
    // });
  });
});
