import fetcher from 'apis';
import { CartProducts, Product } from 'types/product';

const GET_URL = '/cart-items';

type ServerCartProduct = {
  id: number;
  quantity: number;
  product: Product;
};

const isServerCartProductsType = (data: any): data is ServerCartProduct[] => {
  if (!Array.isArray(data)) return false;

  const hasCorrectKeys = data.every((value) => 'id' in value && 'quantity' in value && 'product' in value);

  return hasCorrectKeys;
};

const cartProductsParser = (data: any): CartProducts => {
  if (!isServerCartProductsType(data)) throw new Error(`서버 데이터 형식이 serverCartProducts type이 아닙니다.`);

  const parsedCartProducts = data.map(({ id, product, quantity }) => [id, { quantity, product }] as const);

  return new Map(parsedCartProducts);
};

export const getCartProducts = async (): Promise<CartProducts> => {
  const fetchedData = await fetcher<ServerCartProduct[]>(GET_URL);
  const cartProducts = fetchedData.data;

  return cartProductsParser(cartProducts);
};
