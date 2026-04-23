# 📄 Invoice Management App

A pixel-perfect, fully responsive invoice management application built with **React 19** and **Vite**. Designed to match a professional Figma specification across desktop, tablet, and mobile breakpoints with dark mode support.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS-Modules-1572B6?logo=css3&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Setup Instructions](#-setup-instructions)
- [Architecture](#-architecture)
- [Design Decisions & Trade-offs](#-design-decisions--trade-offs)
- [Accessibility Notes](#-accessibility-notes)
- [Improvements Beyond Requirements](#-improvements-beyond-requirements)
- [Responsive Breakpoints](#-responsive-breakpoints)
- [Project Structure](#-project-structure)

---

## ✨ Features

- **Dashboard** — View all invoices with ID, client name, due date, amount, and status badge
- **Filter by Status** — Multi-select custom dropdown to filter by Draft, Pending, or Paid
- **Create Invoice** — Full slide-over form with comprehensive field validation
- **Edit Invoice** — Pre-populated form for modifying existing invoices
- **Delete Invoice** — Confirmation modal with backdrop scroll-lock
- **Mark as Paid** — One-click status update from the detail page
- **Custom Date Picker** — Figma-matching calendar dropdown replacing native browser input
- **Custom Payment Terms Dropdown** — Styled dropdown with divider lines and hover states
- **Dark Mode** — Full light/dark theme toggle with CSS custom properties
- **Persistent State** — Invoice data saved to `localStorage` and survives page refresh
- **Form Validation** — All fields flagged with red borders and "can't be empty" error messages
- **Responsive Design** — Pixel-perfect layouts across desktop (1440px), tablet (768px), and mobile (375px)

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd App-Invoice-management

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start Vite dev server with HMR     |
| `npm run build`    | Production build to `dist/`        |
| `npm run preview`  | Preview the production build       |
| `npm run lint`     | Run ESLint across the codebase     |

---

## 🏗 Architecture

### Technology Stack

| Layer          | Technology              | Rationale                                           |
| -------------- | ----------------------- | --------------------------------------------------- |
| **Framework**  | React 19                | Component-based UI with hooks                       |
| **Bundler**    | Vite 8                  | Fast HMR, modern ES module dev server               |
| **Routing**    | React Router DOM 7      | Declarative client-side routing                     |
| **Styling**    | CSS Modules             | Scoped styles, zero runtime cost, no utility bloat  |
| **State**      | React Context + useState | Lightweight global state without external libraries |
| **Persistence**| localStorage            | Simple client-side data persistence                 |
| **Typography** | League Spartan (Google) | Matches Figma design specification                  |

### State Management

The app uses a **single Context Provider** (`InvoiceContext`) that manages:

```
InvoiceProvider
├── invoices[]          — Full invoice data array
├── filteredInvoices[]  — Computed list based on active filters
├── filterStatus[]      — Active status filters (multi-select)
├── isFormOpen          — Controls the slide-over drawer visibility
├── editingInvoice      — The invoice being edited (null for new)
├── openForm()          — Opens form (new or edit mode)
├── closeForm()         — Closes form and resets editing state
├── addInvoice()        — Adds new invoice and closes form
├── updateInvoice()     — Updates existing invoice by ID
├── deleteInvoice()     — Removes invoice by ID
├── markAsPaid()        — Sets invoice status to 'paid'
└── toggleFilter()      — Toggles a status in the filter array
```

Data flows **unidirectionally**: Context → Components → User Actions → Context updates → Re-render.

### Component Architecture

```
App.jsx
├── Sidebar                    — Logo, theme toggle, avatar
├── Routes
│   ├── InvoiceList            — Dashboard page
│   │   ├── DashboardHeader    — Title, count, filter dropdown, "New Invoice" button
│   │   └── InvoiceCard[]      — Individual invoice row (CSS Grid layout)
│   └── InvoiceDetail          — Single invoice view
│       ├── StatusBadge        — Color-coded status indicator
│       └── DeleteModal        — Confirmation dialog with backdrop
└── InvoiceForm                — Slide-over drawer (global, mounted at App level)
    ├── DatePicker             — Custom calendar dropdown
    └── Item rows              — Dynamic add/remove with auto-calculated totals
```

### Styling Architecture

All component styles use **CSS Modules** (`.module.css`) for scoping. Global tokens are defined in `styles/variables.css` with CSS custom properties:

- **Light/Dark themes** swap via the `[data-theme='dark']` attribute on `<html>`
- **Design tokens** include: colors, typography, shadows, and layout dimensions
- **No utility frameworks** — every style is hand-authored to match Figma coordinates

---

## ⚖️ Design Decisions & Trade-offs

### 1. CSS Grid vs. Flexbox for Invoice Cards

**Decision:** CSS Grid with fixed column widths (`87px 140px minmax(0,1fr) auto auto`).

**Why:** Flexbox caused content overflow when status badges or large amounts competed for space. Grid guarantees column alignment across all rows regardless of content length. The `minmax(0, 1fr)` pattern allows the name column to shrink gracefully while fixed columns hold steady.

### 2. Custom Dropdowns vs. Native `<select>`

**Decision:** Replaced native `<select>` for Payment Terms and native `<input type="date">` for Invoice Date with fully custom components.

**Why:** Native form controls are impossible to style consistently across browsers. The Figma design specifies exact dropdown dimensions (192px × 128px for terms, 240px × 243px for calendar), divider styles, hover colors, and shadow values that cannot be achieved with native elements.

**Trade-off:** Custom dropdowns require manual keyboard navigation and ARIA attributes. The current implementation handles mouse/touch interaction well but could be enhanced with full keyboard support (arrow keys, Enter, Escape).

### 3. Context API vs. External State Library (Redux/Zustand)

**Decision:** React Context with `useState`.

**Why:** The app has a flat data model (a single array of invoices) with straightforward CRUD operations. Context API avoids adding dependencies and build complexity. For this scale (~7 invoice records, single-user), performance is not a concern.

**Trade-off:** If the app scaled to hundreds of invoices or real-time collaboration, a dedicated state library with selectors (Zustand) or normalized data (Redux Toolkit) would be warranted.

### 4. localStorage vs. Backend API

**Decision:** `localStorage` for data persistence.

**Why:** This is a front-end challenge focused on UI fidelity. localStorage provides instant persistence without server setup, lets the app work fully offline, and simplifies the development workflow.

**Trade-off:** No multi-device sync, 5MB storage limit, and data loss on cache clear.

### 5. CSS Modules vs. Tailwind CSS

**Decision:** Vanilla CSS Modules.

**Why:** The Figma design uses precise pixel values, custom shadows, and specific color codes. CSS Modules give direct control over every property without fighting utility class abstractions. Each component's styles are co-located and scoped automatically.

**Trade-off:** More CSS to write manually, but the result is leaner bundle size and zero runtime overhead.

---

## ♿ Accessibility Notes

### Current Implementation

- **Semantic HTML** — Proper use of `<header>`, `<main>`, `<section>`, `<form>`, `<label>`, and `<button>` elements
- **Form Labels** — Every input field has an associated `<label>` element
- **Color Contrast** — Status badges (Draft, Pending, Paid) use sufficient contrast ratios against their backgrounds
- **Focus States** — All interactive inputs show a visible purple (`#7C5DFA`) border on focus
- **Error States** — Validation errors use red (`#EC5757`) for both border color and error text, providing dual visual indicators
- **Button States** — Hover effects on all buttons provide visual feedback
- **Keyboard Navigation** — All buttons and form inputs are natively focusable and operable via keyboard
- **Modal Trap** — Delete modal overlay prevents interaction with background content

### Areas for Future Enhancement

- **ARIA Labels** — Add `aria-label` to icon-only buttons (delete, theme toggle)
- **Dropdown Accessibility** — Add `role="listbox"`, `aria-expanded`, and arrow key navigation to custom dropdowns
- **Skip Navigation** — Add a skip-to-content link for screen reader users
- **Reduced Motion** — Wrap animations in `@media (prefers-reduced-motion: reduce)` queries
- **Screen Reader Announcements** — Use `aria-live` regions for dynamic content changes (invoice added/deleted)

---

## 🚀 Improvements Beyond Requirements

### 1. Custom Calendar Date Picker
Built a fully custom calendar component (`DatePicker.jsx`) with month navigation, selected-date highlighting in purple, and adjacent-month days at 8% opacity — all matching the Figma specification exactly.

### 2. Multi-Select Status Filter
The filter dropdown supports selecting **multiple statuses simultaneously** (e.g., show both "Pending" and "Draft"), rather than a single-select approach.

### 3. Form Validation with Field-Level Errors
Every field is validated on submit with:
- Red border (`#EC5757`) on empty inputs
- "can't be empty" text aligned to the right of each label
- Summary error messages at the bottom of the item list
- Validation is **skipped for "Save as Draft"** to allow incomplete invoices

### 4. Dark Mode with Smooth Transitions
Full dark theme implementation using CSS custom properties with `0.3s ease` transitions on background and text colors, ensuring no visual jarring when toggling.

### 5. Data Persistence
Invoices are automatically saved to `localStorage` on every state change, so data survives page refreshes and browser restarts.

### 6. Dynamic Item Management
The item list supports:
- Adding unlimited items with `+ Add New Item`
- Auto-calculation of line totals (`Qty × Price`)
- Individual item deletion with trash icon
- Per-item validation on name, quantity, and price

### 7. Responsive CSS Grid for Invoice Cards
Used `minmax(0, 1fr)` grid patterns to ensure large monetary amounts (millions) never overflow into adjacent columns on any viewport.

### 8. Delete Modal with Scroll Lock
The confirmation modal properly prevents background page scrolling when active.

---

## 📱 Responsive Breakpoints

| Breakpoint       | Width        | Sidebar              | Container     |
| ---------------- | ------------ | --------------------- | ------------- |
| **Desktop**      | ≥ 1025px     | Vertical (103px wide) | 730px max     |
| **Tablet**       | 768–1024px   | Horizontal (80px tall)| 672px max     |
| **Mobile**       | ≤ 767px      | Horizontal (72px tall)| Full width    |

---

## 📂 Project Structure

```
src/
├── assets/                     # SVG icons and images
│   ├── icon-arrow-down.svg
│   ├── icon-arrow-left.svg
│   ├── icon-arrow-right.svg
│   ├── icon-calender.svg
│   ├── icon-delete.svg
│   ├── icon-moon.svg
│   ├── icon-plus.svg
│   ├── icon-sun.svg
│   ├── illustration-empty.svg
│   ├── image-avatar.jpg
│   └── logo.svg
├── components/
│   ├── invoice/
│   │   ├── DashboardHeader.jsx       # Title, filter dropdown, new invoice button
│   │   ├── DashboardHeader.module.css
│   │   ├── DatePicker.jsx            # Custom calendar date picker
│   │   ├── DatePicker.module.css
│   │   ├── DeleteModal.jsx           # Confirmation dialog
│   │   ├── DeleteModal.module.css
│   │   ├── InvoiceCard.jsx           # Single invoice row on dashboard
│   │   ├── InvoiceCard.module.css
│   │   ├── InvoiceForm.jsx           # Slide-over create/edit form
│   │   ├── InvoiceForm.module.css
│   │   ├── StatusBadge.jsx           # Color-coded status indicator
│   │   └── StatusBadge.module.css
│   ├── layout/
│   │   ├── Sidebar.jsx               # App sidebar with logo, toggle, avatar
│   │   └── Sidebar.module.css
│   └── shared/                       # Reusable shared components
├── context/
│   └── InvoiceContext.jsx            # Global state provider
├── hooks/                            # Custom React hooks
├── pages/
│   ├── InvoiceDetail.jsx             # Single invoice detail view
│   ├── InvoiceDetail.module.css
│   ├── InvoiceList.jsx               # Dashboard/list view
│   └── InvoiceList.module.css
├── styles/
│   └── variables.css                 # Design tokens (colors, fonts, shadows)
├── utils/
│   └── mockData.js                   # Sample invoice data
├── App.jsx                           # Root component with routing
├── index.css                         # Global styles and responsive layout
└── main.jsx                          # React DOM entry point
```

---



