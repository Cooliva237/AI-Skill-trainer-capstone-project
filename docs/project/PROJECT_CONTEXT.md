# AI Skill Trainer

## Team

- Carlos Oliva
- Turner Johnson
- Toby Macklin

## Purpose

AI Skill Trainer is a web application for learning real-world skills. The progression idea is similar to a language-learning path: an account, a chosen skill, a skill tree, lessons in order, and saved progress. It does not teach languages.

Create or log in to an account, choose a skill, enter that skill's tree, complete lessons, unlock the next lessons, and track progress.

## Platform change

The project was first planned as an iOS app in Swift. The team does not have consistent access to Mac hardware, which made iOS development impractical. The project is now a web application. New work should not depend on Swift, SwiftUI, Xcode, or an iPhone-only build.

## Current technology

Semester 1 uses Next.js, React, TypeScript, and Tailwind CSS. Early accounts and lesson progress can live in the browser with local data and `localStorage`.

Later options to evaluate, not to build before the basic app works:

- Supabase, or a similar service, for database and authentication
- MediaPipe, or another pose-estimation library, for gym form
- An AI API that turns form results into plain-language feedback

Different skills may eventually use different tools. Gym and fitness can use pose estimation. Piano may use microphone and audio recognition. Crocheting may use visual lessons. Piano and crocheting are Semester 2 ideas and are not part of the current build.

## Semester 1 scope

Semester 1 builds the platform and the first skill tree.

- First skill: Gym & Fitness
- First exercise: Bench Press

Priorities: the web app, navigation, an account and login structure, skill selection, a visual skill tree, lessons, locked and unlocked progression, saved progress, gym lesson content, a progress view, pose-estimation research and a prototype, and testing.

## Agile process

The course assigns eight sprints. The product backlog covers the whole semester. Each sprint pulls only the items assigned to that sprint. A high-priority foundation comes before later features such as pose estimation and AI feedback.

| Sprint | Dates | Focus |
| --- | --- | --- |
| 1 | August 24 – September 6 | Team setup, topic, initial scope, initial backlog, GitHub workflow |
| 2 | September 7 – September 20 | Proposal, semester plan, backlog refinement |
| 3 | September 21 – October 4 | Feasibility, requirements, early design, technology research, wireframes, pose-estimation research |
| 4 | October 5 – October 18 | Architecture, data model, system design, initial web implementation, skill-tree UI |
| 5 | October 19 – November 1 | Main coding: accounts, navigation, skill-tree behavior, gym lessons, non-functional requirements |
| 6 | November 2 – November 15 | Progress, exercise history, pose-estimation integration, testing and unit tests |
| 7 | November 16 – November 29 | Integration, advanced testing, AI feedback where feasible, errors, usability, bugs, refactoring |
| 8 | November 30 – December 6 | Final integration, regression testing, demo build, presentation, semester wrap-up |

## Backlog epics

The source backlog is `docs/source/Project Backlog.pdf`. The LaTeX copy is `docs/overleaf/project_backlog.tex`.

- E0 — Project Planning, Requirements & Design
- E1 — User Accounts & Core App Navigation
- E2 — Skill Tree Framework
- E3 — Gym & Fitness Skill Tree
- E4 — Pose Estimation & AI Form Feedback
- E5 — Quality, Testing & Non-Functional Requirements
- E6 — Final Integration & Semester Deliverable

Do not mark backlog rows complete from code alone. Status changes belong in the backlog when the team confirms them.
