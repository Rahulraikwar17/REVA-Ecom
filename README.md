# REVA

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Website-2C3480?style=for-the-badge&logo=vercel&logoColor=white)](https://reva-ecom.vercel.app/)

**[Visit REVA — Live Website](https://reva-ecom.vercel.app/)**

**Everyday clothing at honest prices.**

A full-stack e-commerce app for shoppers and sellers, built with the MERN stack.

![React](https://img.shields.io/badge/React-black?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-black?style=for-the-badge&logo=nodedotjs&logoColor=5FA04E)
![MongoDB](https://img.shields.io/badge/MongoDB-black?style=for-the-badge&logo=mongodb&logoColor=47A248)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-black?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-black?style=for-the-badge&logo=reactquery&logoColor=FF4154)

</div>

---

## Overview

REVA is a clothing store where customers browse products, pick a size and manage a cart, while sellers list and manage their own products from a dedicated panel. Access is role-based: seller tools only appear for seller accounts and are enforced on the server.

## Screenshots

| Home | Products |
|:---:|:---:|
| ![Home](docs/screenshots/home.png) | ![Products](docs/screenshots/products.png) |

| Cart | Seller Panel |
|:---:|:---:|
| ![Cart](docs/screenshots/cart.png) | ![Seller Panel](docs/screenshots/seller.png) |

## Features

### For Customers

- Register, log in and log out securely
- Browse listed products with size and price
- Cart with quantity controls, per-item removal and a clear cart option
- Stock-aware cart: quantity cannot exceed the stock of the selected size
- Unavailable items (deleted or unlisted products) are flagged in the cart and block checkout until removed
- Order summary with a 20% sale discount and total savings
- Loading skeletons, empty states and clear error messages

### For Sellers

- Seller entry in the navbar with a dropdown (Add Product, All Products), visible only to seller accounts
- Add product form with title, description, price, sizes with stock and up to five images
- Image upload to ImageKit with preview, type and size validation
- List and unlist products with a single publish toggle
- Seller product list showing stock per size, price and status
- Edit and delete products
- Manage listed and unlisted products

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Tailwind CSS, lucide-react |
| State Management | Redux Toolkit |
| Server State & Data Fetching | TanStack React Query |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT access token, role-based authorization (`user`, `seller`) |
| Validation | express-validator |
| File Upload | Multer and ImageKit |

## Project Structure

```text
frontend/
└── src/
    ├── app/
    │   └── layouts/          AuthLayout, MainLayout
    ├── routes/               AppRoute, PublicRoute, PrivateRoute, SellerRoute
    ├── config/               Axios instance
    ├── features/
    │   ├── auth/              API, hooks, Login, Register
    │   ├── cart/              API, hooks, CartPage, CartItem, EmptyCart, UnavailableItem
    │   └── product/           API, hooks, Products, AddProduct, SellerProducts
    └── shared/
        └── ui/                Home, About, Navbar, Footer, loaders

backend/
├── controllers/               auth, cart, product
├── models/                    user, product, cart
├── routes/
├── middlewares/               authenticate, authenticateSeller, upload
└── validators/                express-validator chains

docs/
└── screenshots/
    ├── home.png
    ├── products.png
    ├── cart.png
    └── seller.png
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or Atlas)
- An ImageKit account for product images

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/reva.git
cd reva
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/reva
JWT_SECRET=replace-with-a-long-random-string

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:3000/api`.

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Make sure the Axios base URL in `src/config` points to:

```text
http://localhost:3000/api
```

### 4. Create a Seller Account

Register a normal account, then change its `role` from `user` to `seller` in the MongoDB `users` collection. Log in again or refresh the application to access seller features.

A self-service "Become a Seller" flow is planned for a future release.

## Roles

| Capability | Customer | Seller |
|---|:---:|:---:|
| Browse listed products | Yes | Yes |
| Use the cart | Yes | Yes |
| Add products | No | Yes |
| Edit and delete products | No | Yes |
| List or unlist products | No | Yes |
| Access `/seller/*` pages | No | Yes |

Role checks run on the server in the `authenticate` and `authenticateSeller` middlewares. Hiding the navbar entry is only a convenience, not the security layer.

## API Overview

All routes are prefixed with `/api`. Protected routes require a logged-in user unless noted.

### Cart

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/cart` | — | Get the cart with product details and `availableStock` per item |
| POST | `/cart` | `{ productId, size, quantity }` | Add an item or increase the quantity of the same product and size |
| PATCH | `/cart/:itemId` | `{ quantity }` | Set the final quantity of one cart item |
| DELETE | `/cart/:itemId` | — | Remove one cart item |
| DELETE | `/cart` | — | Remove all items |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Customer | List published products |
| POST | `/products` | Seller | Create a product using `multipart/form-data` |
| PATCH | `/products/listing/:id` | Seller | Publish or unpublish a product |

Seller-only endpoints also provide access to the seller's own products for management, including editing and deletion.

### Product Creation Fields

| Field | Format |
|---|---|
| `title` | Text |
| `description` | Text |
| `price` | JSON string, e.g. `{"amount":599,"currency":"INR"}` |
| `sizes` | JSON string, e.g. `[{"size":"M","stock":50}]` |
| `published` | `true` or `false` |
| `images` | Up to five files (JPG, PNG or WebP) |

## Data Models

Simplified representation of the main product and cart models:

```js
Product {
  title: String,
  description: String,
  images: [String],
  price: {
    amount: Number,
    currency: "INR"
  },
  sizes: [{
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL",
    stock: Number
  }],
  seller: ObjectId,
  published: Boolean
}

Cart {
  user: ObjectId,
  products: [{
    product: ObjectId,
    quantity: Number,
    size: String
  }]
}
```

## Business Rules

- A cart item is identified by its own `_id`. The same product in two sizes creates two items.
- Adding a product that is already in the cart (same size) increases its quantity instead of duplicating it.
- Quantity is always validated against the stock of the selected size on the server.
- A product that is deleted or unlisted shows as unavailable in the cart and is excluded from totals.
- Every user has exactly one cart.

## Design

- Black-and-white interface with cobalt blue (`#0047AB`) as the accent color
- Subtle scroll and entrance animations
- Support for reduced-motion preferences

## Roadmap

![Completed](https://img.shields.io/badge/Completed-7-2C3480?style=for-the-badge)
![Remaining](https://img.shields.io/badge/Remaining-3-gray?style=for-the-badge)

- [x] Authentication and role-based authorization
- [x] Cart with stock validation
- [x] Handling unavailable cart items
- [x] Seller product creation with image uploads
- [x] Publish and unpublish products
- [x] Seller product list with All, Listed, and Unlisted tabs
- [x] Edit and delete products
- [ ] Checkout and order management
- [ ] Self-service seller registration
- [ ] Debounced, optimistic cart quantity updates

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.
