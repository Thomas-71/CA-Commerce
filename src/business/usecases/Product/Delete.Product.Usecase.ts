import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports";
import { Result } from "../../types"

export class DeleteProduct{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(id : number) : Promise<Result<String>> {
        if (id <= 0) {
            this.loggerPort.error(`Given id is invalid`)
            return {
                success: false,
                error: new Error(`Given id '${id}' is not greater than 0`),
            }
        }
        const result = await this.databaseStorage.deleteProduct(id);
        if (result.success) {
            this.loggerPort.info(`Product with id ${id} deleted`);
        }
        else {
            this.loggerPort.error(`Product with id '${id}' not found`);
        }
        return result
    }
}