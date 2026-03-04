# Enterprise Expense Tracker

A full-featured expense management system for teams and organizations — built with React and Vite.

---

## Screenshots

| Dashboard | Expenses | Analytics | Approvals |
|:---:|:---:|:---:|:---:|
| <img src="docs/screenshots/dashboard.png" width="200" /> | <img src="docs/screenshots/expenses.png" width="200" /> | <img src="docs/screenshots/analytics.png" width="200" /> | <img src="docs/screenshots/approval.png" width="200" /> |

---

## Tech Stack

| | |
|---|---|
| React 18 + Vite 5 | Frontend framework & build tool |
| Tailwind CSS | Styling |
| Context API | State management |
| Axios | HTTP client |

---

## Features

**Expense Management** — Create, edit, delete expenses with category tagging, status tracking, and bulk operations.

**Approval Workflow** — Multi-level approval process with history, manager dashboard, and advanced filtering.

**Analytics** — Interactive dashboard with trend analysis, category breakdowns, and visual insights.

**Invoice Management** — Generate and manage invoices with professional templates.

**User Management** — Role-based access control, user profiles, and activity tracking.

**Audit & Compliance** — Full audit log with filtering and compliance reporting.

**Notifications** — Real-time in-app and email notifications.

---

## Getting Started

**Prerequisites:** Node.js 16+

```bash
git clone https://github.com/sagarboyal/enterprise-expense-tracker-ui.git
cd enterprise-expense-tracker-ui
npm install
```

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Expense Management System
```

```bash
npm run dev        # Development server → http://localhost:5173
npm run build      # Production build → /dist
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## Project Structure

```
src/
├── components/    → Feature-based UI (expenses, approval, analytics, auth, users, invoice, audit)
├── services/      → Centralized API calls (api.js)
├── store/         → Global state via Context API
├── assets/        → Static files
├── App.jsx        → Root component
└── index.css      → Global styles
```

---

## Expense Workflow

1. User submits an expense
2. Manager reviews via approval dashboard
3. Expense is approved or rejected
4. User receives notification
5. Approved expenses feed into analytics and invoices

---

## Roadmap

- [ ] Export reports (PDF / Excel)
- [ ] Mobile responsive improvements
- [ ] Dark mode
- [ ] Multi-currency support

---

## Contact

- Email: sagarboyal.024@gmail.com
- Issues: [GitHub Issues](https://github.com/sagarboyal/enterprise-expense-tracker-ui/issues)

---

## License

[MIT](LICENSE)
