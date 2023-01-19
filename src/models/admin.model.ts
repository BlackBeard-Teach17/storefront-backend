import {Product, ProductStore } from '../models/product.model';
import {Order, OrderStore } from '../models/order.model';
import {User, UserStore } from '../models/user.model';
import client from '../configs/database.config';

export class AdminStore {
    async top5Products(): Promise<Product[] | string> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT op.id, p.name, SUM(quantity)' + 
                        ' FROM orders' + 
                        ' INNER JOIN order_products op ON orders.id = op.order_id' + 
                        ' INNER JOIN products p ON op.product_id = p.id' +
                        ' WHERE orders.status = \'completed\'' +
                        ' GROUP BY op.id, p.id, p.name' +
                        ' ORDER BY quantity DESC LIMIT 5';
            const result = await conn.query(sql);
            conn.release();
            if (result.rows.length === 0) {
                return 'No products found';
            }
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get top products. Error: ${err}`);
        }
    }

    async usersWithOrders(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT users.id, users.firstname, users.lastname, users.username' + 
                        ' FROM users' + 
                        ' JOIN orders ON users.id = orders.user_id' + 
                        ' GROUP BY users.id';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users with orders. Error: ${err}`);
        }
    }
}
