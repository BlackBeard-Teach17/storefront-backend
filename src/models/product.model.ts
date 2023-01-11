import client from '../configs/database.config';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            console.log("Connecting to database");
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try{
            console.log("Creating product" + p.name + " " + p.price + " " + p.category);
            const conn = await client.connect();
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3)';
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            console.log("Product created");
            conn.release();
            return result.rows[0];
        }catch (err)
        {
            throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
        }
    }
}