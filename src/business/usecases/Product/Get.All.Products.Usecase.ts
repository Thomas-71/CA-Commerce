import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class GetAllProducts{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(storagePort: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = storagePort;
        this.loggerPort = loggerPort;
    }

    public async execute() : Promise<Result<Entities.Product[]>> {
        const result = await this.databaseStorage.getAllProducts();
        if (result.success) {
            let productsArray = result.value;
            productsArray.map((product: any) => {
                new Entities.Product(product.id, product.name, product.price, product.stock);
            });
            this.loggerPort.info(`Products : `);
            productsArray.forEach((product: Entities.Product) => {
                this.loggerPort.info(JSON.stringify(product));
            });
        }
        return result;
    }
}