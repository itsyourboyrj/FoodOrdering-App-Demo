# FoodOrdering-App-Demo
_**Author: Ravi Raj**_

This project implements a simplified food ordering platform with role-based access control (RBAC) and country-scoped permissions as described in the assignment. The application is built using a lightweight full-stack setup (Node.js/Express backend + React frontend) to keep the code easy to read and straightforward to review.

<img width="1129" height="541" alt="Screenshot 2025-11-13 at 9 20 13 PM" src="https://github.com/user-attachments/assets/cb9941f6-43f6-4d37-8c95-6e52a9c8f296" />

## Features Implemented
### Core
- View restaurants and their menus
- Create an order (cart → items → total)
- Checkout and simulate payment
- Cancel an order
- Update user payment methods

### Role-Based Access Control
- Admin: Full access to all actions
- Manager: Can create, pay for, and cancel orders within their country
- Member: Can browse and create orders, but cannot pay or cancel

**Bonus Requirement**

**_Managers and Members only see restaurants and orders in their own country._**

## Tech Stack

**Backend:**
- Node.js
- Express
- In-memory data store for simplicity
- Simulated authentication via custom header (x-user-id)

**Frontend:**
- React (Create React App structure)
- Simple stateful UI with no external UI libraries

## How to Run

**1. Backend:**
```
cd backend
npm install
npm start
```
**_Runs on: http://localhost:4000_**

**2. Frontend:**
```
cd frontend
npm install
npm start
```
**_Runs on: http://localhost:3000_**

## Test Users
The app uses seeded users that reflect the assignment’s roles and countries.
Select any user from the login dropdown in the UI to test different permission levels.

## Project Structure
```
backend/
  server.js
  utils.js
  package.json

frontend/
  public/
    index.html
  src/
    App.js
    index.js
    style.css
  package.json
```
## Notes*
- Data is intentionally stored in memory to keep the project easy to evaluate.

- Checkout simulates payment using the signed-in user’s stored payment method.

- Country and role restrictions are enforced on the backend through middleware and route guards.

- The frontend is intentionally minimal so reviewers can quickly verify flows.

# Screenshots

1. Home Screen

<img width="1129" height="541" alt="Screenshot 2025-11-13 at 9 20 13 PM" src="https://github.com/user-attachments/assets/cb9941f6-43f6-4d37-8c95-6e52a9c8f296" />



2. Restaurant List

<img width="684" height="185" alt="Screenshot 2025-11-13 at 9 20 40 PM" src="https://github.com/user-attachments/assets/d12ef54a-217a-4812-a690-1f5fdd415201" />




3. Menu View

<img width="679" height="292" alt="Screenshot 2025-11-13 at 9 20 49 PM" src="https://github.com/user-attachments/assets/6f692859-318b-43e0-a237-9071fffc9d14" />




4. Cart & Order Creation

  **Cart**

<img width="386" height="403" alt="Screenshot 2025-11-13 at 9 21 08 PM" src="https://github.com/user-attachments/assets/c19ff308-a721-4cea-91d0-7a9f60dba392" />

  **Order Creation**
  
<img width="310" height="142" alt="Screenshot 2025-11-13 at 9 21 17 PM" src="https://github.com/user-attachments/assets/28894822-36cf-40b0-8b5e-50bf68003e5e" />



5. Order Checkout (Admin/Manager Only)

<img width="284" height="155" alt="Screenshot 2025-11-13 at 9 21 23 PM" src="https://github.com/user-attachments/assets/c3900a57-e135-4953-b043-c080e5c082f1" />


6. Visible Orders List

<img width="384" height="293" alt="Screenshot 2025-11-13 at 9 21 53 PM" src="https://github.com/user-attachments/assets/b5320cd3-0947-48e7-bc74-ecb99a3f056f" />


7. Login Options & Logged in view

<img width="433" height="246" alt="Screenshot 2025-11-13 at 9 20 20 PM" src="https://github.com/user-attachments/assets/b5babe3f-0f63-4639-ba02-09f3554c64d1" />


**Logged IN VIEW**

<img width="392" height="153" alt="Screenshot 2025-11-13 at 9 20 34 PM" src="https://github.com/user-attachments/assets/e1ca781e-442e-4013-9701-26b2b1da179f" />


7. Order Cancellation

<img width="327" height="186" alt="Screenshot 2025-11-13 at 9 21 46 PM" src="https://github.com/user-attachments/assets/5026ec2d-6e11-4b5f-a4d8-6a0b58f8d1bc" />

