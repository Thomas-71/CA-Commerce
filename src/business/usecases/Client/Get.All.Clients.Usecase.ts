import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class GetAllClients{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(storagePort: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = storagePort;
        this.loggerPort = loggerPort;
    }

    public async execute() : Promise<Result<Entities.Client[]>> {
        const result = await this.databaseStorage.getAllClients();
        if (result.success) {
            let clientsArray = result.value;
            clientsArray.map((client: any) => {
                new Entities.Client(client.id, client.name, client.surname, client.address, client.phone);
            });
            this.loggerPort.info(`Clients : `);
            clientsArray.forEach((client: Entities.Client) => {
                this.loggerPort.info(JSON.stringify(client));
            });
        }
        return result;
    }
}