import { DataSourceProduct } from './data-source';
import { Product } from '../../models/product.model';
import { firstValueFrom } from 'rxjs';

describe('Product Datasource', () => {
  let dataSource: DataSourceProduct;
  let products: Product[];

  beforeEach(async () => {
    dataSource = new DataSourceProduct();
    products = [];
    for (let i = 0; i < 30; i++) {
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
    dataSource.init(products, 7);
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(7);
  });

  it('should find and item', async () => {
    dataSource.init(products, 10);
    dataSource.find('#ITEM_1');
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(11);
  });

  it('should find and item case insensitive', async () => {
    dataSource.init(products, 10);
    dataSource.find('#item_1');
    const result = await firstValueFrom(dataSource.data);
    expect(result).toHaveLength(11);
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
});
