# 🏛️ CourseTracker: Architecture & Rationale

This document is a deep dive into the "why" of the CourseTracker project. It explains the reasoning behind the technology, patterns, and data structures chosen.

---

## 1. High-Level Overview

CourseTracker is a **monorepo** containing two decoupled services:
* **`client/` (Frontend):** A Single Page Application (SPA) built with **React (Vite + TS)**. It is only responsible for rendering the UI and making API calls.
* **`server/` (Backend):** A RESTful API built with **Node.js (Express + TS)**. It is responsible for all business logic, security, and database interaction.

They communicate via **JSON over HTTP/S**. The backend is **"headless"**—it doesn't care who consumes it (our React app, a mobile app, or Insomnia).

---

## 2. Backend Architecture

### Technologies

* **Node.js / Express:** Chosen for its speed (asynchronous I/O) and massive ecosystem (`npm`). `Express` is a minimalist "scaffolding" that gives us full control over middleware and routing.
* **TypeScript:** Chosen over plain JavaScript for **type-safety**. This is critical for a backend. It catches errors (`null`, `undefined`, incorrect types) **at compile-time**, not when the server crashes at 2 AM.
* **MongoDB / Mongoose:** A **NoSQL** (document-oriented) database was chosen because our hierarchical structure (Courses -> Modules -> Assignments) maps very flexibly to JSON-like BSON documents.
    * **`Mongoose`** is used as an **ODM** (Object Data Modeling) tool. It "softens" communication with MongoDB by giving us:
        1.  **Schemas:** A strict blueprint for our data (validation, `required`, `enum`).
        2.  **Middleware/Hooks (`.pre('save')`):** Allowed us to **automatically** hash passwords before saving.
        3.  **Methods (`.methods.comparePassword`):** Allowed us to attach business logic (password comparison) directly to the Model.
* **Zod:** Chosen for **incoming data validation**. `Zod` is cleaner and more modern than `joi` or `express-validator`, and it has superior TypeScript integration (automatic type inference). It is our "gatekeeper" at the API's entrance.

### Security & Data Flow Patterns

#### 1. Authentication ("Who are you?")

We use **JWT (JSON Web Tokens)**, not Sessions.

* **Why?** JWTs are **stateless**. The server doesn't need to "remember" you.
* **Analogy (Session vs. JWT):**
    * **Session (Stateful):** This is a "cloakroom ticket." You give the server your "coat" (data) and get a "ticket." The server *must* store your "coat" (in Redis or a DB).
    * **JWT (Stateless):** This is an "ID badge." The badge *contains* all your info (`userId`) and is "signed" with a secret. You carry it with you. The "bouncer" (`protect` middleware) just checks the signature and lets you in; they don't need to run to the cloakroom. This is
        ideal for scaling.

#### 2. Authorization ("What are you allowed to do?")

This is our **most critical** business logic. We cannot let User `A` see or edit User `B`'s data.

* **Implementation:** This is **not** the `protect` middleware. The `protect` middleware only "authenticates" (sets `req.user = user`).
* **Implementation:** **Inside every** sensitive controller (e.g., `getCourseById`, `updateModule`), we manually check for "ownership":
    ```typescript
    // Example from 'updateCourse'
    const course = await Course.findById(req.params.id);
    if (course.user.toString() !== req.user._id.toString()) {
      res.status(401); // 401 Unauthorized
      throw new Error('User not authorized');
    }
    ```
* **Denormalization:** We intentionally **duplicate** the `user: ObjectId` field in *all* of our models (`Course`, `Module`, `Assignment`).
    * **Why?** For **performance**. If `user` was only on `Course`, checking rights for an `Assignment` would require **3 database queries** (Assignment -> Module -> Course). Thanks to denormalization, we make **1 query** (for the Assignment) and immediately check `assignment.user`.

#### 3. Error Handling

* **`express-async-handler`:** Wraps all our `async` controllers. It catches any errors (Promise rejections) and automatically passes them to `next(error)`.
* **`error.middleware.ts`:** This is our final "catch-all" middleware. It catches **all** errors passed by `next(error)` and formats a clean JSON response (`{ message: ... }`), instead of crashing the server or sending an HTML error page.

---

## 3. Frontend Architecture

### Technologies

* **Vite:** Chosen over `Create React App` (CRA) for its **incredible speed**. It uses native ES Modules (ESM) during development, giving an "instant" server start and Hot Module Replacement (HMR).
* **React + TypeScript:** `React` is chosen for its component model (LEGO-like bricks). `TypeScript` (TSX) provides the same type-safety on the frontend as it does on the backend.
* **Tailwind CSS:** Chosen (over `CSS-in-JS` or `SASS`) as a `utility-first` framework. This allows us to build complex, "tech-style" layouts without leaving our JSX and ensures consistency (spacing, colors) across the app.
* **Axios (with Interceptors):** Chosen over `fetch` because of its **interceptors**.
    * **`api.ts`:** We created an Axios **instance** that uses a `request interceptor` to **automatically attach the `Bearer Token`** from `localStorage` to **every** outgoing request.

### State Management Patterns

#### 1. Global State (Auth) vs. Local State

* **`AuthContext + useReducer` (Global):** Chosen for **global** authentication state (`user`, `token`).
    * **Why Context?** To provide the `user` deep into the component tree (to `Navbar`, `ProtectedRoute`) without "prop drilling."
    * **Why `useReducer`?** Because our logic is complex (`LOGIN_SUCCESS`, `LOGOUT`). `useReducer` "disciplines" state changes via `dispatch({ type: ... })`.
    * **`localStorage`:** Used for **session persistence**. The `AuthContext` "hydrates" its initial state from `localStorage` on startup.
* **`useState` (Local):** Used for **local** state that doesn't need to be shared.
    * *Example:* `DashboardPage` uses `useState` for `courses` and `isLoading`. The `Navbar` doesn't need this data, so there's no point polluting the global Context with it.

#### 2. Data Fetching

* **"Request Waterfall":** We use a "smart child" pattern.
    * `CourseDetailPage` (parent) fetches its `Modules`.
    * It renders a `ModuleItem` (smart child) for each module.
    * **Each** `ModuleItem` is *itself* responsible for fetching its *own* `Assignments`. This breaks one giant "waterfall" request into many small, parallel streams.

---

## 4. Data Schema (Entity Relationship)

We are using a **Referencing** (linking) approach.

* **`User`** (1) -> "has many" -> (N) **`Course`**
* **`Course`** (1) -> "has many" -> (N) **`Module`**
* **`Module`** (1) -> "has many" -> (N) **`Assignment`**

Additionally, `User` has a direct (1 -> N) reference to `Module` and `Assignment` to allow for the denormalized authorization check.



# 🇬🇪 CourseTracker-ის არქიტექტურის განმარტება

ეს დოკუმენტი მარტივად ხსნის, თუ როგორ არის აწყობილი CourseTracker-ის პროექტი და რატომ იქნა მიღებული კონკრეტული ტექნიკური გადაწყვეტილებები.

---

## 1. ზოგადი სტრუქტურა

პროექტი არის **მონორეპოზიტორია**, რაც ნიშნავს, რომ ფრონტენდიც და ბექენდიც ერთ საცავში (repository) ცხოვრობს, თუმცა ისინი დამოუკიდებელი სერვისებია:

* **`client/` (ფრონტენდი):** ეს არის React-ის აპლიკაცია (Vite + TypeScript). მისი ერთადერთი მიზანია მომხმარებლის ინტერფეისის (UI) დახატვა და სერვერზე (API) მოთხოვნების გაგზავნა.
* **`server/` (ბექენდი):** ეს არის RESTful API (Node.js + Express + TypeScript). ის პასუხისმგებელია ლოგიკაზე, უსაფრთხოებაზე და მონაცემთა ბაზასთან კავშირზე.

ეს ორი ნაწილი ერთმანეთთან **JSON** ფორმატით საუბრობს. ბექენდი "თავის გარეშეა" (headless), ანუ მას არ აინტერესებს, ვინ ესაუბრება — ჩვენი React-ის აპლიკაცია თუ სხვა რომელიმე პროგრამა.

---

## 2. ბექენდის არქიტექტურა

### ტექნოლოგიები

* **Node.js / Express:** არჩეულია სისწრაფის (ასინქრონული მუშაობის) და უდიდესი ეკოსისტემის (`npm`) გამო.
* **TypeScript:** გვიცავს JavaScript-ის გავრცელებული შეცდომებისგან (როგორიცაა `null` ან `undefined`). კოდის წერის პროცესშივე გვეუბნება, თუ რამე არასწორად მიდის, და არა მაშინ, როცა სერვერი "ვარდება".
* **MongoDB / Mongoose:** ეს არის NoSQL (დოკუმენტური) ბაზა. ჩვენი მონაცემები (კურსი -> მოდული -> დავალება) იდეალურად ერგება MongoDB-ის JSON-ის მსგავს სტრუქტურას. `Mongoose` გვეხმარება ამ ბაზასთან სუფთად მუშაობაში.
* **Zod:** ეს არის ჩვენი "დაცვა" API-ს შემოსასვლელში. ის ამოწმებს, რომ მომხმარებლისგან მოსული მონაცემები (მაგ. რეგისტრაციისას) ზუსტად იმ ფორმატშია, რასაც ველით.

### უსაფრთხოების პატერნები

#### 1. ავთენტიკაცია (ვინ ხარ შენ?)

ჩვენ ვიყენებთ **JWT (JSON Web Tokens)** და არა სესიებს.

* **რატომ?** JWT არის **stateless** (არ ინახავს მდგომარეობას). სერვერს არ სჭირდება შენი "დამახსოვრება".
* **ანალოგია:**
    * **სესია:** ეს ჰგავს "გარდერობის ნომერს". შენ სერვერს აძლევ "პალტოს" (შენს მონაცემებს) და იღებ "ნომერს". სერვერი ვალდებულია, შენი "პალტო" სადღაც შეინახოს.
    * **JWT:** ეს ჰგავს "საშვს" ან "ბეიჯს". ამ "ბეიჯზე" უკვე წერია, ვინ ხარ შენ (`userId`) და აქვს "ხელმოწერა". შენ ამ ბეიჯს დაატარებ. "დაცვა" (ჩვენი `protect` middleware) უბრალოდ ხელმოწერას ამოწმებს და გიშვებს. მას არ სჭირდება "გარდერობში" სირბილი.

#### 2. ავტორიზაცია (რისი უფლება გაქვს?)

ეს არის ჩვენი **ყველაზე მნიშვნელოვანი** ლოგიკა: **მომხმარებელმა `A` არ უნდა შეძლოს მომხმარებელ `B`-ს მონაცემების ნახვა ან რედაქტირება.**

* **როგორ?** როდესაც ითხოვ კონკრეტულ კურსს (მაგ. `getCourseById`), ჩვენ ჯერ ვპოულობთ კურსს ბაზაში და *შემდეგ ვამოწმებთ*, ემთხვევა თუ არა ამ კურსის `user` ველი იმ მომხმარებლის `_id`-ს, ვინც ამჟამად დალოგინებულია (`req.user._id`). თუ არ ემთხვევა, ვაბრუნებთ `401 Unauthorized` შეცდომას.
* **დენორმალიზაცია:** ჩვენ განზრახ ვამატებთ `user: ObjectId`-ს *ყველა* მოდელში (`Course`, `Module`, `Assignment`). ეს გავაკეთეთ **სისწრაფისთვის**. რომ არ გვექნა, `Assignment`-ზე უფლების შესამოწმებლად დაგვჭირდებოდა ბაზაში 3 მოთხოვნა (Assignment -> Module -> Course). ახლა კი 1 მოთხოვნაც საკმარისია.

---

## 3. ფრონტენდის არქიტექტურა

### ტექნოლოგიები

* **Vite:** არჩეულია `Create React App`-ის ნაცვლად, რადგან **წამიერად** იწყებს მუშაობას და ძალიან სწრაფია დეველოპმენტისას.
* **React + TypeScript:** `React` გვაძლევს კომპონენტურ მოდელს (ვაწყობთ აპლიკაციას "ლეგოს" კუბიკებივით). `TypeScript` გვაძლევს იგივე ტიპების უსაფრთხოებას, რაც ბექენდში.
* **Tailwind CSS:** `utility-first` ფრეიმვორქი. გვაძლევს საშუალებას, დავწეროთ სტილები პირდაპირ JSX-შივე, კლასების გამოყენებით.
* **Axios (Interceptors-ით):** `fetch`-ის ნაცვლად ვიყენებთ Axios-ს, რადგან მას აქვს "გადამჭერები" (Interceptors). ჩვენ შევქმენით `api.ts` ფაილი, რომელიც **ყველა** მოთხოვნას ავტომატურად ამატებს `Bearer Token`-ს `localStorage`-დან.

### მდგომარეობის მართვა (State Management)

ჩვენ ვაბალანსებთ გლობალურ და ლოკალურ მდგომარეობას.

* **`AuthContext + useReducer` (გლობალური):** გამოიყენება მხოლოდ ავთენტიკაციის მონაცემებისთვის (`user`, `token`). Context გვჭირდება, რომ ეს მონაცემები ხელმისაწვდომი იყოს მთელ აპლიკაციაში (მაგალითად, `Navbar`-ში) "prop drilling"-ის (მონაცემების კომპონენტიდან კომპონენტში გადაწოდების) გარეშე.
* **`useState` (ლოკალური):** გამოიყენება ყველა დანარჩენი ნივთისთვის, რომელიც არ სჭირდება "გლობალურად" ყველას. მაგალითად, `DashboardPage`-ზე კურსების სიას და `isLoading` მდგომარეობას ვინახავთ ლოკალურ `useState`-ში, რადგან ეს მონაცემები სხვა გვერდებს არ სჭირდება.



