import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class AddReceipt{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(receipt: Entities.ReceiptInterface, invoiceProducts : Entities.InvoiceProductInterface[]) : Promise<Result<Entities.Receipt>> {
        const invoiceProductsAdded : Entities.InvoiceProduct[] = [];
        let resultGetProduct
        
        const resultToGetClient = await this.databaseStorage.getClient(receipt.idClient);
        if (!resultToGetClient.success) {
            this.loggerPort.error(`Client with id '${receipt.idClient}' not found`);
            return {
                success: false,
                error: new Error(`Client with id '${receipt.idClient}' not found`),
            };
        }

        const invoiceProductPromises = invoiceProducts.map(async (invoiceProduct) => {
            resultGetProduct = await this.databaseStorage.getProduct(invoiceProduct.idProduct);
            if (resultGetProduct.success) {
                invoiceProduct.name = resultGetProduct.value.name;
                invoiceProduct.price = resultGetProduct.value.price;
            } else {
                this.loggerPort.error(`Product with id '${invoiceProduct.idProduct}' not found`);
                return {
                    success: false,
                    error: new Error(`Product with id '${invoiceProduct.idProduct}' not found`),
                };
            }
            if (resultGetProduct.value.stock - invoiceProduct.quantity < 0) {
                this.loggerPort.error(`Not enough stock for product with id '${invoiceProduct.idProduct}'`);
                return {
                    success: false,
                    error: new Error(`Not enough stock for product with id '${invoiceProduct.idProduct}'`),
                };
            }
        });

        await Promise.all(invoiceProductPromises);

        const resultToAddReceipt = await this.databaseStorage.addReceipt(receipt);

        if (resultToAddReceipt.success) {
            receipt.idReceipt = resultToAddReceipt.value.idReceipt;
            const invoiceProductAddPromises = invoiceProducts.map(async (invoiceProduct) => {
                invoiceProduct.idReceipt = resultToAddReceipt.value.idReceipt;
                const result = await this.databaseStorage.addInvoiceProductToReceipt(resultToAddReceipt.value.idReceipt!, invoiceProduct);
                if (result.success) {
                    invoiceProductsAdded.push(result.value);
                }
            });
            let totalCost = 0;
            invoiceProducts.forEach(async (invoiceProduct) => {
                if (invoiceProduct.price) {
                    totalCost += invoiceProduct.price * invoiceProduct.quantity;
                }
                const result = await this.databaseStorage.getProduct(invoiceProduct.idProduct);
                if (result.success) {
                    await this.databaseStorage.updateProduct(invoiceProduct.idProduct, new Entities.Product(result.value.idProduct, result.value.name, result.value.price, result.value.stock - invoiceProduct.quantity));
                }
            });
            
            await Promise.all(invoiceProductAddPromises);
            receipt.totalCost = totalCost;
            receipt.invoiceProducts = invoiceProductsAdded;

            this.loggerPort.info(`Receipt : ${JSON.stringify(receipt)}`);
            return {
                success: true,
                value: receipt,
            }
        }
    
        return {
            success: false,
            error: new Error(`Receipt not added`),
        };
    }
}