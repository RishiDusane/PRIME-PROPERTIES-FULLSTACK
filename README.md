# Prime Properties

Prime Properties is a full-stack real estate management application built with **Spring Boot** (Backend) and **React** (Frontend). It facilitates property browsing, appointment booking, secure payments, and property management for verified owners.

---

## 🎯 Why This Project
This project solves the challenge of managing real estate transactions securely and reliably. It enforces strict data integrity constraints—preventing the deletion of active bookings—and provides professional, automated financial documentation via PDF receipts, ensuring a production-grade experience for both property owners and customers.

---

## 🚀 Features

### Core Functionality
- **User Roles**:
  - **Customer**: Browse properties, book appointments, pay for bookings, download receipts.
  - **Owner**: Publish properties, view appointments, manage property availability.
  - **Admin**: System oversight and user management.
- **Authentication**: Secure JWT-based login and role-based access control.

### New Features (Version 2.0)
- **📄 PDF Payment Receipts**
  - Automatically generates professional PDF receipts after payment.
  - Accessible via "Download Receipt" in the *My Appointments* section.

- **🗑️ Safe Property Deletion**
  - Owners can delete their properties.
  - Deletion is blocked if the property has active (future) appointments or confirmed bookings to ensure data integrity.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Database**: MySQL
- **Security**: Spring Security + JWT
- **PDF Generation**: OpenPDF (LibrePDF)
- **Build Tool**: Maven

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios

---

## 🏗 Authorization & Roles

| Role | Permissions |
| :--- | :--- |
| **GUEST** | View properties, Register, Login |
| **CUSTOMER** | Book appointments, Make payments, Download receipts |
| **OWNER** | Add/Edit Properties, Delete Properties (if safe), View Requests |
| **ADMIN** | Manage Users, View System Stats, Full Access |

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server

---

### 1. Database Setup

Create a MySQL database named `prime_db`:

```sql
CREATE DATABASE prime_db;
