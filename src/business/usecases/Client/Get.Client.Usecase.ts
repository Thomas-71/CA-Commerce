import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class GetClient{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(id : number) : Promise<Result<Entities.Client>> {
        if (id <= 0) {
            this.loggerPort.error(`Given id is invalid`)
            return {
                success: false,
                error: new Error(`Given id '${id}' is not greater than 0`),
            }
        }
        const result = await this.databaseStorage.getClient(id);
        if (result.success) {
            let client = new Entities.Client(result.value.idClient, result.value.name, result.value.surname, result.value.address, result.value.phone);
            result.value = client;
            this.loggerPort.info(`Client : ${JSON.stringify(client)}`);
        }
        else {
            this.loggerPort.error(`Client with id '${id}' not found`);
        }
        return result
    }
}