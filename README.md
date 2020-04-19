<p align="center">
  <a href="https://codecov.io/gh/catalanska/courier-service">
    <img src="https://codecov.io/gh/catalanska/courier-service/branch/master/graph/badge.svg" />
  </a>
</p>

# Courier Service 🚚

Microservice that keeps and provides up-to-date information about couriers and their capacity

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
node (v12.x)
npm (v6.x)
mongodb (v4.2.5)
```

### Installing

1. Download or clone the repo
2. Rename the `env.default` file to `.env`
3. Change the content of the file to point to you local database
4. Install dependencies running `npm i`

End with an example of getting some data out of the system or using it for a little demo

## Usage

1. Start the server locally

```sh
npm start
```

2. Launch your requests. A [Postman collection](https://github.com/catalanska/courier-service/tree/master/postman_collection.json) has been added to the repo to make the testing easier.

2.1 Create a new courier

```bash
curl --location --request POST 'http://localhost:1234/couriers' \
--header 'Content-Type: application/json' \
--data-raw '{
	"id": "courierID",
	"max_capacity": 2000
}'
```

2.2 List existing couriers

```bash
curl --location --request GET 'http://localhost:1234/couriers'
```

2.3 Filter couriers by available space

```bash
curl --location --request GET 'http://localhost:1234/couriers?capacity_required=100'
```

2.4 Add a package to a courier

```bash
curl --location --request PUT 'http://localhost:1234/couriers/{{courierId}}/packages' \
--header 'Content-Type: application/json' \
--data-raw '{
	"package" :{
		"id": "packageID",
		"volume": 200
	}
}'
```

2.5 Remove a package from a courier

```bash
curl --location --request DELETE 'http://localhost:1234/couriers/{{courierID}}/packages/{{packageID}}'
```

## Running the tests

Just need to type `npm test`

## Built With

- [Node](https://nodejs.org/es/) - JS environment
- [NPM](https://www.npmjs.com/) - Dependency Management
- [Express.js](https://expressjs.com/) - Server framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB ORM
- [Jest](https://jestjs.io/en/) - Testing framework
- [Babel](https://babeljs.io/) - JS compiler to enable es6 modules
