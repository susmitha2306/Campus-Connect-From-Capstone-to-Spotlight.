# CampusConnect — Configuration, Execution & Deployment Guide

## 1. Deliverables Overview
- **`index.html`**: Student & Visitor Dashboard (Hero, Dynamic Firebase Statistics, 6 Departments, Project Showcase, Search/Filter/Sort, Project Details & Related Projects, Approved Team Contacts, Bookmarks, Recently Viewed, Student Achievements, About Us, Profile & Logout).
- **`auth.html`**: Student Authentication Portal (Email/Password Registration & Login, Remember Me persistence, Forgot Password, Email Verification, Google Sign-In, Session Handling).
- **`admin.html`**: Role-Based Administrator Dashboard (Separate Admin Login Gate, Overview KPIs, Project CRUD + Approvals + Featured flags, Firebase Storage Image Uploads, Department Management, Achievement Management, Team Contact Approval Management, User Role & Status Management, 1-click 6-Department Sample Data Initializer).
- **`firestore.rules`**: Hardened Cloud Firestore Security Rules.
- **`storage.rules`**: Firebase Storage Security Rules for administrator image uploads.
- **`firebase-blueprint.json`**: Entity schemas and collection paths.

## 2. Firebase Configuration
The project is pre-wired to `firebase-applet-config.json`. To enable all authentication and storage features in your Firebase Console:

1. **Authentication Providers** (Firebase Console → *Authentication* → *Sign-in method*):
   - **Google**: Enabled by default.
   - **Email/Password**: Enable **Email/Password** so students can register and sign in with institutional email addresses and passwords in `auth.html` and `admin.html`.
2. **Firebase Storage** (Firebase Console → *Storage*):
   - Click **Get Started** to initialize the default Storage bucket (`fine-discipline-03kqt.firebasestorage.app`).
   - Deploy `storage.rules` so only verified administrators can upload project covers, screenshots, department photos, student photos, and certificates.
3. **Administrator Access**:
   - The bootstrapped administrator email (`sushmidhas4@gmail.com`, verified via Google or verified email) can sign into `admin.html` immediately.
   - From **Users & Roles** inside `admin.html`, the administrator can promote additional verified accounts into the `/admins/{uid}` collection.

## 3. Cloud Firestore Database Structure
- `/admins/{adminUid}` — Verified administrator lookup records (`uid`, `email`, `addedBy`, `createdAt`).
- `/users/{userId}` — Student and admin accounts (`uid`, `name`, `email`, `department`, `role`, `status`, `createdAt`).
- `/departments/{departmentId}` — Six official departments (`cse`, `it`, `ra`, `csecs`, `ece`, `aids`).
- `/projects/{projectId}` — Student capstone projects (`title`, `departmentId`, `department`, `domain`, `abstract`, `description`, `problemStatement`, `proposedSolution`, `architecture`, `objectives`, `technologies`, `teamMembers`, `guide`, `projectImage`, `screenshots`, `githubLink`, `demoLink`, `academicYear`, `status`, `featured`, `createdAt`, `updatedAt`).
- `/achievements/{achievementId}` — Student honors and awards (`studentName`, `departmentId`, `department`, `category`, `achievementTitle`, `description`, `eventName`, `award`, `date`, `studentImage`, `certificateImage`, `status`, `createdAt`).
- `/bookmarks/{userId}` — Per-user saved project IDs (`userId`, `projectIds`, `updatedAt`).
- `/recentlyViewed/{userId}` — Per-user 10 most recent unique viewed project IDs (`userId`, `projectIds`, `viewedAt`).
- `/projectContacts/{projectId}` — Admin-vetted team contacts (`projectId`, `teamName`, `teamLeader`, `officialEmail`, `department`, `guide`, `approved`, `updatedAt`).
- `/portalStats/summary` — Public aggregate counts (`totalProjects`, `totalDepartments`, `totalStudents`, `totalAchievements`, `updatedAt`) keeping user PII strictly isolated.

## 4. Seeding Sample Data for All 6 Departments
1. Open `admin.html` and sign in as an authorized administrator.
2. Click **Initialize Sample Data** in the top bar.
3. This populates Cloud Firestore with all 6 departments (`CSE`, `IT`, `R&A`, `CSECS`, `ECE`, `AI&DS`), 7 realistic projects across all departments (6 approved, 1 pending for testing moderation), 3 student achievements, and team contact records (6 approved, 1 unapproved for testing contact privacy).

## 5. Local Execution
```bash
npm install
npm run dev
```
Open:
- User Dashboard: `http://localhost:3000/index.html`
- Login & Registration: `http://localhost:3000/auth.html`
- Admin Dashboard: `http://localhost:3000/admin.html`

## 6. Deploying to Firebase Hosting
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase use fine-discipline-03kqt
firebase deploy --only hosting,firestore:rules,storage
```
