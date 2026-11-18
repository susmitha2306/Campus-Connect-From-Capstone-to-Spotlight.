# CampusConnect Security Specification

## 1. Data Invariants
1. **Default Deny**: All Firestore paths are denied by default (`match /{document=**} { allow read, write: if false; }`).
2. **Role Integrity & Admin Isolation**: Users cannot self-assign `role: "admin"` or `status: "disabled"` on their `users/{userId}` document. Only an existing verified administrator (verified `sushmidhas4@gmail.com` or an entry in `/admins/{uid}`) can elevate roles, modify user status, or manage `/admins`.
3. **Public Showcase Isolation**: Unapproved (`pending` or `rejected`) projects and achievements are unreadable to non-administrators on both `get` and `list` operations.
4. **Approved Contact Privacy**: Project team contact details in `/projectContacts/{projectId}` are strictly unreadable to non-administrators unless `approved == true`.
5. **Per-User Bookmark & History Isolation**: `/bookmarks/{userId}` and `/recentlyViewed/{userId}` can only be read or written by the verified account owner (`request.auth.uid == userId`) or an administrator.
6. **Temporal & ID Integrity**: All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), creation timestamps equal `request.time` and remain immutable, and update timestamps equal `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Privilege Escalation on Registration**: Student creates `/users/{uid}` with `role: "admin"`.
2. **Self-Role Mutation**: Student updates `/users/{uid}` with `role: "admin"` or `status: "active"` after being disabled.
3. **Shadow Ghost Field Injection**: Student updates `/users/{uid}` with `{ name: "Alice", isVerified: true }`.
4. **Unverified Admin Email Spoof**: Request with `email: "sushmidhas4@gmail.com"` and `email_verified: false` attempting admin write on `/projects/{id}`.
5. **Unapproved Project Scraping**: Unauthenticated or student client calls `list` on `/projects` without `where('status', '==', 'approved')`.
6. **Unapproved Contact Scraping**: Student calls `get` on `/projectContacts/{projectId}` where `approved == false`.
7. **Cross-User Bookmark Hijack**: User A attempts to write `/bookmarks/{userB_uid}`.
8. **Recently Viewed Overflow (Denial of Wallet)**: User writes 50 items to `/recentlyViewed/{uid}.projectIds` (exceeds max 10).
9. **ID Poisoning**: Client attempts `create` on `/projects/../../invalid!id` or 500-char document ID.
10. **PII Blanket Read**: Student attempts `list` on `/users` to harvest other students' emails.
11. **Timestamp Forgery**: Admin or user attempts `create` on `/projects/{id}` with backdated `createdAt` (`!= request.time`).
12. **Student Project Tampering**: Authenticated student attempts `update` or `delete` on `/projects/{projectId}`.
