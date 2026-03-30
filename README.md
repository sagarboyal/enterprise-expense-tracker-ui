# Expense Management Monorepo

This repository is now structured to hold both the web application and the future React Native mobile application in one place.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React%20Native](https://img.shields.io/badge/React%20Native-planned-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)

## Repository Layout

```text
apps/
  web/       Current React + Vite web UI
  mobile/    Future React Native app
docs/
  screenshots/
```

## Current Apps

### Web

The existing expense management UI now lives in `apps/web`.

Run it from the repository root:

```bash
npm run dev:web
```

Or run it directly inside the app:

```bash
cd apps/web
npm install
npm run dev
```

### Mobile

`apps/mobile` is reserved for the React Native app.

## Workspace Scripts

From the repo root:

```bash
npm run dev:web
npm run build:web
npm run lint:web
```

## Web App Features

- Authentication and authorization
- Expense creation and tracking
- Approval workflow
- Analytics dashboard
- Invoice management
- User management
- Audit logs and notifications

## Screenshots

| Main Dashboard | Expense Management | Analytics | Approval Workflow |
|:---:|:---:|:---:|:---:|
| <img src="docs/screenshots/dashboard.png" width="200" alt="Dashboard" /> | <img src="docs/screenshots/expenses.png" width="200" alt="Expenses" /> | <img src="docs/screenshots/analytics.png" width="200" alt="Analytics Dashboard" /> | <img src="docs/screenshots/approval.png" width="200" alt="Approval Workflow" /> |