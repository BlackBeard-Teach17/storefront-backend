import bcrypt from "bcrypt";
import client from "../configs/database.config";

export type User = {
    id?: number;
    firstname?: string;
    lastname?: string;
    username: string;
    password: string;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT username FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    async isDuplicate(usrname: string): Promise<boolean> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT username FROM users WHERE username=($1)';
            const result = await conn.query(sql, [usrname]);
            conn.release();
            if (result.rows.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            throw new Error(`Could not find user ${usrname}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User | string> {
        try{
            if (await this.isDuplicate(u.username))
            {
                const duplicate_user = `Username ${u.username} already exists`;
                return duplicate_user;
            }
            const conn = await client.connect();
            const sql = 'INSERT INTO users (firstname, lastname, username, password_digest) VALUES($1, $2,$3,$4) RETURNING *';
            const hash = bcrypt.hashSync(u.password, Number(process.env.SALT_ROUNDS));
            const result = await conn.query(sql, [u.firstname, u.lastname, u.username, hash]);
            conn.release();
            return result.rows[0];
        }catch (err)
        {
            throw new Error(`Could not add new user ${u.username}. Error: ${err}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT firstname, lastname, username FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | string> {
        const user: User = {
            username: username,
            password: password
        }
        try {
            const conn = await client.connect();
            const sql = 'SELECT password_digest FROM users WHERE username=($1)';
            const result = await conn.query(sql, [username]);
            conn.release();

            if (result.rows.length) {
                const user: User = {
                    username: username,
                    password: result.rows[0].password_digest
                }
                if (bcrypt.compareSync(password, user.password)) {
                    return user;
                }
            }
            throw new Error('Incorrect username or password');
            
        } catch (err) {
            throw new Error(`Could not authenticate user ${username}. ${err}`);
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`);
        }
    }

    /**
     * 
     * TODO: Only allow user to update their own password
     */
    async updateUserPassword(id: string, password: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'UPDATE users SET password_digest=($1) WHERE id=($2)';
            const hash = await bcrypt.hashSync(password, process.env.SALT_ROUNDS);
            const result = await conn.query(sql, [hash, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update user ${id}. Error: ${err}`);
        }
    }

    async updateUsername(id: string, username: string): Promise<User | string> {
        try {
            if(await this.isDuplicate(username))
            {
                const duplicate_user = `User ${username} already exists`;
                return duplicate_user;
            }
            const conn = await client.connect();
            const sql = 'UPDATE users SET username=($1) WHERE id=($2)';
            const result = await conn.query(sql, [username, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update user ${id}. Error: ${err}`);
        }
    }
    
}