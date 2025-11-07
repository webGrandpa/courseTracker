# 🚀 CourseTracker - Full-Stack MERN Application

CourseTracker is a comprehensive full-stack web application built from scratch to help users manage their educational courses, modules, and assignments.

This project showcases a modern MERN stack (MongoDB, Express, React, Node.js) with a focus on a secure, scalable, and well-tested backend API and a responsive, reactive frontend.

## 🌟 Core Features

* **Secure JWT Authentication:** Full registration, login, and logout cycle.
* **Route Protection:** Private routes on the backend (Auth Middleware) and frontend (ProtectedRoute) to secure data.
* **Hierarchical CRUD Logic:** Full CRUD operations for 3 nested data levels (Courses -> Modules -> Assignments).
* **Data Ownership Validation:** The API enforces strict authorization: users can only view or modify data that they own.
* **Cascade Deletion:** Deleting a "parent" (e.g., a `Course`) automatically deletes all "children" (`Modules`, `Assignments`), preventing orphaned data.
* **Automated Testing:**
    * **Backend:** Unit and integration tests with `Jest` and `Supertest` (including a separate test database).
    * **Frontend:** Component unit tests with `Vitest` and `React Testing Library`, including mocking hooks and services.

---

## 🛠 Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, React Router v6 |
| **Styling (UI)** | Tailwind CSS, React Hook Form |
| **State Management (UI)** | React Context + useReducer (for Auth) |
| **Backend** | Node.js, Express, TypeScript, ts-node-dev |
| **Database** | MongoDB (with Mongoose) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **API Validation** | Zod |
| **Testing (Backend)** | Jest, Supertest, cross-env |
| **Testing (Frontend)**| Vitest, React Testing Library (RTL), jsdom |
| **HTTP Client** | Axios (with Interceptors to attach tokens) |

---

## 📂 Project Structure

The project uses a **monorepo** structure with two primary packages: `server` and `client`.

```
/course-tracker
├── /client           (Frontend - Vite, React, TS, Tailwind)
│   ├── /src
│   │   ├── /components (Reusable UI components: Modal, Navbar...)
│   │   ├── /context    (AuthContext - The "brain" of authentication)
│   │   ├── /pages      (Page assemblies: LoginPage, DashboardPage...)
│   │   ├── /services   (API services: api.ts, authService, courseService...)
│   │   ├── App.tsx     (Main routing)
│   │   └── main.tsx    (React entry point)
│   └── package.json
│
├── /server           (Backend - Node.js, Express, TS)
│   ├── /src
│   │   ├── /tests      (Jest/Supertest tests)
│   │   ├── /controllers
│   │   ├── /middleware (protect.ts, errorHandler.ts...)
│   │   ├── /models     (Mongoose schemas: user, course...)
│   │   ├── /routes     (API routes)
│   │   ├── /validation (Zod schemas)
│   │   ├── app.ts      (Express App creation)
│   │   └── index.ts    (Server start & DB connection)
│   └── package.json
│
└── README.md         (This file)
```
---

## 🏁 Getting Started

You will need **two** separate terminals running to start the project.

### Prerequisites
* [Node.js](https://nodejs.org/) (v22+ recommended via `nvm`)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or a local MongoDB installation)
* `npm`

---

### 1. Backend Setup (Server)

**In Terminal 1:**

1.  **Navigate to the server directory:**
    ```bash
    cd course-tracker/server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    In the `server/` folder, create a file named `.env` and copy the contents of `server/.env.example` (if it exists) or use this template:

    ```.env
    # Server Port
    PORT=5001
    
    # JWT Secret (any long random string)
    JWT_SECRET=my_super_secret_key_123456
    
    # Connection string for "Production" DB
    MONGO_URI=mongodb+srv://<USER>:<PASS>@.../CourseTracker?retryWrites=true&w=majority
    
    # Connection string for "Test" DB (for 'npm test')
    MONGO_URI_TEST=mongodb+srv://<USER>:<PASS>@.../CourseTrackerTEST?retryWrites=true&w=majority
    ```
    (Replace `<USER>` and `<PASS>` with your own MongoDB Atlas credentials).

4.  **Start the server:**
    ```bash
    npm run dev
    ```
    *The server will be running on `http://localhost:5001`.*

---

### 2. Frontend Setup (Client)

**In Terminal 2:**

1.  **Navigate to the client directory:**
    ```bash
    # (From the root course-tracker folder)
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
    *The application will be available at `http://localhost:5173`.*

---

## 🧪 Running Tests

1.  **Backend (Jest/Supertest):**
    ```bash
    # (In the server/ terminal)
    npm test
    ```
2.  **Frontend (Vitest/RTL):**
    ```bash
    # (In the client/ terminal)
    npm test
    ```


    # პროექტის განმარტება: CourseTracker

ეს დოკუმენტი მარტივ ენაზე ხსნის, თუ რას წარმოადგენს `CourseTracker` პროექტი, რომელიც აღწერილია თქვენს `README.md` ფაილში.

## 🚀 რა არის CourseTracker?

ეს არის სრული (full-stack) ვებ-აპლიკაცია, რომელიც დაწერილია MERN სტეკის (MongoDB, Express, React, Node.js) გამოყენებით.

მისი მთავარი მიზანია დაეხმაროს მომხმარებლებს, მართონ თავიანთი ონლაინ კურსები, კურსების მოდულები და დავალებები. მარტივად რომ ვთქვათ, ეს არის პირადი "органайзерი" სწავლის პროცესისთვის.

## 🌟 ძირითადი მახასიათებლები (რისი გაკეთება შეუძლია)

* **უსაფრთხო ავთენტიფიკაცია (JWT):** მომხმარებლებს შეუძლიათ რეგისტრაცია, სისტემაში შესვლა (ლოგინი) და გამოსვლა. სისტემა იყენებს JWT ტოკენებს იმის დასადასტურებლად, რომ მომხმარებელი ნამდვილად ისაა, ვინც ამბობს.
* **დაცული მარშრუტები (Protected Routes):** მომხმარებელი ვერ შეძლებს წვდომას პირად პანელზე (Dashboard), თუ ის სისტემაში შესული არ არის. ეს დაცვა მუშაობს როგორც ფრონტენდზე (React), ისე ბექენდზე (Express API).
* **იერარქიული CRUD ლოგიკა:** "CRUD" ნიშნავს (Create, Read, Update, Delete) - ანუ შექმნა, წაკითხვა, განახლება, წაშლა. ამ პროექტს შეუძლია ამ ოპერაციების შესრულება 3 დონეზე:
    1.  მომხმარებელს შეუძლია შექმნას **კურსი** (Course).
    2.  ამ კურსს დაამატოს **მოდულები** (Modules).
    3.  ამ მოდულებს დაამატოს **დავალებები** (Assignments).
* **მონაცემთა ფლობის დადასტურება:** ეს ძალიან მნიშვნელოვანი ფუნქციაა. API მკაცრად ამოწმებს, რომ მომხმარებელმა A-მ ვერასდროს ნახოს ან შეცვალოს მომხმარებელ B-ს კურსები. თითოეული მომხმარებელი ხედავს **მხოლოდ** საკუთარ მონაცემებს.
* **კასკადური წაშლა:** თუ მომხმარებელი წაშლის "მშობელ" ელემენტს (მაგალითად, მთლიანად კურსს), სისტემა ავტომატურად წაშლის მასთან დაკავშირებულ ყველა "შვილ" ელემენტს (ყველა მოდულს და დავალებას, რომელიც ამ კურსს ეკუთვნოდა). ეს მონაცემთა ბაზას "დაობლებული" მონაცემებისგან იცავს.
* **ავტომატური ტესტირება:** პროექტი დაფარულია ტესტებით, რათა დარწმუნდეთ, რომ კოდი სწორად მუშაობს.

## 🛠 გამოყენებული ტექნოლოგიები (ტექ-სტეკი)

* **Frontend (რასაც მომხმარებელი ხედავს):** React, TypeScript, Vite, React Router, Tailwind CSS.
* **Backend (რაც სერვერზე მუშაობს):** Node.js, Express, TypeScript.
* **მონაცემთა ბაზა:** MongoDB (Mongoose-ის გამოყენებით).
* **ავთენტიფიკაცია და ვალიდაცია:** JWT (ტოკენები), bcrypt (პაროლების დაშიფვრა), Zod (მონაცემთა ვალიდაცია).
* **ტესტირება:** Jest და Supertest (ბექენდისთვის), Vitest და React Testing Library (ფრონტენდისთვის).

## 📂 პროექტის სტრუქტურა

პროექტი იყენებს "მონორეპოზიტივის" სტრუქტურას. ეს ნიშნავს, რომ ერთ მთავარ საქაღალდეში (`course-tracker`) მოთავსებულია ორი დამოუკიდებელი პროექტი:

1.  `client`: ეს არის ფრონტენდის (React) აპლიკაცია.
2.  `server`: ეს არის ბექენდის (Node.js/Express) API.

## 🏁 როგორ გავუშვათ პროექტი?

პროექტის ლოკალურად გასაშვებად დაგჭირდებათ **ორი ტერმინალის** (ბრძანებების ფანჯრის) ერთდროულად გახსნა.

**ტერმინალი 1 (ბექენდისთვის):**
1.  შედიხართ `server` საქაღალდეში.
2.  წერთ `npm install` (რომ ჩამოტვირთოს საჭირო პაკეტები).
3.  ქმნით `.env` ფაილს, სადაც წერთ მონაცემთა ბაზის (MongoDB) მისამართს და საიდუმლო JWT გასაღებს.
4.  უშვებთ სერვერს ბრძანებით: `npm run dev`.

**ტერმინალი 2 (ფრონტენდისთვის):**
1.  შედიხართ `client` საქაღალდეში.
2.  წერთ `npm install`.
3.  უშვებთ React-ის აპლიკაციას ბრძანებით: `npm run dev`.

ამის შემდეგ, აპლიკაცია გაიხსნება ბრაუზერში.

## 🧪 ტესტების გაშვება

ტესტების გასაშვებადაც ცალ-ცალკე უნდა შეხვიდეთ `server` და `client` საქაღალდეებში და თითოეულში გაუშვათ ბრძანება `npm test`.