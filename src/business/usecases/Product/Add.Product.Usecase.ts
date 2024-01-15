import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class AddProduct{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(product : Entities.ProductInterface) : Promise<Result<Entities.Product>> {
        if (product.name.trim().length === 0 || product.price < 0 || product.stock === 0 || product.stock < 0 || Number.isNaN(product.price) || Number.isNaN(product.stock) ) {
            this.loggerPort.error(`Given informations are invalid`)
            return {
                success: false,
                error: new Error(`Given informations are invalid`),
            }
        }
        const result = await this.databaseStorage.addProduct(product)
        if (result.success) {
            let product = new Entities.Product(result.value.idProduct, result.value.name, result.value.price, result.value.stock);
            result.value = product;
            this.loggerPort.info(`New product id : ${product.idProduct}`);
        }
        return result
    }
}