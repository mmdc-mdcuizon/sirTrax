<div align="center">

# ⚡ sirTrax
### Weekly Cadence & Daily Focus Planner

An opinionated, zero-dependency weekly cadence planner designed to bridge the gap between daily execution and recurring habit systems across **Work**, **School**, and **Health**.

[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic%20Markup-E34F26?style=flat-square&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Custom%20Tokens-1572B6?style=flat-square&logo=css3&logoColor=white)](#)
[![Material You](https://img.shields.io/badge/Design-Material%20You%20Dark-8AB4F8?style=flat-square)](#)
[![Accessibility](https://img.shields.io/badge/WAI--ARIA-Accessible-success?style=flat-square)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-brightgreen?style=flat-square)](#)

---

### 🎓 Academic Context
**Institution:** Mapúa Malayan Digital College (MMDC)  
**Program:** Bachelor of Science in Information Technology (Major in Software Development)  
**Course:** Web Systems and Technologies (WebSys)  
**Deliverable:** Milestone 1 – Front-End Architecture & Usability Prototype  
**Author:** Marc Denise Pasa Cuizon  

---

</div>

## 📸 Interface Previews & System Backbone

<div align="center">

### Application Views
*Material You dark surfaces with live progress tracking, day scheduling, and three-pillar taxonomy.*

| Daily Dashboard View | Weekly Cadence Setup |
| :---: | :---: |
| ![Daily Dashboard](assets/screenshots/dashboard.png) | ![Weekly Cadence Planner](assets/screenshots/setup.png) |

<br>

### HTML Semantic Backbone
*Container hierarchy and accessible SPA view skeleton.*

![HTML Backbone Diagram](assets/screenshots/html-backbone.png)

</div>

---

## 📌 1. Overview & Project Purpose

Most to-do lists fail because they demand constant manual rescheduling: everyday routines get lost in transient lists, leading to task fatigue and fragmented tracking. 

**sirTrax** eliminates this friction with a browser-native **Weekly Cadence Engine**. Rather than treating every day as a blank slate, routines repeat across a consistent Monday–Sunday cycle, automatically refreshing when calendar dates roll over. All activities are organized strictly into three foundational life pillars—**Work**, **School**, and **Health**—enabling balanced daily focus without clutter[cite: 1, 3].

### Project Goals
* **Strict Vanilla Web Standards:** Handcrafted entirely with pure HTML5, CSS3, and JavaScript—strictly zero external libraries, frameworks, or runtime dependencies.
* **Determinism & Persistence:** Real-time state synchronization to browser `localStorage` ensuring zero data loss across reloads.
* **Accessible Material You Aesthetic:** Deep dark-mode elevation surfaces, tonal pill accents, and full WAI-ARIA compliance designed for fluid user interaction[cite: 1, 3].

---

## 🚀 2. Core Architecture

sirTrax operates as a high-performance, single-file client-side Single-Page Application (SPA) driven by an encapsulated Immediately Invoked Function Expression (IIFE):

```text
[ Browser Date Check ] ────► [ Cadence State Engine ] ────► [ Dynamic DOM Renderer ]
           │                            │                               │
     Auto-Rollover             Local Storage Sync            Filtered View Update
   (Resets repeating             (sirTrax_cadence)          (Work / School / Health)
     weekly tasks)
