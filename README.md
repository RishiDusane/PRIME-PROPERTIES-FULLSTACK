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

<img width="1920" height="1080" alt="Home" src="https://github.com/user-attachments/assets/cd83e1f6-fd45-4d08-b2fa-ae7ac188f971" />
<img width="1920" height="1080" alt="Login" src="https://github.com/user-attachments/assets/6db78b9e-9be3-492a-aea1-76d800a3a00e" />
<img width="1920" height="1080" alt="SignUp" src="https://github.com/user-attachments/assets/06aae3d4-d482-49b8-8e83-ac2e1d810ad6" />
<img width="1920" height="1080" alt="PropertyDetails" src="https://github.com/user-attachments/assets/a07f2c19-c3ad-43fc-9a46-4bfda330dd9b" />
<img width="1920" height="1080" alt="PropertyViewCustomer" src="https://github.com/user-attachments/assets/0ab5a274-0e83-4898-ba03-b918cd406b90" />
<img width="1920" height="1080" alt="Appointments" src="https://github.com/user-attachments/assets/6ef56ac4-0b79-4cf8-9c16-93de7661dc76" />
<img width="1920" height="1080" alt="CustomerQuery" src="https://github.com/user-attachments/assets/a54b47ec-769c-4707-9439-7b5c6ef2f157" />
<img width="1920" height="1080" alt="AdminDashboard" src="https://github.com/user-attachments/assets/c52d754a-5663-47e6-ba87-bf1b0b4cd040" />
<img width="1920" height="1080" alt="AdminSupportDesk" src="https://github.com/user-attachments/assets/5a67e035-0a3f-40f0-8501-441c6f25df5a" />
<img width="1920" height="1080" alt="ChangePassword" src="https://github.com/user-attachments/assets/f9dd174c-dce5-4ad0-afa8-d1c8ee6c1106" />


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
