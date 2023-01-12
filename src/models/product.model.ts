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
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }

    async isDuplicate(name: string): Promise<boolean> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE name=($1)';
            const result = await conn.query(sql, [name]);
            conn.release();
            if (result.rows.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            throw new Error(`Could not find product ${name}. Error: ${err}`);
        }
    }

    async create(p: Product): Promise<Product | string> {
        try{
            if (await this.isDuplicate(p.name))
            {
                const duplicate_product = `Product ${p.name} already exists`;
                return duplicate_product;
            }
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

    async show(id: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            console.log("Product found");
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM products WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`);
        }
    }

    async updateAll(p: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4)';
            const result = await conn.query(sql, [p.name, p.price, p.category, p.id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${p.id}. Error: ${err}`);
        }
    }

    async updateProductName(id: string, name: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'UPDATE products SET name=($1) WHERE id=($2)';
            const result = await conn.query(sql, [name, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${id}. Error: ${err}`);
        }
    }

    async updateProductPrice(id: string, price: number): Promise<Product> {
        try{
            const conn = await client.connect();
            const sql = 'UPDATE products SET price=($1) WHERE id=($2)';
            const result = await conn.query(sql, [price, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${id}. Error: ${err}`);
        }
    }

    async updateProductCategory(id: string, category: string): Promise<Product> {
        try{
            const conn = await client.connect();
            const sql = 'UPDATE products SET category=($1) WHERE id=($2)';
            const result = await conn.query(sql, [category, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${id}. Error: ${err}`);
        }
    }
}