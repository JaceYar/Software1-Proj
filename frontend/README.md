# Frontend (React + Vite)

Modernized hotel frontend supporting:
1. Guest Registration & Authentication
2. Make Reservation
3. Process Check-In (Clerk/Admin)

## Run locally

```bash
bun install
bun run dev
```

Frontend runs at `http://localhost:5173`.

By default, API calls use `/api` and Vite proxies to `http://localhost:8080`.
You can override with:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Revamped navigation

Top-level routes are defined in `src/App.jsx` and links in `src/components/Navbar.jsx`.

- Public: `/rooms`, `/login`, `/register`
- Guest only: `/reservations` (My Stay), `/store`
- Clerk/Admin: `/clerk` (Clerk Portal)
- Admin only: `/admin`

Default `/` redirect:
- unauthenticated and GUEST -> `/rooms`
- CLERK -> `/clerk`
- ADMIN -> `/admin`

## Use-case behavior

### 1) Guest Registration & Authentication
- Register page: `src/pages/RegisterPage.jsx`
  - Validates email format, password length (>=8), card number (13-19 digits), and expiry (`MM/YY`)
  - On success, stores token, sets authenticated user, and redirects to `/rooms`
- Login page: `src/pages/LoginPage.jsx`
  - On success redirects by role: ADMIN `/admin`, CLERK `/clerk`, otherwise `/rooms`
- Auth state: `src/context/AuthContext.jsx`
  - Token stored in `localStorage`
  - `getCurrentUser` restores session when token exists
  - `ProtectedRoute` enforces route access by role

### 2) Make Reservation
- Main flow: `src/pages/RoomsPage.jsx`
  1. Search availability by check-in/check-out dates
  2. Filter by theme (floor), bed type, smoking
  3. Select room and rate type
  4. Confirm reservation
- If user is not logged in, confirmation redirects to `/login`
- Success and error feedback is shown via `StatusMessage`

### 3) Process Check-In
- Clerk dashboard: `src/pages/ClerkDashboard.jsx` (roles: CLERK, ADMIN)
  1. Find reservation (query/status/arrival date filters)
  2. Verify and select reservation
  3. Complete check-in (CONFIRMED reservations only)
  4. Process check-out for CHECKED_IN reservations
  5. Add room inventory entries from the same dashboard

## Useful scripts

```bash
bun run dev
bun run build
bun run lint
bun run preview
```
