Prime Properties

Prime Properties is a full-stack real estate management application built with Spring Boot (Backend) and React (Frontend). It enables users to browse properties, schedule appointments, make secure payments, and manage listings through a role-based system designed with real-world application architecture.

🎯 Why This Project

Real estate platforms require secure transaction handling, controlled access, and reliable data management. This project addresses those challenges by implementing:

Secure authentication and authorization using JWT.

Strict data integrity rules to prevent accidental loss of active booking data.

Automated generation of professional payment receipts.

A scalable layered backend architecture suitable for production-grade applications.

The system ensures a smooth and secure experience for both property owners and customers.

🚀 Features
Core Functionality

User Roles

Customer

Browse available properties

Book appointments

Make payments

Download payment receipts

Owner

Add and manage property listings

View booking requests

Manage availability

Admin

Manage users

Monitor system activity

Authentication & Security

JWT-based authentication

Role-based access control

Secure API endpoints using Spring Security

⭐ New Features (Version 2.0)
📄 PDF Payment Receipts

Automatically generates professional PDF receipts after successful payment.

Users can download receipts from the My Appointments section.

Helps maintain financial transparency and record keeping.

🗑️ Safe Property Deletion

Property owners can delete listings safely.

Deletion is blocked if:

Active future appointments exist

Confirmed bookings are present

Prevents accidental data loss and maintains database consistency.

🛠 Tech Stack
Backend

Framework: Spring Boot 3.2

Language: Java 17

Database: MySQL

Security: Spring Security + JWT

ORM: Hibernate / Spring Data JPA

PDF Generation: OpenPDF (LibrePDF)

Build Tool: Maven

Frontend

Framework: React (Vite)

Styling: Tailwind CSS

Routing: React Router

HTTP Client: Axios

🏗 Authorization & Roles
Role	Permissions
GUEST	View properties, Register, Login
CUSTOMER	Book appointments, Make payments, Download receipts
OWNER	Add/Edit Properties, Delete Properties (if safe), View Requests
ADMIN	Manage Users, View System Stats, Full Access
🏃‍♂️ Getting Started
Prerequisites

Java 17+

Node.js 18+

MySQL Server

1️⃣ Database Setup

Create a MySQL database named prime_db:

CREATE DATABASE prime_db;


Update database configuration in:

backend/src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/prime_db
spring.datasource.username=your_username
spring.datasource.password=your_password

2️⃣ Backend Setup (Spring Boot)
cd backend
mvn clean install
mvn spring-boot:run


Backend runs on:

http://localhost:8080

3️⃣ Frontend Setup (React)
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔐 API Testing

APIs can be tested using:

Postman

Swagger UI

Swagger URL:

http://localhost:8080/swagger-ui.html

📂 Project Architecture
backend
 ├── controller
 ├── service
 ├── repository
 ├── entity
 ├── security
 └── config

frontend
 ├── components
 ├── pages
 ├── services
 └── routes


The backend follows a layered architecture ensuring separation of concerns and maintainability.

📈 Future Enhancements

Online payment gateway integration

Property image optimization

Email notifications for bookings

Advanced search and filtering

Admin analytics dashboard

👨‍💻 Author

Rishi Dusane
LinkedIn: https://www.linkedin.com/in/rishidusane/

GitHub: https://github.com/RishiDusane
