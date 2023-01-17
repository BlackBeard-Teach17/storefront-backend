import client from "../configs/database.config";

export type Order = {
    id?: number;
    user_id: number;
    status: string;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2)';
            const result = await conn.query(sql, [o.status, o.user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create new order ${o.id}. Error: ${err}`);
        }
    }

    // This function is used to check if the order is completed or not.
    async checkOrderStatus(order_id: string): Promise<Boolean> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT status FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [order_id]);
            conn.release();
            if(result.rows[0].status !== 'completed'){
                return true;
            }
            return false;
        } catch (err) {
            throw new Error(`Could not find order ${order_id}. Error: ${err}`);
        }
    }

    // This function is used to check if the product is already in the order and update the quantity if it is.
    async checkOrderProductExists(order_id: string, product_id: number, quantity: number): Promise<Boolean> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT product_id, quantity FROM order_products WHERE order_id=($1) AND product_id=($2)';
            const result = await conn.query(sql, [order_id, product_id]);
            conn.release();
            if (result.rows[0] === undefined){
                return false;
            }
            if(result.rows[0].product_id === product_id){
                const new_quantity = result.rows[0].quantity + quantity;
                await this.updateOrderProduct(parseInt(order_id), product_id, new_quantity);
                return true;
            }
            return false;
        } catch (err) {
            throw new Error(`Could not find order ${order_id}. Error: ${err}`);
        }
    }

    // This function is used to update the quantity of a product in an order.
    async updateOrderProduct(order_id: number, product_id: number, quantity: number): Promise<Order | string> {
        try {
            const conn = await client.connect();
            const sql = 'UPDATE order_products SET quantity=($1) WHERE order_id=($2) AND product_id=($3)';
            const result = await conn.query(sql, [quantity, order_id, product_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update order ${order_id}. Error: ${err}`);
        }
    }

    async addToCart(order_id: string, product_id: number, quantity: number): Promise<Order | string> {
        if (await this.checkIfOrderExists(order_id.toString()) === false)
            return 'Order does not exist';
        if (await this.checkOrderStatus(order_id.toString()) === false)
            return 'Order is completed';
        if (await this.checkOrderProductExists(order_id, product_id, quantity) === true)
            return 'Order updated';
        return await this.addProduct(order_id, product_id, quantity);
    }

    async checkIfOrderExists(id: string): Promise<Boolean> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT id FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            if(result.rows[0].id){
                return true;
            }
            return false;
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }

    async addProduct(order_id: string, product_id: number, quantity: number): Promise<Order | string> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3)';
            const result = await conn.query(sql, [order_id, product_id, quantity]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product ${product_id} to order ${order_id}. Error: ${err}`);
        }
    }

    async getCartItems(order_id: number): Promise<Order | string> {
        if (await this.checkIfOrderExists(order_id.toString()) === false)
            return 'Order does not exist';
        if (await this.checkOrderStatus(order_id.toString()) === false)
            return 'Order is completed';
        try {
            const conn = await client.connect();
            const sql = 'SELECT p.name as product_name, p.price, op.quantity, p.price * op.quantity as total \
            FROM order_products op \
            JOIN products p ON op.product_id = p.id \
            WHERE op.order_id = ($1)';
            const result = await conn.query(sql, [order_id]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not find order ${order_id}. Error: ${err}`);
        }
    }
    // This function is used to remove a product from an order.
    async removeProduct(order_id: string, product_id: number): Promise<Order | string> {
        console.log('removeProduct: ' + order_id + ' ' + product_id)
        if (await this.checkOrderStatus(order_id) === false)
            return 'Order is completed';
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2)';
            const result = await conn.query(sql, [order_id, product_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not remove product ${product_id} from order ${order_id}. Error: ${err}`);
        }
    }

    async update(o: Order): Promise<Order> {
        try{
            const conn = await client.connect();
            const sql = 'UPDATE orders SET status=($1) WHERE id=($2)';
            const result = await conn.query(sql, [o.status, o.id]);
            conn.release();
            return result.rows[0];
        } catch (err)
        {
            throw new Error(`Could not update order ${o.id}. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<Order> {
        try{
            const conn = await client.connect();
            const sql = 'DELETE FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err)
        {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }
}