import * as Entities from "../../../domain/entities"
import * as Ports from "../../ports"
import { Result } from "../../types"

export class AddClient{
    databaseStorage: Ports.Storage;
    loggerPort: Ports.Logger;

    constructor(databaseStorage: Ports.Storage, loggerPort: Ports.Logger) {
        this.databaseStorage = databaseStorage;
        this.loggerPort = loggerPort;
    }

    public async execute(client : Entities.ClientInterface) : Promise<Result<Entities.Client>> {
        if (client.name.trim().length === 0 || client.surname.trim().length === 0 || client.address.trim().length === 0 || client.phone.trim().length !== 10 ) {
            this.loggerPort.error(`Given informations are invalid`)
            return {
                success: false,
                error: new Error(`Given informations are invalid`),
            }
        }

        const result = await this.databaseStorage.addClient(client)
        if (result.success) {
            let client = new Entities.Client(result.value.idClient, result.value.name, result.value.surname, result.value.address, result.value.phone);
            result.value = client;
            this.loggerPort.info(`New client id : ${client.idClient}`);
        }
        else {
            this.loggerPort.error(`Error while adding new client`);
        }   
        return result
    }
}