Project Title
Description
A brief description of the project.

Prerequisites
Node.js
Docker
Setup Instructions
Clone the repository:

git clone <repository-url>
Navigate to the project directory:

cd <project-directory>
Install the dependencies:

npm install
Copy the example environment variables file:

npm run env:copy
Start the PostgreSQL Docker container:

npm run docker:run:dev
Create and apply the database migrations:

npm run prisma:migrate
Running the Application
npm run dev
Navigate to http://localhost:3000 in your browser.