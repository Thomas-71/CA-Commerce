export interface ClientInterface {
    idClient: number | undefined;
    name: string;
    surname: string;
    address: string;
    phone: string;
}

export class Client implements ClientInterface {
    idClient: number | undefined;
    name: string;
    surname: string;
    address: string;
    phone: string;

    constructor(idClient: number | undefined, name: string, surname: string, address: string, phone: string) {
        this.idClient = idClient;
        this.name = name;
        this.surname = surname;
        this.address = address;
        this.phone = phone;
    }
}