import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class GetAllReceipts{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(storagePort: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = storagePort;
        this.loggerPort = loggerPort;
    }

    public async execute() : Promise<Result<Entities.Receipt[]>> {
        const result = await this.databaseStorage.getAllReceipts();
        if (result.success) {
            let receiptsArray = result.value;
            
            receiptsArray.map((receipt: any) => {
                new Entities.Receipt(receipt.idReceipt, receipt.idClient, receipt.invoiceProducts, receipt.totalCost);
            });
            
            this.loggerPort.info(`Receipts : `);
            receiptsArray.forEach((receipt: Entities.Receipt) => {
                this.loggerPort.info(JSON.stringify(receipt));
            });
        }
        return result;
    }
}