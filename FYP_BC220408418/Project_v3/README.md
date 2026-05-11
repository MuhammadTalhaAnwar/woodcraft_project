# 🪵 The Woodcraft – Final Project

"The Woodcraft," a full-stack MERN application designed to manage a woodworking business. This system handles orders, tracks inventory, manages employees, and auto-generates invoices. 

Below, you will find everything you need to know to easily set up, run, and evaluate our project on your local machine.

## The Tech Stack We Used
* **Frontend:** React.js (Vite), Tailwind CSS, Context API (for state management)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM
* **Security:** JWT (JSON Web Tokens) for authentication, bcrypt.js for password hashing


## 🚀 How to Run the Project Locally

### 1. Prerequisites
To evaluate this project, please ensure you have the following installed and running on your system:
* **Node.js**
* **MongoDB** (Running locally on the default port `27017`)

### 2. Install Packages
install the dependencies for both the backend and frontend folders:
```bash
# In the backend folder:
cd backend
npm install

# In the frontend folder:
cd ../frontend
npm install
```

### 3. Environment Variables
In the `backend` folder, please ensure there is a `.env` file with the following exact keys (we have included this in our submission for your convenience):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/woodcraft
JWT_SECRET=supersecretwoodcraftkey
```


**For a Full Evaluation Demo:**
Please run the following command in the `backend` folder. This runs `dummySeeder.js`, clears any existing database, and sets up a complete test environment including an Admin, Employees, Materials, Customers, and Orders.
```bash
npm run seed:dummy
```

* **Admin Login:** `admin@woodcraft.com` | `password123`
* **Employee Login:** `ahmed@woodcraft.com` | `password123`


### 5. Start the Servers
To run the application, please open two terminal sessions simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
After starting both servers, simply open your web browser and navigate to `http://localhost:5173` to view the application.
