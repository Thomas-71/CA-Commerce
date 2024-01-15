export interface InvoiceProductInterface {
    idInvoiceProduct: number | undefined;
    idProduct: number;
    idReceipt: number | undefined;
    name: string | undefined;
    price: number | undefined;
    quantity: number;
}

export class InvoiceProduct implements InvoiceProductInterface {
    idInvoiceProduct: number | undefined;
    idProduct: number;
    idReceipt: number | undefined;
    name: string | undefined;
    price: number | undefined;
    quantity: number;

    constructor(idInvoiceProduct: number | undefined, idProduct: number, idReceipt: number | undefined, name: string | undefined, price: number | undefined, quantity: number) {
        this.idInvoiceProduct = idInvoiceProduct;
        this.idProduct = idProduct;
        this.idReceipt = idReceipt;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}