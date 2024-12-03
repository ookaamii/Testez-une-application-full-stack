# Yoga

![yoga](https://user.oc-static.com/upload/2022/10/25/16667162692336_P5_banner-numdev.png)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

# Start the project

Git clone:

> git clone https://github.com/ookaamii/Testez-une-application-full-stack.git


### MySQL - Create database

SQL script for creating the schema is available `ressources/sql/script.sql`

> mysql -u root -p

> CREATE DATABASE nomdelabase;

> exit;

> mysql -u root -p nomdelabase < mon/chemin/nom_du_fichier.sql

If needed, modify the `/back/src/main/resources/application.properties` file with the correct values to connect to the database.

By default the admin account is:
- login: yoga@studio.com
- password: test!1234

### FRONT-END

Go inside folder front:

> cd front

Install dependencies:

> npm install

### BACK-END

Go inside folder back:

> cd back

Install dependencies:

> mvn clean install

### Test

#### Launch Front test unitaire / integration:

> npx jest --coverage

Check the coverage result:
Go inside folder and open file `/front/coverage/jest/lcov-report/index.html`

#### Launch Front test e2e:

> npm run e2e

> npx cypress run

> npm run e2e:coverage

Check the coverage result:
Go inside folder and open file `/front/coverage/lcov-report/index.html`

#### Launch Back test:

> mvn clean install

Check the coverage result unitaire + integration:
Go inside folder and open file `/back/target/jacoco-merged-test-coverage-report/index.html`

Check the coverage result integration:
Go inside folder and open file `/back/target/jacoco-integration-test-coverage-report/index.html`


## Ressources

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman




