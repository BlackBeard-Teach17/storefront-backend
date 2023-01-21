import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import product_routes from './controllers/product.controller';
import user_rouets from './controllers/user.controller';
import order_routes from './controllers/order.controller';
import admin_routes from './controllers/admin.controller';


const app: express.Application = express()
const address: string = "0.0.0.0:3001"

app.use(bodyParser.json())
app.use(cors());
product_routes(app);
user_rouets(app);
order_routes(app);
admin_routes(app);

app.listen(3001, function () {
    console.log(`starting app on: ${address}`)
})

export default app;
