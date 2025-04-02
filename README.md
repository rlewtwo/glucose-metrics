# 🧪 Glucose Metric Calculator

This project is a full-stack application for calculating and displaying glucose metrics for members, built as part of a take-home assignment. The goal is to help health coaches better understand a member’s glucose trends using data from continuous glucose monitors (CGMs).

---

## 🏗 Tech Stack

- **Language**: TypeScript
- **Backend**: Node.js with Express
- **Database**: SQLite (via Sequelize ORM)
- **API Docs**: Swagger (OpenAPI)
- **Testing**: Jest + Supertest

---

## 🚀 Features

- Calculates **average glucose**, **time above range**, and **time below range**
- Supports two timeframes:
  - **Last 7 days**
  - **Current calendar month**
- Calculates **delta** between current and prior period for each metric
- Exposes a RESTful API endpoint to fetch metrics
- Swagger UI for interactive API documentation
- Caches results in-memory for improved performance

---

## 📁 Project Structure

├── data/ # CSV seed data ├── src/ │ ├── models/ # Sequelize models │ ├── routes/ # Express route handlers │ ├── services/ # Metric calculation logic │ ├── seed/ # DB seeding script │ ├── swagger.ts # Swagger setup │ ├── app.ts # App entry point │ ├── metricsCalculator.test.ts # Unit tests ├── README.md

---

## 📊 API Usage

### Endpoint

```http
GET /api/metrics/:memberId
Example Response
json
Copy
Edit
{
  "last7Days": {
    "averageGlucose": 134.74,
    "timeAboveRange": 15.28,
    "timeBelowRange": 4.86,
    "deltas": {
      "avgDelta": -5.5,
      "aboveDelta": 2.8,
      "belowDelta": -1.3
    }
  },
  "currentMonth": {
    "averageGlucose": 140.24,
    "timeAboveRange": 12.48,
    "timeBelowRange": 3.56,
    "deltas": {
      "avgDelta": 6.3,
      "aboveDelta": 1.9,
      "belowDelta": -0.6
    }
  }
}

```
# Running Locally

# Install dependencies
npm install

# Seed the database with data/glucose.csv
npm run seed

# Start the server
npm run dev
Swagger UI: http://localhost:3000/api-docs

API Endpoint: http://localhost:3000/api/metrics/1

<img width="1600" alt="Screenshot 2025-04-02 at 10 41 04 AM" src="https://github.com/user-attachments/assets/b02a085a-f94c-4f5a-bd8d-2901c7e9ffe4" />

# Tests

npm test
Tests ensure correctness of the metric calculations using synthetic data.

<img width="1018" alt="Screenshot 2025-04-02 at 10 41 44 AM" src="https://github.com/user-attachments/assets/e863468f-ae13-447e-a78a-6d768defeead" />

# Assumptions
Only one member was seeded (id = 1) for simplicity.

Dates in the CSV are normalized to UTC based on the tzOffset.

"Last 7 days" includes today + 6 previous days (rolling window).

If there are no values in a time range, metrics default to 0.

# Improvements with More Time
Add authentication and user roles

Extend support for multiple members and user dashboards

Add data visualization (charts) to show trends

Use Redis or a persistent cache

Add more robust timezone handling via luxon or moment-timezone

Paginate glucose data for raw data access

# AI Usage Summary

Debug Sequelize undefined id errors

Generate unit test scaffolding for metric calculation


# Submission
This project was submitted as part of the Omada Health Senior Software Engineer take-home exercise.
