# Default Shipping Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepopulate newly uploaded PDFs with seven standard shipping extraction fields.

**Architecture:** A small field factory in `App` supplies unique, idle field records to the document created by the upload flow. Existing documents and field editing remain unchanged.

**Tech Stack:** React, TypeScript, Vitest.

## Global Constraints

- Keep extraction entirely local in the browser.
- Apply default fields only to newly uploaded PDFs.
- Preserve rename, delete, and custom field creation.

---

### Task 1: Default field factory

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces: `createDefaultFields(): ExtractedField[]`.

- [ ] **Step 1: Write the failing test**

```tsx
test('creates the standard shipping fields in order', () => {
  expect(createDefaultFields().map((field) => field.name)).toEqual([
    'Shipper', 'Consignee', 'Notify Party', 'Description of Goods', 'Shipping Marks', 'Total', 'Weight',
  ]);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node node_modules/vitest/vitest.mjs run src/App.test.tsx`

Expected: FAIL because the factory does not exist.

- [ ] **Step 3: Implement the factory and use it in upload**

```tsx
const createDefaultFields = (): ExtractedField[] => DEFAULT_FIELD_NAMES.map((name) => ({
  id: crypto.randomUUID(), name, page: 1, crops: [], value: '', status: 'idle',
}));
```

Set `fields: createDefaultFields()` when adding a successfully opened document.

- [ ] **Step 4: Verify the test passes**

Run: `node node_modules/vitest/vitest.mjs run src/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: add default shipping fields"
```

### Task 2: Full verification

- [ ] **Step 1: Run full tests**

Run: `node node_modules/vitest/vitest.mjs run`

Expected: all tests pass.

- [ ] **Step 2: Build production assets**

Run: `node node_modules/vite/bin/vite.js build`

Expected: build exits 0.
