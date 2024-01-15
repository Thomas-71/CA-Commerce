import fs from 'fs';
import path from 'path';
import * as Entities from '../../domain/entities';
import { Result } from '../../business/types';
import * as Ports from '../../business/ports';

export class FileStorage implements Ports.Storage {
    filepath;

    constructor(filepath: string) {
        this.filepath = filepath;
    }
    
    addClient: (client: Entities.ClientInterface) => Promise<Result<Entities.Client>>;
    getClient: (clientId: number) => Promise<Result<Entities.Client>>;
    getAllClients: () => Promise<Result<Entities.Client[]>>;
    updateClient: (clientId: number, client: Entities.ClientInterface) => Promise<Result<Entities.Client>>;
    deleteClient: (clientId: number) => Promise<Result<String>>;
    addProduct: (product: Entities.ProductInterface) => Promise<Result<Entities.Product>>;
    getProduct: (productId: number) => Promise<Result<Entities.Product>>;
    getAllProducts: () => Promise<Result<Entities.Product[]>>;
    updateProduct: (productId: number, product: Entities.ProductInterface) => Promise<Result<Entities.Product>>;
    deleteProduct: (productId: number) => Promise<Result<String>>;
    addReceipt: (receipt: Entities.ReceiptInterface) => Promise<Result<Entities.Receipt>>;
    getReceipt: (receiptId: number) => Promise<Result<Entities.Receipt>>;
    getAllReceipts: () => Promise<Result<Entities.Receipt[]>>;
    deleteReceipt: (receiptId: number) => Promise<Result<String>>;
    addInvoiceProductToReceipt: (receiptId: number, invoiceProducts: Entities.InvoiceProductInterface) => Promise<Result<Entities.InvoiceProductInterface>>;
    getAllInvoiceProductsOfReceipt: (receiptId: number) => Promise<Result<Entities.InvoiceProductInterface[]>>;
    deleteInvoiceProductsOfReceipt: (receiptId: number, invoiceProductId: number) => Promise<Result<String>>;

    private createDirIfNotExists(): void {
        const dir = path.dirname(this.filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}