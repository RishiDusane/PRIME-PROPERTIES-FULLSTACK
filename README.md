Prime Properties - Full-Stack Real Estate Management System
This project is a comprehensive real-stack application developed during the PG-DAC course at IACSD Pune. It is designed to streamline property listings, user authentication, and appointment scheduling between buyers and sellers.

🚀 Project Overview
The system provides a platform for managing real estate transactions, featuring a secure backend built with Spring Boot and a dynamic, responsive frontend developed using React.js.

Key Features
Secure Authentication: Implements JWT-based security with role-based access control (Admin, Seller, Buyer).

Property Management: Allows sellers to add, edit, and manage property listings with detailed descriptions.

Appointment Scheduling: Enables buyers to book and manage appointments for property visits.

Password Management: Includes secure "Forgot Password" and "Change Password" workflows with token-based verification.

User Dashboard: Personalized views for users to track their activities and properties.

🛠️ Tech Stack
Backend
Framework: Spring Boot 3.2.0

Language: Java 17

Security: Spring Security & JSON Web Token (JWT)

Database: MySQL with Spring Data JPA

API Documentation: SpringDoc OpenAPI (Swagger)

Utilities: ModelMapper for DTO mapping and Lombok for boilerplate reduction

Frontend
Library: React.js

Routing: React Router for navigation and protected routes

State Management: Hooks-based architecture (useState, useEffect)

Styling: Custom CSS for a professional UI

📂 Project Structure
springboot_backend_template/: Contains the Maven-based Java backend.

src/: Contains the React.js source code including components, pages, and services.

pom.xml: Manages backend dependencies and build configurations.

🔧 Installation & Setup
Prerequisites
Java Development Kit (JDK) 17

Node.js and npm

MySQL Server

Maven

Backend Setup
Configure your database credentials in springboot_backend_template/src/main/resources/application.properties.

Navigate to the backend directory and run:

Bash
mvn clean install
mvn spring-boot:run
Frontend Setup
Navigate to the root directory and install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
Developed by Rishi Dusane 2021 Mechanical Engineering Graduate | PG-DAC Aspirant at IACSD Pune
