# MERN Comment System

A **full-stack comment system** built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)** and **TypeScript**, featuring **JWT authentication**, **real-time updates**, and a **responsive, modular front-end**.

This project allows authenticated users to **view, post, like, dislike, and reply to comments**, with **pagination**, **sorting**, and **authorization validation**.

---

## **Features Implemented**

### Front-end
- React.js + TypeScript for a modern, responsive UI
- State management with **React Context API**
- React Router for navigation
- Auth-protected routes (only logged-in users can comment)
- Like/dislike functionality (one per user)
- Sorting by newest, most liked, and most disliked
- Pagination for long comment lists
- Responsive design using **Tailwind CSS**
- Component-based architecture for scalability
- Optional: Reply to comments supported

### Back-end
- Node.js + Express.js RESTful API
- MongoDB database for users and comments
- JWT authentication and authorization
- Middleware for validation and security
- Sorting and pagination implemented in API
- Optional: Real-time updates using **WebSockets**

---

## **Project Structure**

```
src/
├─ api/                # Axios config and API calls
├─ features/
│   ├─ auth/           # AuthContext, login/register pages
│   └─ comments/       # CommentContext, components, pages
├─ routes/             # App routes and protected routing
├─ shared/             # Layout and shared components
├─ utils/              # WebSocket client
├─ App.tsx
├─ main.tsx
└─ index.css           # Tailwind CSS
```

---

## **Technologies Used**

- **Frontend:** React, TypeScript, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, JWT
- **State Management:** React Context API
- **Realtime:** Socket.io (optional)
- **Tooling:** Vite, ESLint, Prettier

---

## **Installation**

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

4. Start the front-end:

```bash
npm run dev
```

5. Start the back-end (in a separate terminal):

```bash
npm run start:server
```

---

## **Usage**

1. Open the app in a browser (`http://localhost:5173`)
2. Register a new account or log in
3. Add, like, dislike, or reply to comments
4. Sort comments by newest, most liked, or most disliked
5. Pagination will automatically load more comments
6. Real-time updates (if Socket.io enabled)

---

## **Security & Best Practices**

- JWT authentication to protect routes
- Only authorized users can edit/delete their own comments
- Input validation on front-end and back-end
- Environment variables stored in `.env` (do not commit secrets)

---

## **Author**

**Mizanur Rahman**
- GitHub: [your-github](#)
- LinkedIn: [your-linkedin](#)

---

## **License**

This project is licensed under the **MIT License**.

