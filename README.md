# E-Commerce Platform

## Overview
This is the CS308 course project. It is a feature-rich e-commerce platform. It includes both customer-facing and administrative functionalities, with robust logic. The platform is developed using a modern tech stack, focusing on performance, scalability, and maintainability.

---

## Tech Stack

### Backend:
- **Language:** Java
- **Framework:** Spring Boot
- **Database:** MySQL
- **API Development:** RESTful APIs with Spring MVC

### Frontend:
- **Language:** JavaScript
- **Library:** React.js
- **Charting:** Chart.js
- **Styling:** Tailwind CSS + CSS
- 
### Hosting:
- **Database Hosting:** AWS RDS (Relational Database Service) for MySQL, ensuring scalability, reliability, and high availability.
### Other Tools:
- **HTTP Client:** Axios
- **File Uploads:** Multipart file support for images

---

## Installation

### Prerequisites:
- Java 17+
- Node.js 16+
- MySQL Server

### Steps:
1. **Clone the Repository:**
   ```bash
   https://github.com/hilalsay/cs308.git
   cd cs308
   ```

2. **Backend Setup:**
   - Note: The backend is on the master branch.
     ```bash
     ./mvnw clean install
     ```
   - Create a database in MySQL:
     ```sql
     CREATE DATABASE ecommerce;
     ```
   - Update the database credentials in `application.properties`.
   - Start the backend server or directly run from IntelliJ.
     ```bash
     ./mvnw spring-boot:run
     ```

3. **Frontend Setup:**
   - Note: The frontend is on the frontend_part2 branch.
   - Change the branch and install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

---

## Some API Endpoints

### Product Endpoints:
- `GET /api/products` - Fetch all products.
- `GET /api/products/in-stock` - Fetch in-stock products.
- `POST /api/products` - Add a new product with an image.
- `PUT /api/products/{id}` - Update product details.
- `DELETE /api/products/{id}` - Mark a product as deleted.

### Category Endpoints:
- `GET /api/categories` - Fetch all categories.
- `POST /api/categories` - Add a new category.
- `DELETE /api/categories/{id}` - Mark a category as deleted along with its products.

---

## Soft Deletion Logic
Instead of permanently deleting products or categories, this system marks them as deleted by setting a `deleted` flag to `true`. Deleted data is:
- Excluded from customer-facing views.

---

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit and push your changes:
   ```bash
   git commit -m "Add your message here"
   git push origin feature/your-feature-name
   ```
4. Open a pull request and describe your changes.

---


