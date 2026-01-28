🏠 Prime Properties – Real Estate Management Web Application

Prime Properties is a full-stack real estate management web application that allows users to list, explore, buy, and rent properties. It is built using a modern RESTful architecture with Spring Boot powering the backend, React.js handling the frontend, and MySQL serving as the relational database.

The project is designed to reflect real-world application development practices, focusing on clean code structure, scalable architecture, and secure JWT-based authentication.

🚀 Features

👤 User Registration & Authentication (JWT-based)

🔐 Secure Login & Role-based Authorization (Admin / Seller / Customer)

🏘️ Add, Update, and Manage Property Listings (Seller)

🌐 Browse and Explore Properties (Customer)

💰 Buy or Rent Properties through the Platform

📅 Book Property Visit Appointments

📋 Manage Bookings & Appointments

🖼️ Property Image Upload & Management

💳 Online Payment Integration for Property Booking

📊 Admin Analytics Dashboard for Platform Monitoring

🔑 Forgot Password & Change Password with Token Verification

🧑 Personalized User Dashboards

📡 RESTful API Integration with Frontend

🛠️ Tech Stack
Backend

☕ Java 17

🍃 Spring Boot 3.2

🌐 Spring MVC

🗄️ Spring Data JPA (Hibernate)

🔐 Spring Security

🪙 JWT Authentication

🔄 RESTful APIs

🧩 ModelMapper

✂️ Lombok

🐬 MySQL

Frontend

⚛️ React.js

🧭 React Router (Protected Routes)

📡 Axios

🪝 Hooks-based State Management

🎨 Custom CSS (Light-Themed UI)

💻 HTML5 / CSS3 / JavaScript (ES6)

Database

🐬 MySQL

Tools & IDE

🧠 IntelliJ / Eclipse

📮 Postman (API Testing)

📑 Swagger (API Documentation)

🗃️ Git & GitHub

🧩 Architecture & Design

🏗️ Layered Architecture
Controller → Service → Repository

📦 DTO Pattern for Data Transfer

🔐 JWT-based Stateless Authentication

🧑‍🤝‍🧑 Role-based Authorization (Admin / Seller / Customer)

⚠️ Centralized Exception Handling

Entity Relationships

User ↔ Property ↔ Appointment ↔ Booking ↔ Payment ↔ Query

🌍 CORS Configuration for Frontend Integration

<img width="926" height="506" alt="image" src="https://github.com/user-attachments/assets/c22ff423-2542-4eb7-bf68-6acb25f4c2ee" />


🔐 Authentication Flow

📝 User registers → Role assigned (Customer / Seller)

🔓 User logs in → JWT token generated

💾 Token stored in frontend (localStorage)

📤 JWT attached to protected API requests

✅ Spring Security validates token on each request

<img width="1070" height="747" alt="image" src="https://github.com/user-attachments/assets/90e57585-30aa-4bbf-91d5-ffee5fe87748" />


This project was developed as part of the PG-DAC curriculum at IACSD, Pune to demonstrate:

💻 Full-stack Web Development

🌐 REST API Design using Spring Boot

🔐 Secure Authentication with Spring Security & JWT

⚛️ Frontend Integration with React.js

🗄️ Database Modeling & ORM with Hibernate

🧼 Clean Code and Scalable Architecture

🖥️ Screenshots

(Will be updated soon)

🚀 How to Run Locally
Backend

Configure database credentials in:

springboot_backend_template/src/main/resources/application.properties


Run:

mvn clean install
mvn spring-boot:run

Frontend
npm install
npm run dev

📌 Future Enhancements

📧 Email Notifications for Bookings & Appointments

🔍 Advanced Property Search & Smart Filters

📍 Location-based Property Recommendations

📱 Progressive Web App (PWA) Version

👨‍💻 Developer

Rishi Dusane
Mechanical Engineering Graduate (2021)
PG-DAC Graduate (2026) – IACSD, Pune
