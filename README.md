 Employee Task Tracker

A production-ready Full Stack Web Application designed for corporate task management and employee performance tracking. Built with a scalable Monorepo architecture.

🚀 Live Deployment

Component

Status

URL

Frontend (App)

🟢 Online

Visit Live App

Backend (API)

🟢 Online

API Endpoint

⚠️ Performance Note: The backend is hosted on a free-tier Render instance. It may take 15–30 seconds to "wake up" upon the first request. Please allow a moment for the server to spin up; subsequent requests will be instantaneous.

📸 Application Screenshots

Executive Dashboard

Task Management Board





Real-time metrics & KPIs

Drag-and-drop style status updates

✨ Key Features

📊 1. Executive Dashboard

Real-Time Analytics: Live counters for Total, Completed, and Pending tasks.

Visual Insights: Color-coded status cards for immediate performance assessment.

👥 2. Advanced Employee Directory

Centralized Management: CRUD operations for employee records.

Performance History: Detailed modal view showing individual task history.

Smart Filtering: Filter history logs by Status (Finished/Skipped) and Priority (High/Medium).

✅ 3. Dynamic Task Board

Live Status Updates: Instantly change task status (Todo → In Progress → Completed) via dropdowns.

Priority System: Visual badges for High/Medium/Low priority tasks.

Relational Assignment: Tasks are linked to employees via Foreign Keys in PostgreSQL.

🛠️ Technical Architecture

This project follows a Monorepo structure, ensuring code modularity and separation of concerns.

Tech Stack

Layer

Technology

Key Features

Frontend

React.js (Vite)

Blazing fast build tool, Component-based architecture.

Styling

Tailwind CSS

Utility-first CSS, Premium UI with "Inter" font family.

Icons

Lucide React

Lightweight, consistent SVG icons.

Backend

Node.js + Express

Scalable REST API, MVC Pattern.

Database

PostgreSQL (Supabase)

Relational data integrity, Complex queries using pg pool.

DevOps

Vercel + Render

Automated CI/CD pipelines linked to GitHub.
