import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { filter } from 'rxjs';

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

  it('should add a product', () => {
    // const dto = {
    //   id: '1',
    //   name: 'name',
    //   date_release: new Date(),
    //   date_revision: new Date(),
    //   description: 'description',
    //   logo: 'logo',
    // };
    // service
    //   .addProduct(dto)
    //   .pipe(filter((response) => !!response?.status))
    //   .subscribe((data) => {
    //     console.log(data);
    //     expect(data).toEqual(dto);
    //   });
    // try {
    //   const req = httpTestingController.expectOne(
    //     'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products'
    //     );
    //     req.request.headers.set('authorId', '103');
    //     expect(req.request.method).toEqual('POST');
    //     req.flush(dto);
    //   } catch (error) {
    //   console.log(error);
    //   }
    //     tick();
  });

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
    req.request.headers.set('authorId', '103');
    expect(req.request.method).toEqual('GET');

    req.flush(testData);

    tick();
  }));
});
