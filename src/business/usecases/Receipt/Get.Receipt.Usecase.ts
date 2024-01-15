import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class GetReceipt{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(id : number) : Promise<Result<Entities.Receipt>> {
        if (id <= 0) {
            this.loggerPort.error(`Given id is invalid`)
            return {
                success: false,
                error: new Error(`Given id '${id}' is not greater than 0`),
            }
        }
        const result = await this.databaseStorage.getReceipt(id);
        if (result.success) {
            let receipt = new Entities.Receipt(result.value.idReceipt, result.value.idClient, result.value.invoiceProducts, result.value.totalCost);
            result.value = receipt;
            this.loggerPort.info(`Receipt with id '${id}' found : ${JSON.stringify(receipt)}`);
        }
        else {
            this.loggerPort.error(`Receipt with id '${id}' not found`);
        }
        return result
    }
}