Paul Johnson

Description
this project is a database for setup for insitutions to be accessed through API using the CRUD methods

Prerequisites

Node.js
Docker

Setup Instructions

Clone the repository:

git clone <repository-url>
Navigate to the project directory:

cd <project-directory>
Install the dependencies:

npm run docker:run:dev

npm install

npm run setup

Running the Application
npm run dev

Navigate to http://localhost:3000 in your browser.

API Endpoints
Method	     Endpoint	                Description

POST	    /api/institutions	        Create a new institution
GET	        /api/institutions	        Get all institutions
GET     	/api/institutions/:id	    Get an institution by ID
PUT	        /api/institutions/:id   	Update an institution by ID
DELETE	    /api/institutions/:id   	Delete an institution by ID

POST        http://localhost:3000/api/auth/register          registers a user
GET         http://localhost:3000/api/auth/login         logs in and gets a jwt