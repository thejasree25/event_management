# 🎟️ Event Management System — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Frontend%20Tool-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Axios-API%20Requests-5A29E4?logo=axios&logoColor=white" alt="Axios" />
</p>

## 📌 About the Project

The Event Management System is a web application designed to provide a user-friendly interface for interacting with event-related features.

The frontend communicates with a separate Spring Boot backend to send requests, retrieve information, and display responses to users.

**Frontend repository:** [event_management](https://github.com/thejasree25/event_management)

## ✨ Key Features

- 🎫 Event browsing and event-related interfaces
- 🔐 Authentication and registration interfaces
- 📅 Event registration and booking workflows
- 👤 User-facing pages
- 🛠️ Administrative management interfaces
- 💳 Payment-related interfaces, where supported by the backend
- 📱 Responsive user interface
- 🔗 Integration with backend REST APIs

*The available features depend on the implementation in the source code and the backend APIs.*

## 🛠️ Technologies Used and Why

| Technology | Why I Used It |
|---|---|
| ⚛️ React | To build reusable UI components and manage changing interface data. |
| ⚡ Vite | To start the development server quickly and build the frontend for production. |
| 🟨 JavaScript | To implement application logic, event handling, and API interactions. |
| 🎨 Tailwind CSS | To create responsive layouts and style components efficiently using utility classes. |
| 🔀 React Router | To navigate between pages without reloading the entire application. |
| 🌐 Axios | To send HTTP requests to the Spring Boot backend and handle responses and errors. |
| 🎯 Lucide React | To display consistent icons throughout the interface. |
| 🔑 Google OAuth library | To integrate Google sign-in into the frontend where configured. |
| 📦 npm | To install and manage project dependencies. |
| 🐙 Git and GitHub | To track code changes and host the project repository. |

### 💡 Why React?

React allows the application to be divided into reusable components. For example, a navigation bar, event card, button, or form can be maintained independently and reused across multiple pages.

### 💡 Why Axios?

Axios makes it easier to communicate with the backend. The frontend can send requests, receive JSON responses, and display success or error messages based on the result.

### 💡 Why React Router?

React Router allows users to move between pages such as login, registration, event listings, and administration without performing a complete browser reload for every navigation.

## 🔄 Application Workflow

```text
👤 User
   |
   v
🌐 React Frontend
   |
   v
🧭 React Router
   |
   v
🖱️ User performs an action
   |
   v
📡 Axios sends an HTTP request
   |
   v
☕ Spring Boot Backend
   |
   v
🗄️ PostgreSQL Database
   |
   v
📨 Backend returns a response
   |
   v
🖥️ React displays the updated information
```

### Example: Loading Events

1. The user opens the events page.
2. The React component requests event information from the backend.
3. Axios sends an HTTP request to the configured API endpoint.
4. The backend retrieves the required information.
5. The backend returns a response, generally in JSON format.
6. React updates the page to display the returned events.

## 🏗️ Project Architecture

```text
event_management/
│
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages
│   ├── api/              # API service modules, if present
│   ├── assets/           # Images and other assets
│   ├── App.jsx           # Main application component, if present
│   └── main.jsx          # Application entry point
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

*Refer to the actual `src` folder for the precise structure of this repository.*

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- Git
- Running backend for API-dependent features

### 1. Clone the repository

```bash
git clone https://github.com/thejasree25/event_management.git
cd event_management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend API URL

Configure the API base URL in the existing API service or environment configuration.

For local development, the backend address is typically:

```text
http://localhost:8080
```

Use the API paths actually defined by the backend.

### 4. Start the frontend

```bash
npm run dev
```

Open the URL displayed in the terminal, usually `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔗 Frontend and Backend Communication

| Component | Responsibility |
|---|---|
| Frontend | Displays pages and collects user input. |
| Axios | Sends HTTP requests and receives responses. |
| Spring Boot | Processes requests and implements server-side logic. |
| Spring Data JPA | Handles database operations through repositories. |
| PostgreSQL | Stores application data. |

The frontend and backend are maintained in separate repositories so their development and deployment can be managed independently.

## 🎤 Interview Explanation

**Q: Explain your Event Management System frontend project.**

I developed the frontend of an Event Management System using React, JavaScript, Vite, and Tailwind CSS. The frontend provides the user interface for event-related activities and administrative pages. I use reusable React components to organize the interface, React Router for navigation, and Axios to communicate with the Spring Boot backend. The backend processes requests and works with PostgreSQL to store and retrieve data.

**Q: Why did you choose React?**

I chose React because its component-based architecture helps me reuse UI elements, organize code, and update the interface when application data changes.

**Q: How does your frontend communicate with the backend?**

The frontend sends HTTP requests using Axios. The Spring Boot backend processes those requests, interacts with the database when necessary, and returns responses that the frontend displays.

**Q: What is the difference between React and Vite?**

React is the library I use to build the user interface. Vite is the development and build tool I use to run and build the frontend application.

## 🚀 Future Improvements

- Add automated component and integration tests.
- Improve accessibility and loading states.
- Document API endpoints and response formats.
- Add screenshots and a live demo link.
- Improve production error handling.

## 👩‍💻 Author

**Thejasree Ganginepalli**

- GitHub: [thejasree25](https://github.com/thejasree25)
- Frontend repository: [event_management](https://github.com/thejasree25/event_management)

