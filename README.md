<div align="center">

# ⚡ sirTrax
### Weekly Cadence & Daily Focus Planner

A clean, browser-based weekly planner designed to build daily habits and avoid app overload by organizing recurring routines across **Work**, **School**, and **Health**.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)

---

### 🎓 Academic Context
**Institution:** Mapúa Malayan Digital College (MMDC)  
**Program:** Bachelor of Science in Information Technology (Major in Software Development)  
**Course / Section:** Web Systems and Technology (MO-IT161) — H3101
**Deliverable:** Milestone 1: Interactive Frontend Web Application
**Author:** Marc Denise Cuizon

---

</div>

## 📑 Table of Contents
- [📸 Screenshots & Structure](#-screenshots--structure)
- [📋 Project Planning & Worksheet](#-project-planning--worksheet)
- [📌 1. Project Purpose & Overview](#-1-project-purpose--overview)
- [✨ 2. Features & Interaction Areas](#-2-features--interaction-areas)
- [🤖 3. AI Usage & Learning Reflection](#-3-ai-usage--learning-reflection)
- [🚀 4. How to Run Locally](#-4-how-to-run-locally)

---

## 📸 Screenshots & Structure

<div align="center">

### Application Views
*Dark theme interface inspired by Material You, with progress tracking, day scheduling, and category filters.*

| Daily Execution Dashboard | Weekly Cadence Planner |
| :---: | :---: |
| ![Daily Execution Dashboard](assets/screenshots/dashboard.png) | ![Weekly Cadence Planner](assets/screenshots/setup.png) |

<br>

### HTML Structure & Page Flow
*Overall layout blueprint showing how views switch without refreshing the page.*

![HTML Semantic Backbone](assets/screenshots/html-backbone.png)

</div>

---

## 📋 Project Planning & Worksheet

This project was built step by step following our course weekly requirements. For details on how I planned the pages, ordered the features, managed project scope, and reflected on my coding workflow, here is the full planning worksheet:

📄 <strong><a href="https://docs.google.com/spreadsheets/d/1sG5ybAjzruohheh9A48HBCbZCPGFaekcK2JMmOz7NbI/edit?usp=drive_link" target="_blank" rel="noopener noreferrer">View Full Application Development Workflow Worksheet</a></strong>

---

## 📌 1. Project Purpose & Overview

I decided to build **sirTrax** because of a struggle I deal with daily: **app fatigue**. I found myself jumping between to-do apps, notes, and chat reminders, and the friction of manually typing out and sorting tasks every morning made me put things off.

Instead of starting with a blank checklist every single day, **sirTrax** uses a weekly loop. You set up recurring routines once for any day of the week, and the app resets them automatically when the calendar date changes.

Everything is sorted into three main areas of life:
- **💼 Work:** Job tasks, code reviews, and meetings.
- **🎓 School:** Assignments, checking lecture notes, and study blocks.
- **🏃 Health:** Hydration, exercise, walks, and rest.

### How the Web App Works (Without Extra Libraries)
- **No Page Refreshes (Single-Page App):** The app switches smoothly between the Welcome screen, the Weekly Planner, and the Daily Dashboard using plain JavaScript class toggles (`.active` and `.hidden`), so the page never has to reload.
- **Automatic Weekly Resets:** It checks the computer's system date when opened. If it is a new day, repeating weekly routines are unchecked so you can start fresh.
- **Saves in the Browser (`localStorage`):** Everything you add or check off is saved directly in your browser's storage, meaning tasks stay intact even if you close or refresh the tab.
- **Material You Design:** Built using CSS variables and dark elevation layers to give it an Android Material-inspired look and feel.

---

## ✨ 2. Features & Interaction Areas

| Feature / Screen Area | What It Does | Priority |
| :--- | :--- | :---: |
| **Weekly Loop Engine** | Schedules tasks from Monday to Sunday and automatically unchecks repeating tasks when the day rolls over. | **High** |
| **View Switching** | Switches between the Welcome screen, Setup screen, and Today's Dashboard without browser reloads. | **High** |
| **Browser Storage (`localStorage`)** | Saves your customized routines and checkboxes in the browser without needing a backend database yet. | **High** |
| **Category Filters ("All", "Work", "School", "Health")** | Lets you filter today's view by category with live count badges for each pillar. | **Medium** |
| **Interactive Progress Bar** | Circular check buttons that cross out finished tasks and fill up the progress bar in real time. | **Medium** |
| **Two Ways to Add Tasks** | Use the **Weekly Setup Modal** for routines that repeat every week, or **Quick Add** for a one-off task for today only. | **Medium** |
| **Toast Alerts & Input Safety** | Shows pop-up notices when tasks are completed or deleted, and cleans input text so harmful code cannot be run. | **Medium** |

---

## 🤖 3. AI Usage & Learning Reflection

In compliance with our course **AI Use Statement** policy, I used AI tools as a learning partner, sounding board, and prototyping assistant rather than letting them write the project for me.

### Tools Used
- **Google Stitch:** Prototyped visual mockups based on rough layout sketches.
- **Gemini (Flash & Pro):** Brainstormed how to build my idea under strict HTML/CSS/JavaScript constraints, helped refine prompt descriptions for Google Stitch, and helped me organize my thoughts for the worksheet documentation.
- **Ollama (Local models — `qwen3-coder:30b`, `gemma4:e4b`):** Generated unconstrained reference code to compare against my ongoing projects and see how things look without coursework limitations (none of this code was used in the final submission).

### How I Exercised Judgment & Built It Manually
1. **Typing Every Line by Hand:** Even when AI suggested code snippets or solutions, I typed all the code into VS Code manually. Doing this line-by-line was crucial for me as a student to actually understand the syntax, DOM manipulation, and overall structure of the app.
2. **Fixing AI Mistakes & Hallucinations:** AI outputs often mess up small details—like generating broken class names, hallucinating non-existent properties, or duplicating button icons and plus signs (`+ + Quick Add`). I had to audit every line and correct these mistakes by hand.
3. **Accessibility (ARIA) Corrections:** When I prompted AI for screen-reader accessibility, it often produced incomplete or improper tags. I manually reviewed and set proper ARIA dialog roles, radio groups, tabs, and live announcements so the app genuinely meets accessibility standards.
4. **Keeping Scope Realistic:** My original dream idea was a voice-to-text task creator that used AI to automatically sort reminders into categories. Recognizing that audio streaming and natural language processing were way too complicated for Milestone 1, I cut those out to focus on delivering a clean, solid, working web application first.

📄 <strong><a href="https://docs.google.com/document/d/1Fhx7qHvvBqz0MmN6DRmlRb6HSddC1NUR1OYq3cHr0Sg/edit?usp=drive_link" target="_blank" rel="noopener noreferrer">View Full AI Use Statement Document</a></strong>

---

## 🚀 4. How to Run Locally

### Setup Steps
1. Clone this repository:
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/sirTrax.git
