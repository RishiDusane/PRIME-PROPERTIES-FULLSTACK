🏠 Prime Properties – Real Estate Management Web Application

Prime Properties is a full-stack real estate management web application developed using Spring Boot (backend) and React.js (frontend). The application enables users to browse properties, schedule visits, manage bookings, and perform secure transactions while allowing property owners and administrators to manage listings efficiently.

This project demonstrates practical implementation of backend development, REST API design, authentication, and full-stack integration following industry-standard software engineering practices.

🚀 Features
👤 User Features

User registration and secure login using JWT authentication

Browse available properties with detailed information

Book property visits and manage appointments

Secure booking and payment workflow

View booking history and transaction details

🏢 Owner/Admin Features

Add, update, and manage property listings

Manage bookings and customer requests

Prevent deletion of properties with active bookings

Generate automated payment receipts

🔐 Security Features

Role-based authentication and authorization

JWT-based session management

Spring Security integration

Secure REST API endpoints

🛠️ Tech Stack
Backend

Java

Spring Boot

Spring Security

Hibernate / JPA

REST APIs

JWT Authentication

Frontend

React.js

Axios

HTML5

CSS3

JavaScript

Database

MySQL

Tools & Technologies

Maven

Postman (API Testing)

Git & GitHub

🏗️ System Architecture

The application follows a layered architecture:

Controller → Service → Repository → Database


Controller Layer: Handles API requests and responses

Service Layer: Business logic implementation

Repository Layer: Database interaction using JPA

Database Layer: MySQL relational database

🎯 Project Objectives

Build a scalable real-world full-stack application

Implement secure authentication using JWT

Apply backend best practices using Spring Boot

Ensure data integrity and reliable transaction handling

Demonstrate full-stack development skills for enterprise applications

📸 API Testing

All APIs were tested using Postman, including:

Authentication APIs

Property management APIs

Booking APIs

Payment workflows

Validation and error handling scenarios

⚙️ Installation & Setup
Prerequisites

Java 17+

Node.js

MySQL

Maven

Backend Setup
git clone https://github.com/your-username/prime-properties.git
cd backend
mvn clean install
mvn spring-boot:run

Frontend Setup
cd frontend
npm install
npm start

📌 Future Enhancements

Online payment gateway integration

Email notifications for bookings

Property image upload optimization

Advanced search and filtering

Deployment using Docker & Cloud services

👨‍💻 Author

Rishi Dattatray Dusane
CDAC PG-DAC Graduate | Java Fullstack Developer
Pune, India
