import * as Entities from '../../domain/entities';
import { Result } from "../types";

export interface Storage {
    addClient: (client: Entities.ClientInterface) => Promise<Result<Entities.Client>>,
    getClient: (clientId: number) => Promise<Result<Entities.Client>>,
    getAllClients: () => Promise<Result<Entities.Client[]>>,
    updateClient: (clientId: number, client: Entities.ClientInterface) => Promise<Result<Entities.Client>>,
    deleteClient: (clientId: number) => Promise<Result<String>>,

    addProduct: (product: Entities.ProductInterface) => Promise<Result<Entities.Product>>,
    getProduct: (productId: number) => Promise<Result<Entities.Product>>,
    getAllProducts: () => Promise<Result<Entities.Product[]>>,
    updateProduct: (productId: number, product: Entities.ProductInterface) => Promise<Result<Entities.Product>>,
    deleteProduct: (productId: number) => Promise<Result<String>>,

    addReceipt: (receipt: Entities.ReceiptInterface) => Promise<Result<Entities.Receipt>>,
    getReceipt: (receiptId: number) => Promise<Result<Entities.Receipt>>,
    getAllReceipts: () => Promise<Result<Entities.Receipt[]>>,
    updateReceipt: (receiptId: number, receipt: Entities.ReceiptInterface) => Promise<Result<Entities.Receipt>>,
    deleteReceipt: (receiptId: number) => Promise<Result<String>>,

    addInvoiceProductToReceipt: (receiptId: number, invoiceProducts: Entities.InvoiceProductInterface) => Promise<Result<Entities.InvoiceProductInterface>>,
    getAllInvoiceProductsOfReceipt: (receiptId: number) => Promise<Result<Entities.InvoiceProductInterface[]>>,
    deleteInvoiceProductsOfReceipt: (receiptId: number,  invoiceProductId: number) => Promise<Result<String>>,
}