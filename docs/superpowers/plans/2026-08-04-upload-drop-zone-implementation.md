# Upload Drop Zone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Drop PDFs onto Upload PDF while preserving click upload.

**Architecture:** DocumentRail owns temporary drag state and forwards dropped files through its existing `onUpload` callback.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.

### Task 1: Drop target

**Files:**
- Modify: `src/components/DocumentRail.tsx`
- Modify: `src/components/DocumentRail.test.tsx`
- Modify: `src/orange-theme.css`

- [ ] Write a failing test that fires `drop` with a PDF on the Upload PDF label and expects `onUpload` to receive the dropped files.
- [ ] Run `node node_modules/vitest/vitest.mjs run src/components/DocumentRail.test.tsx` and verify it fails.
- [ ] Add drag enter/leave/over/drop handlers, a drag-active class, and `Drop PDF here` text. Prevent default browser navigation and call the existing upload callback on PDF drops.
- [ ] Re-run the focused test and commit with `feat: add upload drop zone`.

### Task 2: Verification

- [ ] Run `node node_modules/vitest/vitest.mjs run`.
- [ ] Run `node node_modules/vite/bin/vite.js build`.
