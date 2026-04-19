# Security Specification for LearnPlay

## Data Invariants
1. **Sessions are Immutable**: Once a game session is written, it cannot be modified (prevents cheating).
2. **Identity Integrity**: Users can only write/edit their own profiles and datasets.
3. **Admin Gates**: Only specific users (admins) can create/edit "Games" (the engines), though community templates can be a future feature.
4. **Visibility Rules**: Public datasets are readable by everyone, private ones only by the author.

## The Dirty Dozen Payloads (Denial Tests)
1.  **Identity Spoofing**: Attempt to create a document in `/users/bill` as authenticated user `joe`.
2.  **State Shortcutting**: Attempt to update `totalXP` directly in user profile without completing a session.
3.  **Ghost Field Injection**: Adding an `isAdmin: true` field to a user profile update.
4.  **Resource Poisoning**: Large string (1MB) as a `gameId`.
5.  **Session Forgery**: Manually creating a session with a score of 99999 for someone else.
6.  **Dataset Hijacking**: Updating a dataset created by another user.
7.  **Schema Bypass**: Creating a dataset that doesn't match the `gameType` schema.
8.  **Orphaned Session**: Creating a session that references a non-existent `gameId`.
9.  **Timestamp Fraud**: Providing a `completedAt` timestamp in the past or far future.
10. **Game Engine Tampering**: Deleting a standard game engine from `/games/match`.
11. **PII Leak**: Reading all users' emails in one query.
12. **Accurate Counting Breach**: Incrementing `playsCount` on a game without creating a corresponding session. (Atomic check).

## The Test Runner (Plan)
We will use `@firebase/rules-unit-testing` logic locally or via ESLint security plugin to ensure all these operations return `PERMISSION_DENIED`.
