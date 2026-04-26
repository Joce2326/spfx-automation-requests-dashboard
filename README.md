# SPFx Automation Requests Dashboard

SharePoint Framework (SPFx) dashboard for managing automation requests stored in a SharePoint list, built with React, TypeScript, Fluent UI v9 and PnPjs.

![version](https://img.shields.io/badge/SPFx-1.22.2-green.svg)
![React](https://img.shields.io/badge/React-TypeScript-blue.svg)
![FluentUI](https://img.shields.io/badge/FluentUI-v9-teal.svg)

---

## Overview

This project provides a modern SharePoint dashboard to help teams submit, track and manage business automation requests.

Features include:

- Create, Edit and Delete Requests (CRUD)
- Search Requests
- Filter by Department, Priority and Status
- KPI Summary Cards
- Status Tabs
- Request Detail View
- Dynamic SharePoint List Configuration (Property Pane)
- Responsive card layout

---

## Screenshots

### Dashboard Overview

![Dashboard Overview](./screenshots/dashboard-overview.png)

---

### Filters and KPI Cards

![Filters and KPIs](./screenshots/filters-kpis.png)

---

### Create / Edit Request Form

![Request Form](./screenshots/request-form.png)

---

## Tech Stack

- SharePoint Framework 1.22.2
- React
- TypeScript
- Fluent UI v9
- PnPjs

---

## SharePoint List Structure

Create a SharePoint list named:

```text
Automation Requests
```

Required columns:

| Column Name       | Type |
|------------------|------|
| Title             | Single line text |
| Department        | Choice |
| RequestType       | Choice |
| Priority          | Choice |
| Description       | Multiple lines |
| ExpectedBenefit   | Multiple lines |
| Status            | Choice |

Suggested Status values:

```text
New
Pending Approval
Approved
Rejected
```

---

## Features

### Request Management

- Submit new requests
- Edit requests
- Delete requests with confirmation

### Filtering

- Department filter
- Priority filter
- Status tabs
- Search by title or keywords
- Clear all filters

### Dashboard Metrics

KPI cards display:

- Total Requests
- High Priority
- Medium Priority
- Low Priority

---

## Project Structure

```text
src/
 ├── components/
 │   ├── AutomationRequestsDashboard.tsx
 │   ├── NewRequestPanel.tsx
 │   └── INewRequestPanelProps.ts
 │
 ├── services/
 │   └── SharePointService.ts
 │
 ├── models/
 │   ├── IRequestItem.ts
 │   └── IRequestCreate.ts
```

---

## Setup

Clone the repository:

```bash
git clone https://github.com/Joce2326/spfx-automation-requests-dashboard.git
cd spfx-automation-requests-dashboard
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
heft start
```

Open the hosted SharePoint workbench:

```text
https://yourtenant.sharepoint.com/_layouts/15/workbench.aspx
```

---

## Future Enhancements

Planned improvements:

- Power Automate approval integration
- Microsoft Graph user profile integration
- AI request classification
- Dashboard analytics charts

---

## GitHub Topics

Suggested repository topics:

```text
sharepoint
spfx
react
typescript
fluentui
pnpjs
microsoft365
powerplatform
```

---

## Author

Jocelyn Zavala Fara

Microsoft 365 / SharePoint / Power Platform Specialist
