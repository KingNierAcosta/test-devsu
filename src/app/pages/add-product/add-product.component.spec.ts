import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { AddProductComponent } from './add-product.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../services/product.service';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let service: Partial<ProductService>;
  let product: Product;

  beforeEach(async () => {
    service = {
      uniqueProductId() {
        return (
          control: AbstractControl
        ): Observable<ValidationErrors | null> => {
          return of('').pipe(
            map((existId) => (existId ? { uniqueId: true } : null))
          );
        };
      },
      addProduct(body) {
        return of(null);
      },
      editProduct(body) {
        return of(product);
      },
    };

    product = {
      id: '111',
      name: `#ITEM_1`,
      date_release: new Date('2023-11-25'),
      date_revision: new Date(),
      description: '#ITEM_1#ITEM_1#ITEM_1#ITEM_1#ITEM_1#ITEM_1',
      logo: (Math.random() * 100).toString(),
    };

    await TestBed.configureTestingModule({
      imports: [AddProductComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [{ provide: ProductService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form on init', () => {
    const keys = [
      'id',
      'name',
      'description',
      'logo',
      'date_release',
      'date_revision',
    ];

    expect(Object.keys(component.form.getRawValue())).toEqual(keys);
  });

  it('should set product on edit', () => {
    component.id = product.id;
    component.product = product;
    component.ngOnInit();
    expect(component.form.getRawValue()).toEqual(product);
  });

  it('should update date_revision on release change', fakeAsync(() => {
    component.form.patchValue({ date_release: new Date() });
    tick(500);
    expect(component.form.get('date_revision')?.value).not.toBeNull();
  }));

  it('should not save if form is not valid', () => {
    const createProductSpy = jest.spyOn(component as any, 'createProduct');
    const editProductSpy = jest.spyOn(component as any, 'editProduct');
    component.onSaveForm();
    expect(createProductSpy.mock.calls).toHaveLength(0);
    expect(editProductSpy.mock.calls).toHaveLength(0);
  });

  it('should edit product on save', () => {
    const createProductSpy = jest.spyOn(component as any, 'createProduct');
    const editProductSpy = jest.spyOn(component as any, 'editProduct');
    component.form.patchValue(product);
    component.id = product.id;
    component.product = product;
    component.onSaveForm();
    expect(createProductSpy.mock.calls).toHaveLength(0);
    expect(editProductSpy.mock.calls).toHaveLength(1);
  });

  it('should create product on save', () => {
    const createProductSpy = jest.spyOn(component as any, 'createProduct');
    const editProductSpy = jest.spyOn(component as any, 'editProduct');
    component.form.patchValue(product);

    component.onSaveForm();
    expect(createProductSpy.mock.calls).toHaveLength(1);
    expect(editProductSpy.mock.calls).toHaveLength(0);
  });

  it('should gte product from router state', () => {
    const router = TestBed.inject(Router) as any;
    const mockNavigationExtras = {
      state: {
        data: product,
      },
    };

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({
      extras: mockNavigationExtras,
    });

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const p = {
      ...product,
      date_release: new Date(product.date_release)
        .toISOString()
        .substring(0, 10),
      date_revision: new Date(product.date_revision)
        .toISOString()
        .substring(0, 10),
    };
    expect(component.product).toEqual(p);
  });
});
