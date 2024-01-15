import { InvoiceProduct } from "./InvoiceProductEntity";

export interface ReceiptInterface {
    idReceipt: number | undefined;
    idClient: number;
    invoiceProducts: InvoiceProduct[] | undefined;
    totalCost: number | undefined;
}

export class Receipt implements ReceiptInterface {
    idReceipt: number | undefined;
    idClient: number;
    invoiceProducts: InvoiceProduct[] | undefined;
    totalCost: number | undefined;

    constructor(idReceipt: number | undefined, idClient: number, invoiceProducts: InvoiceProduct[] | undefined, totalCost: number | undefined) {
        this.idReceipt = idReceipt;
        this.idClient = idClient;
        this.invoiceProducts = invoiceProducts;
        this.totalCost = totalCost;
    }
}