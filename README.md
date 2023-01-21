# Storefront Backend Project
The Storefront Backend Project is a Node/Express API that provides a RESTful interface to a Postgres database. The API is used by an Angular frontend to provide a user interface for a fictional online store. The API is built to meet the requirements outlined in the `REQUIREMENTS.md` document.

## Getting Started
- To get started, clone this repo and run `npm` in your terminal at the project root. This will install all the required dependencies.


## Required Technologies

### Making use of Docker (recommended)
- You can use Docker to run Postgres in a container. You can find instructions for your operating system [here](https://docs.docker.com/get-docker/).
- You will need to create a Postgres databse and user. You can do this by running the running the docker-compose file in the root of the project. You can do this with the following command:
  - `docker-compose up -d`
This will spin up a Postgres container for you.
### Postgres DB installed on your machine
- You will need to install Postgres on your machine. You can find instructions for your operating system [here](https://www.postgresql.org/download/).
- You will need to create a Postgres database and user. You can do this with the following commands:
  - `CREATE DATABASE storefront;`
  - `CREATE USER storefront_user WITH PASSWORD 'secret123';`
  - `GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;`

### Environment Variables
- You will need to create a `.env` file in the root of the project. This file should contain the following:
 - `POSTGRES_HOST=localhost`
 - `POSTGRES_DB=storefront`
 - `POSTGRES_TEST_DB=storefront_test`
 - `POSTGRES_USER=storefront_user`
 - `POSTGRES_PASSWORD=secret123`
 - `BCRYPT_PASSWORD=bCrYpT12#`
 - `SALT_ROUNDS=10`
 - `JWT_SECRET=secret123`

 ## Running the Project
    - To run the project, run the following command in the root of the project:
    - `npm start` this will start the server on port 3001
    - `npm run watch` this will start the server on port 3001 and watch for changes to the codebase
    - `npm test` this will run the tests in the project. 


