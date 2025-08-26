# 🛍️ Unimart – E-Commerce Platform  

Unimart is a full-stack e-commerce web application built with **Next.js (frontend)** and **Node.js + Express + MongoDB (backend)**.  
It provides a smooth shopping experience with authentication, role-based access, product catalog, and admin dashboard.  

---

## 🚀 Features  

### 👤 Authentication & Authorization  
- User registration & login with **JWT**  
- Authentication via **HTTP-only cookies** or **Bearer tokens**  
- Role-based access control (`user`, `admin`)  
- Middleware protection (`protect`, `adminOnly`)  

### 🛒 Shopping Features  
- Product catalog with categories (Clothing, Accessories, etc.)  
- Product details with images, description, price, and ratings  
- Search & filters for better product discovery  
- Add to cart & checkout  

### ⚙️ Customization  
- Frame/product customization options (size, color, background, personal text)  
- Real-time preview of customizations  

### 📦 Orders & Reviews  
- Place and manage orders  
- Write product reviews with rating & comments  
- Average rating displayed on products  

### 🛠️ Admin Dashboard  
- Manage products (CRUD)  
- Manage users & roles  
- View customer orders  
- Role-restricted access with `adminOnly` middleware  

---

## 🏗️ Tech Stack  

**Frontend:**  
- [Next.js](https://nextjs.org/) (React, TypeScript)  
- Tailwind CSS for styling  
- Context API for Auth state  

**Backend:**  
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- MongoDB + Mongoose  
- JWT for authentication  
- Multer for image uploads  

---

## 📂 Project Structure  

**/frontend → Next.js app (UI)**
**/backend → Express + MongoDB API**


---

## 🔑 Authentication Middleware  

We use JWT stored in **cookies** (for web) or **Authorization headers** (for API tools).  

```js
const token =
  req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

