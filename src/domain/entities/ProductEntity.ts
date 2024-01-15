export interface ProductInterface {
    idProduct: number | undefined;
    name: string;
    price: number;
    stock: number;
}

export class Product implements ProductInterface {
    idProduct: number | undefined;
    name: string;
    price: number;
    stock: number;

    constructor(idProduct: number | undefined, name: string, price: number, stock: number) {
        this.idProduct = idProduct;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}