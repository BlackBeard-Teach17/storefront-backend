# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### User
- [Required] GET /users - returns all users - [JWT token required] and [admin role required]
- [Required] GET /users/:id - returns a single user - [JWT token required]
- [Required] POST /users/create - creates a new user and creates a JWT token
- [Optional] POST /users/authenticate - logs in a user and creates a JWT token
- [Optional] PUT /users/:id/username - updates a user's username - [JWT token required]
- [Optional] PUT /users/:id/password - updates a user's password - [JWT token required]
- [Optional] DELETE /users/:id - deletes a user - [JWT token required]

#### Products
- [Required] GET /products - returns all products
- [Required] GET /products/:id - returns a single product
- [Optional] GET /products/:category - returns all products in a category
- [Required] POST /products/create - creates a new product - [JWT token required] and [admin role required]
- [Optional] PUT /products/update/:id - updates a product - [JWT token required] and [admin role required]
- [Optional] PUT /products/update/:id/name - updates a product's name - [JWT token required] and [admin role required]
- [Optional] PUT /products/update/:id/price - updates a product's price - [JWT token required] and [admin role required]
- [Optional] PUT /products/update/:id/category - updates a product's category - [JWT token required] and [admin role required]
- [Optional] DELETE /products/:id - deletes a product - [JWT token required] and [admin role required]

#### Orders
- [Optional] GET /orders - returns all orders - [JWT token required] and [admin role required]
- [Required] GET /orders/:id - returns a single order - [JWT token required]
- [Optional] GET /orders/:id/getOrderItems - returns all products in an order - [JWT token required]
- [Optional] GET /orders/:id/getCompletedOrders - returns all completed orders for a user - [JWT token required]
- [Optional] POST /orders/create - creates a new order - [JWT token required]
- [Optional] POST /orders/:id/addProduct - adds a product to an existing order - [JWT token required]
- [Optional] PUT /orders/:id/updateStatus - updates the status of an order - [JWT token required]
- [Optional] DELETE /orders/:id/removeProduct - removes a product from an existing order - [JWT token required]
- [Optional] DELETE /orders/:id/deleteOrder - deletes an order - [JWT token required]

#### Admin
- [Optional] GET /admin/userswithorders - returns all users with orders - [JWT token required] and [admin role required]
- [Optional] GET /admin/top5products - returns the top 5 products by quantity sold - [JWT token required] and [admin role required]


<!-- #### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] -->

## Data Shapes
#### Product table
- Table: products (id: int [PK], name: varchar, price:int, category:varchar)

#### User table
- Table: users(id:int [PK], firstname:varchar, lastname:varchar, username:varchar, is_admin:boolean, password (varchar)

#### Orders table
- Table: orders (id:int [PK],status:varchar ,user_id:int [FK to users table])

#### Order_products table
- Table: order_products (id:int [PK], order_id:int [FK to orders table], product_id:int [FK to products table], quantity:int )

