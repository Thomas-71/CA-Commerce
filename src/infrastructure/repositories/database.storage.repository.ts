import * as Entities from '../../domain/entities';
import { Result } from '../../business/types';
import * as Ports from "../../business/ports"
import mysql from 'mysql2';

export class DatabaseStorage implements Ports.Storage {
    host;  
    username;
    password;
    port;
    db;

    private dbConnection: any = null;
    private isDbInitialized: boolean = false;
    private dbInitializationPromise: Promise<void> | null = null;

    constructor(username: string, password: string, db: string, host: string, port: string) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.port = parseInt(port || '0');
        this.db = db;
    }

    private async initDatabaseConnection(): Promise<void> {
        if (!this.dbInitializationPromise) {
            this.dbInitializationPromise = new Promise((resolve, reject) => {
                const connection = mysql.createConnection({
                    host: this.host,
                    user: this.username,
                    password: this.password,
                    port: this.port,
                    database: this.db,
                });
    
                connection.connect((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.dbConnection = connection;
                        this.isDbInitialized = true;
                        resolve();
                    }
                });
            });
        }
        return this.dbInitializationPromise;
    }

    private async waitForDbInitialization(): Promise<void> {
        if (!this.isDbInitialized) {
            await this.initDatabaseConnection();
        }
    }

    async addClient(sentClient: Entities.ClientInterface): Promise<Result<Entities.Client>> {
        await this.waitForDbInitialization();
        const query = `INSERT INTO client (Name, Surname, Address, Phone) VALUES ('${sentClient.name}', '${sentClient.surname}', '${sentClient.address}', ${sentClient.phone})`;
        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    var newClient : Entities.Client = new Entities.Client(result.insertId, sentClient.name, sentClient.surname, sentClient.address, sentClient.phone);
                    resolve({
                        success: true,
                        value: newClient,
                    });
                }
            });
        });
    };

    async getClient (clientId: number) : Promise<Result<Entities.Client>>{
        await this.waitForDbInitialization();
        const query = `SELECT * FROM client WHERE IdClient = ${clientId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.length !== 0) {
                        var client : Entities.Client = new Entities.Client(result[0].idClient, result[0].Name, result[0].Surname, result[0].Address, result[0].Phone);
                        resolve({
                            success: true,
                            value: client,
                        })
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Client with id '${clientId}' not found`),
                        });
                    }
                }
            })
        })
    };

    async getAllClients(): Promise<Result<Entities.Client[]>> {
        await this.waitForDbInitialization();
        const query = `SELECT * FROM client`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, clients: []) => {
                if (error) {
                    reject(error);
                } else {
                    clients.map((client: any) => {
                        new Entities.Client(client.id, client.name, client.surname, client.address, client.phone);
                    });
                    resolve({
                        success: true,
                        value: clients,
                    });
                }
            });
        });
    };

    async updateClient (IdClient: number, client: Entities.ClientInterface) : Promise<Result<Entities.Client>>{
        await this.waitForDbInitialization();
        const query = `UPDATE client SET Name = '${client.name}', Surname = '${client.surname}', Address = '${client.address}', Phone = '${client.phone}' WHERE IdClient = ${IdClient}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        var updatedClient : Entities.Client = new Entities.Client(IdClient, client.name, client.surname, client.address, client.phone);
                        resolve({
                            success: true,
                            value: updatedClient,
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Client with id '${IdClient}' not updated`),
                        });
                    }
                }
            });
        });
    };

    async deleteClient (clientId: number) : Promise<Result<String>>{
        await this.waitForDbInitialization();
        const query = `DELETE FROM client WHERE IdClient = ${clientId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        resolve({
                            success: true,
                            value: `Client ${clientId} deleted`,
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Client with id '${clientId}' not deleted`),
                        });
                    }
                }
            }
        )})
    };

    async addProduct (sentProduct: Entities.ProductInterface) :  Promise<Result<Entities.Product>>{
        await this.waitForDbInitialization();
        const query = `INSERT INTO product (Name, Price, Stock) VALUES ('${sentProduct.name}', ${sentProduct.price}, ${sentProduct.stock})`;
        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    var newProduct : Entities.Product = new Entities.Product(result.insertId, sentProduct.name, sentProduct.price, sentProduct.stock);
                    resolve({
                        success: true,
                        value: newProduct,
                    });
                }
            });
        }); 
    };

    async getProduct (productId: number) : Promise<Result<Entities.Product>>{
        await this.waitForDbInitialization();
        const query = `SELECT * FROM product WHERE IdProduct = ${productId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.length !== 0) {
                        var product : Entities.Product = new Entities.Product(result[0].idProduct, result[0].Name, result[0].Price, result[0].Stock);
                        resolve({
                            success: true,
                            value: product,
                        })
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Product with id '${productId}' not found`),
                        });
                    }
                }
            })
        })
    };

    async getAllProducts(): Promise<Result<Entities.Product[]>> {
        await this.waitForDbInitialization();
        const query = `SELECT * FROM product`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, products: []) => {
                if (error) {
                    reject(error);
                } else {
                    products.map((product: any) => {
                        new Entities.Product(product.id, product.name, product.price, product.stock);
                    });
                    resolve({
                        success: true,
                        value: products,
                    });
                }
            });
        });
    };

    async deleteProduct (productId: number) : Promise<Result<String>>{
        await this.waitForDbInitialization();
        const query = `DELETE FROM product WHERE IdProduct = ${productId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        resolve({
                            success: true,
                            value: `Product with id ${productId} deleted`,
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Product with id '${productId}' not found`),
                        });
                    }
                }
            }
        )})
    }

    async updateProduct (IdProduct: number, product: Entities.ProductInterface) : Promise<Result<Entities.Product>>{
        await this.waitForDbInitialization();
        const query = `UPDATE product SET Name = '${product.name}', Price = '${product.price}', Stock = '${product.stock}' WHERE IdProduct = ${IdProduct}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        var updatedProduct : Entities.Product = new Entities.Product(IdProduct, product.name, product.price, product.stock);
                        resolve({
                            success: true,
                            value: updatedProduct,
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Product with id '${IdProduct}' not found`),
                        });
                    }
                }
            });
        });
    }

    async addReceipt (receipt: Entities.ReceiptInterface) : Promise<Result<Entities.Receipt>>{
        await this.waitForDbInitialization();
        const query = `INSERT INTO receipt (IdClient) VALUES (${receipt.idClient})`;
        
        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    var newReceipt : Entities.Receipt = new Entities.Receipt(result.insertId, receipt.idClient, undefined, undefined);
                    resolve({
                        success: true,
                        value: newReceipt,
                    });
                }
            });
        }); 
    }

    async getReceipt (receiptId: number) : Promise<Result<Entities.Receipt>>{
        await this.waitForDbInitialization();
        const query = `SELECT * FROM receipt WHERE IdReceipt = ${receiptId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, async (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.length !== 0) {
                        var receipt : Entities.Receipt = new Entities.Receipt(result[0].idReceipt, result[0].IdClient, undefined, undefined);
                        const invoiceProductsResult = await this.getAllInvoiceProductsOfReceipt(receiptId);
                        if (invoiceProductsResult.success) {
                            receipt.invoiceProducts = invoiceProductsResult.value;
                            var totalCost : number = 0;
                            receipt.invoiceProducts.forEach((invoiceProduct : Entities.InvoiceProduct) => {
                                if (invoiceProduct.price !== undefined) {
                                    totalCost += invoiceProduct.price * invoiceProduct.quantity;
                                }
                            receipt.totalCost = totalCost;
                            });
                        }
                        resolve({
                            success: true,
                            value: receipt,
                        })
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Receipt with id '${receiptId}' not found`),
                        });
                    }
                }
            });
        });
    }

    async getAllReceipts(): Promise<Result<Entities.Receipt[]>> {
        await this.waitForDbInitialization();
        const query = `SELECT * FROM receipt`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, async (error: mysql.AuthPlugin, receipts: []) => {
                if (error) {
                    reject(error);
                } else {
                    const receiptPromises = receipts.map(async (receipt: any) => {
                        var newReceipt: Entities.Receipt = new Entities.Receipt(receipt.IdReceipt, receipt.IdClient, undefined, undefined);
                        const invoiceProductsResult = await this.getAllInvoiceProductsOfReceipt(receipt.IdReceipt);
                        if (invoiceProductsResult.success) {
                            newReceipt.invoiceProducts = invoiceProductsResult.value;
                            var totalCost: number = 0;
                            newReceipt.invoiceProducts.forEach((invoiceProduct: Entities.InvoiceProduct) => {
                                if (invoiceProduct.price !== undefined) {
                                    totalCost += invoiceProduct.price * invoiceProduct.quantity;
                                }
                                newReceipt.totalCost = totalCost;
                            });
                        }
                        return newReceipt;
                    });

                    const resolvedReceipts = await Promise.all(receiptPromises);

                    resolve({
                        success: true,
                        value: resolvedReceipts,
                    });
                }
            });
        });
    }

    async updateReceipt (receiptId: number, receipt: Entities.ReceiptInterface) : Promise<Result<Entities.Receipt>>{
        await this.waitForDbInitialization();
        const query = `UPDATE receipt SET IdClient = '${receipt.idClient}' WHERE IdReceipt = ${receiptId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, async (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        var updatedReceipt : Entities.Receipt = new Entities.Receipt(receiptId, receipt.idClient, undefined, undefined);
                        const invoiceProductsResult = await this.getAllInvoiceProductsOfReceipt(receiptId);
                        if (invoiceProductsResult.success) {
                            updatedReceipt.invoiceProducts = invoiceProductsResult.value;
                            var totalCost : number = 0;
                            updatedReceipt.invoiceProducts.forEach((invoiceProduct : Entities.InvoiceProduct) => {
                                if (invoiceProduct.price !== undefined) {
                                    totalCost += invoiceProduct.price * invoiceProduct.quantity;
                                }
                            updatedReceipt.totalCost = totalCost;
                            });
                        }
                        resolve({
                            success: true,
                            value: updatedReceipt,
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Receipt with id '${receiptId}' not updated`),
                        });
                    }
                }
            });
        });
    }

    async deleteReceipt (receiptId: number) : Promise<Result<String>>{
        await this.waitForDbInitialization();
        const invoiceProductsResult = await this.deleteInvoiceProductsOfReceipt(receiptId);
        const query = `DELETE FROM receipt WHERE IdReceipt = ${receiptId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, async (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        if (invoiceProductsResult.success) {
                            resolve({
                                success: true,
                                value: `Receipt ${receiptId} deleted`,
                            });
                        }
                        else {
                            resolve({
                                success: false,
                                error: new Error(`Receipt with id '${receiptId}' not deleted`),
                            });
                        }
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`Receipt with id '${receiptId}' not found`),
                        });
                    }
                }
            }
        )})
    }

    async getAllInvoiceProductsOfReceipt (receiptId: number) : Promise<Result<Entities.InvoiceProduct[]>>{
        await this.waitForDbInitialization();
        const query = `SELECT * FROM invoiceproducts WHERE IdReceipt = ${receiptId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, async (error: mysql.AuthPlugin, invoiceProducts: any) => {
                if (error) {
                    reject(error);
                } else {
                    const invoiceProductsResult = invoiceProducts.map((invoiceProduct: any) => {
                        return new Entities.InvoiceProduct(invoiceProduct.idInvoiceProduct, invoiceProduct.IdProduct, invoiceProduct.IdReceipt, invoiceProduct.Name, invoiceProduct.Price, invoiceProduct.Quantity);
                    });
                    resolve({
                        success: true,
                        value: invoiceProductsResult,
                    });
                }
            });
        });
    }

    async addInvoiceProductToReceipt (receiptId: number, invoiceProduct: Entities.InvoiceProductInterface) : Promise<Result<Entities.InvoiceProduct>>{
        await this.waitForDbInitialization();
        const query = `INSERT INTO invoiceproducts (IdProduct, IdReceipt, Name, Price, Quantity) VALUES (${invoiceProduct.idProduct}, ${receiptId}, '${invoiceProduct.name}', ${invoiceProduct.price}, ${invoiceProduct.quantity})`;
        
        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    var newInvoiceProduct : Entities.InvoiceProduct = new Entities.InvoiceProduct(result.insertId, invoiceProduct.idProduct, receiptId, invoiceProduct.name, invoiceProduct.price, invoiceProduct.quantity);
                    resolve({
                        success: true,
                        value: newInvoiceProduct,
                    });
                }
            });
        });
    }

    async deleteInvoiceProductsOfReceipt (receiptId: number) : Promise<Result<String>>{
        await this.waitForDbInitialization();
        const query = `DELETE FROM invoiceproducts WHERE IdReceipt = ${receiptId}`;

        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (error: mysql.AuthPlugin, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows !== 0){
                        resolve({
                            success: true,
                            value: `InvoiceProducts with IdReceipt '${receiptId}' deleted`,
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: new Error(`InvoiceProducts with IdReceipt '${receiptId}' not deleted`),
                        });
                    }
                }
            }
        )})
    }
}