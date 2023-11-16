import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponent } from './add-product.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../services/product.service';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, of } from 'rxjs';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let service: Partial<ProductService>;

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
});
