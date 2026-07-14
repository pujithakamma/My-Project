# Farm Connect

## Description
Farm Connect is a React application that helps farmers connect directly with customers. The project now demonstrates persistent authentication, theme preferences, session-based browsing, and complete local CRUD management for farm products without any backend.

## Updated Features
- Added persistent login state with Local Storage and automatic redirect after refresh
- Implemented Light/Dark theme persistence with a global theme toggle
- Added Session Storage support for the last visited route and active filters
- Built complete CRUD for products with add, edit, delete, and instant Local Storage updates
- Added dynamic cards for product management and recent activity tracking
- Created a responsive dashboard-style product page with search, filter, and sort controls

## Storage Mechanisms
- Local Storage: user sessions, registered users, theme preference, product catalog, favorites, orders, and recent activity
- Session Storage: current search/filter state and the last visited page during the active browser session

## Learning Outcomes
- State persistence with Local Storage and Session Storage
- CRUD operations in React without a backend
- Responsive UI design and route-aware state management
- Form validation and live UI updates after data changes

## Installation

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── Components/
├── pages/
├── assets/
├── App.jsx
└── main.jsx
```

## Author

**Pujitha Kamma**