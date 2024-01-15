import express, { Express, Request, Response } from 'express';

import * as Usecases from '../../business/usecases';
import * as Repositories from '../../infrastructure/repositories';
import * as Entities from "../../domain/entities"
import { Result } from 'src/business/types';
import { Client } from 'src/domain/entities';
import { Product } from 'src/domain/entities';
import { Receipt } from 'src/domain/entities';

const DB_USERNAME = process.env.DB_USER || 'commerceUser';
const DB_HOST = process.env.DB_HOST || '192.168.1.50';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234567890';
const DB_NAME = process.env.DB_NAME || 'commerceDB';
const DB_PORT = process.env.DB_PORT || '3306';

export class Server {
    app: Express;
    repositories: {
        databaseStorage: Repositories.DatabaseStorage,
        logger: Repositories.Logger,
    };

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.repositories = {
            databaseStorage: new Repositories.DatabaseStorage(DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT),
            logger: new Repositories.Logger(),
        };
    }

    init(): void {

        this.app.post("/client", (request: Request, response: Response) => {
            const client = new Entities.Client(undefined, request.body.name, request.body.surname, request.body.address, request.body.phone);
            new Usecases.AddClient(this.repositories.databaseStorage, this.repositories.logger).execute(client).then((result: Result<Client>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
             });
        });

        this.app.put("/client/:id", (request: Request, response: Response) => {
            const client = new Entities.Client(undefined, request.body.name, request.body.surname, request.body.address, request.body.phone);
            new Usecases.UpdateClient(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id),client).then((result: Result<Client>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.delete("/client/:id", (request: Request, response: Response) => {
            new Usecases.DeleteClient(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id)).then((result: Result<String>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.get("/client/:id", (request: Request, response: Response) => {
            new Usecases.GetClient(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id)).then((result: Result<Client>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.get("/client", (request: Request, response: Response) => {
            new Usecases.GetAllClients(this.repositories.databaseStorage, this.repositories.logger).execute().then((result: Result<Client[]>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.post("/product", (request: Request, response: Response) => {
            const product = new Entities.Product(undefined, request.body.name, Number(request.body.price), Number(request.body.stock));
            new Usecases.AddProduct(this.repositories.databaseStorage, this.repositories.logger).execute(product).then((result: Result<Product>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
             });
        });

        this.app.get("/product/:id", (request: Request, response: Response) => {
            new Usecases.GetProduct(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id)).then((result: Result<Product>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        
        this.app.get("/product", (request: Request, response: Response) => {
            new Usecases.GetAllProducts(this.repositories.databaseStorage, this.repositories.logger).execute().then((result: Result<Product[]>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.delete("/product/:id", (request: Request, response: Response) => {
            new Usecases.DeleteProduct(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id)).then((result: Result<String>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.put("/product/:id", (request: Request, response: Response) => {
            const product = new Entities.Product(undefined, request.body.name, request.body.price, request.body.stock);
            new Usecases.UpdateProduct(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id),product).then((result: Result<Product>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.post("/receipt", (request: Request, response: Response) => {
            const receipt = new Entities.Receipt(undefined, Number(request.body.idClient), undefined, undefined);
            const invoiceProducts : Entities.InvoiceProduct[] = request.body.invoiceProducts.map((invoiceProduct : any) => {
                return new Entities.InvoiceProduct(undefined, Number(invoiceProduct.idProduct), undefined, undefined, undefined, Number(invoiceProduct.quantity));
            });
            new Usecases.AddReceipt(this.repositories.databaseStorage, this.repositories.logger).execute(receipt, invoiceProducts).then((result: Result<Receipt>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(400).json({ success: false, error: result.error.message });
                }
             });
        });

        this.app.get("/receipt/:id", (request: Request, response: Response) => {
            new Usecases.GetReceipt(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id)).then((result: Result<Receipt>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(404).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.get("/receipt", (request: Request, response: Response) => {
            new Usecases.GetAllReceipts(this.repositories.databaseStorage, this.repositories.logger).execute().then((result: Result<Receipt[]>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(404).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.put("/receipt/:id", (request: Request, response: Response) => {
            const receipt = new Entities.Receipt(undefined, Number(request.body.idClient), undefined, undefined);
            new Usecases.UpdateReceipt(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id),receipt).then((result: Result<Receipt>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(404).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.delete("/receipt/:id", (request: Request, response: Response) => {
            new Usecases.DeleteReceipt(this.repositories.databaseStorage, this.repositories.logger).execute(Number(request.params.id)).then((result: Result<String>) => {
                if (result.success) {
                    response.json({ success: true, data: result.value });
                } else {
                    response.status(404).json({ success: false, error: result.error.message });
                }
            });
        });

        this.app.all('**', (request: Request, response: Response) => {
            response.status(404).json();
        });
    }

    launch(port: number): void {
        this.app.listen(port, () => console.info(`Listening on port ${port}`));
    }
}