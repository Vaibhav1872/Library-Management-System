Library Management System
A modern, full-stack web application for managing a library, featuring role-based access for admins and students. Built with an Angular frontend, a Spring Boot backend, and an Oracle database.

Features
This application provides a complete set of features for both library members and administrators, organized by user role.

Student Features
User Authentication: Secure login and logout functionality.

Browse & Search: View the entire book catalog with a functional search bar to filter by book title and maximum price.

Borrow Books: Students can borrow any available book.

My Books Page: A dedicated page for students to view a list of all the books they have currently checked out.

Return Books: Students can return books from their "My Books" page.

Admin Features
All Student Features: Admins have access to all student-level functionality.

Book Management (CRUD):

Create: Add new books to the catalog, including uploading a cover image.

Read: View and search the full book list.

Update: Edit the details (title, author, price, image) of any existing book.

Delete: Remove books from the catalog.

User Management: Register new users with either 'admin' or 'student' roles.

Centralized Borrowing View: A dedicated admin page to view a comprehensive list of all books currently borrowed by all users.

Tech Stack
This project is built using a modern, three-tier architecture.

Frontend:

Angular 17+ (TypeScript)

HTML5 & CSS3

RxJS for state management

Backend:

Java 17

Spring Boot 3

Spring Data JPA / Hibernate for database interaction

Maven for dependency management

Database:

Oracle Database 11g

Architecture
The application follows a classic RESTful API architecture. The Angular frontend is completely decoupled from the Spring Boot backend. All communication between the two happens through HTTP requests, with data exchanged in JSON format.

Getting Started
To run this project locally, you will need to have Java (JDK 17+), Node.js (v18+), and an Oracle Database instance installed.

1. Backend Setup
Clone the Repository:

git clone <your-repository-url>

Database Configuration:

Open the src/main/resources/application.properties file.

Update the spring.datasource.url, spring.datasource.username, and spring.datasource.password properties to match your local Oracle database configuration.

Run the Database Scripts:

Execute the SQL scripts provided (oracle_setup.sql and oracle_setup_books.sql) to create the necessary tables (app_users, books, borrowed_records) and sequences.

Build and Run the Application:

Open a terminal in the backend project's root folder and run the Maven command to build and start the server:

mvn spring-boot:run

The backend server will start on http://localhost:8080.

2. Frontend Setup
Navigate to the Frontend Folder:

Open a new terminal and navigate into your Angular project folder.

Install Dependencies:

Run npm install to download all the necessary libraries.

npm install

Start the Development Server:

Run ng serve to start the Angular application.

ng serve
