import { DataSourceProduct } from './data-source';
import { Product } from '../../models/product.model';
import { firstValueFrom } from 'rxjs';

describe('Product Datasource', () => {
  let dataSource: DataSourceProduct;
  let products: Product[];

  beforeEach(async () => {
    dataSource = new DataSourceProduct();
    products = [];
    for (let i = 0; i < 32; i++) {
      products.push({
        id: i.toString(),
        name: `#ITEM_${i}`,
        date_release: new Date(),
        date_revision: new Date(),
        description: (Math.random() * 100).toString(),
        logo: (Math.random() * 100).toString(),
      });
    }
  });

  afterEach(() => {
    dataSource.data.unsubscribe();
  });

  it('should create product list and emit a subset of products', async () => {
    expect(dataSource.totalPage).toBe(0);
    dataSource.init(products, 7);
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(7);
    expect(dataSource.totalPage).toBe(5);
  });

  it('should find and item', async () => {
    dataSource.init(products, 10);
    dataSource.find('#ITEM_1');
    dataSource.find('#ITEM_1');
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(10);
    expect(dataSource.total).toBe(11);
    expect(dataSource.hasNext).toBe(true);
    expect(dataSource.hasPrev).toBe(false);
  });

  it('should find and item case insensitive', async () => {
    dataSource.init(products, 10);
    dataSource.find('#item_1');
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(10);
    expect(dataSource.total).toBe(11);
    expect(dataSource.hasNext).toBe(true);
    expect(dataSource.hasPrev).toBe(false);
  });

  it('should change page size', async () => {
    dataSource.init(products, 5);
    dataSource.changePageSize(17);
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(17);
  });

  it('should update a product', async () => {
    dataSource.init(products, 30);
    const newName = 'New product name';
    const old = products.find((item) => item.id === (12).toString());
    dataSource.update((12).toString(), {
      name: newName,
    });
    const result = await firstValueFrom(dataSource.data);
    const updated = result.find((item) => item.id === (12).toString());
    expect(updated).not.toBeNull();
    expect(updated).toEqual({ ...old, name: newName });
  });

  it('update id that does not exist', async () => {
    dataSource.init(products, 30);
    jest.spyOn(dataSource, 'update');
    dataSource.update((100).toString(), {
      name: 'Test',
    });
    expect(dataSource.update).toHaveReturned();
  });

  it('should delete a product', async () => {
    dataSource.init(products, 5);
    dataSource.delete((12).toString());
    let result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(5);
    expect(dataSource.total).toBe(31);
    expect(dataSource.totalPage).toBe(7);
    expect(dataSource.hasNext).toBe(true);
    expect(dataSource.hasPrev).toBe(false);
    dataSource.delete((1).toString());
    dataSource.delete((2).toString());
    expect(dataSource.total).toBe(29);
    expect(dataSource.totalPage).toBe(6);
  });

  it('should paginate next and prev', async () => {
    dataSource.init(products, 10);
    await firstValueFrom(dataSource.data);
    dataSource.next();
    dataSource.next();
    expect(dataSource.hasPrev).toBe(true);
    expect(dataSource.hasNext).toBe(true);
    dataSource.prev();
    expect(dataSource.hasPrev).toBe(true);
    expect(dataSource.hasNext).toBe(true);
    dataSource.prev();
    expect(dataSource.hasPrev).toBe(false);
    expect(dataSource.hasNext).toBe(true);
    dataSource.next();
    dataSource.next();
    dataSource.next();
    expect(dataSource.hasPrev).toBe(true);
    expect(dataSource.hasNext).toBe(false);
  });

  it('should find items and update', async () => {
    dataSource.init(products, 10);
    dataSource.find('#ITEM_1');
    dataSource.update((1).toString(), {
      name: 'Change product name',
    });
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(10);
    expect(dataSource.total).toBe(10);
    expect(dataSource.hasNext).toBe(false);
    expect(dataSource.hasPrev).toBe(false);
  });


  it('should change the pagination and maintain the search criteria', async () => {
    dataSource.init(products, 10);
    dataSource.find('#ITEM_1');
    dataSource.changePageSize(15);
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(11);
    expect(dataSource.total).toBe(11);
  });

  it('should do not give error when you try to paginate without existing', async () => {
    dataSource.init(products, 50);
    jest.spyOn(dataSource, 'prev');
    dataSource.prev()
    expect(dataSource.prev).toHaveReturned();
    jest.spyOn(dataSource, 'next');
    dataSource.next()
    expect(dataSource.next).toHaveReturned();
  });
});
