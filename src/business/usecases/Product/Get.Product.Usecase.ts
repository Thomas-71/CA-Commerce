import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class GetProduct{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(id : number) : Promise<Result<Entities.Product>> {
        if (id <= 0) {
            this.loggerPort.error(`Given id is invalid`)
            return {
                success: false,
                error: new Error(`Given id '${id}' is not greater than 0`),
            }
        }
        const result = await this.databaseStorage.getProduct(id);
        if (result.success) {
            let product = new Entities.Product(result.value.idProduct, result.value.name, result.value.price, result.value.stock);
            result.value = product;
            this.loggerPort.info(`Product : ${JSON.stringify(product)}`);
        }
        else {
            this.loggerPort.error(`Product with id '${id}' not found`);
        }
        return result
    }
}