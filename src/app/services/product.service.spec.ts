import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Observable, filter } from 'rxjs';
import { Product } from '../models/product.model';
import { FormControl, ValidationErrors } from '@angular/forms';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    service = TestBed.inject(ProductService);
    expect(service).toBeTruthy();
  });

  it('should add a product', fakeAsync(() => {
    const dto = {
      id: '1',
      name: 'name',
      date_release: new Date(),
      date_revision: new Date(),
      description: 'description',
      logo: 'logo',
    };

    service.addProduct(dto)
      .pipe(filter((response) => !!response?.status))
      .subscribe((data) => {
        expect(data.status).toBe(200);
        expect(data.body).toEqual(dto);
      });

    const req = httpTestingController.expectOne(
      'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products'
    );
    expect(req.request.method).toEqual('POST');

    req.flush(dto);
    tick();
  }));

  it('should get all items from the API', fakeAsync(() => {
    const testData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    service.getProducts().subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products'
    );
    expect(req.request.method).toEqual('GET');

    req.flush(testData);
    tick();
  }));

  it('should edit item from the API', fakeAsync(() => {
    const testData = {
      id: '#item_1',
      name: 'Test'
    }

    service.editProduct(testData as Product).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products'
    );
    expect(req.request.method).toEqual('PUT');

    req.flush(testData);
    tick();
  }));

  it('should delete item from the API', fakeAsync(() => {
    const itemId = 'item-1';
    const returnMsg = 'Product successfully removed';

    service.removeProduct(itemId).subscribe((data) => {
      expect(data).toBe(returnMsg);
    });

    const req = httpTestingController.expectOne(
      `https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products?id=${itemId}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush(returnMsg);
    tick();
  }));

  it('should return null for a unique product ID', fakeAsync(() => {
    const control = new FormControl('uniqueIdValue');
    (service.uniqueProductId()(control) as Observable<ValidationErrors | null>)
      .subscribe((result: ValidationErrors | null) => {
        expect(result).toBeNull();
      });

    const req = httpTestingController.expectOne('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=uniqueIdValue');
    expect(req.request.method).toEqual('GET');
    req.flush(false);
    tick();
  }));

  it('should return uniqueId error for a non-unique product ID', () => {
    const control = new FormControl('nonUniqueIdValue');
    (service.uniqueProductId()(control) as Observable<ValidationErrors | null>)
      .subscribe((result: ValidationErrors | null) => {
        expect(result).toEqual({ uniqueId: true });
      });

    const req = httpTestingController.expectOne('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=nonUniqueIdValue');
    req.flush(true);
  });

  it('should return null and handle error gracefully', () => {
    const control = new FormControl('someValue');
    (service.uniqueProductId()(control) as Observable<ValidationErrors | null>)
      .subscribe((result: ValidationErrors | null) => {
        expect(result).toBeNull();
      });

    const req = httpTestingController.expectOne('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=someValue');
    req.error(new ProgressEvent('Progress'));
  });


});
