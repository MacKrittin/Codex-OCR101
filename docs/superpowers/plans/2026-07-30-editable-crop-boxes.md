# Editable Crop Boxes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create fields before crops and allow a selected field's crop box to be placed, moved, and resized.

**Architecture:** Extend the existing document field with an optional rectangle and track a selected field id in `App`. `FieldsPanel` selects fields; `PdfCanvas` owns pointer gestures and reports normalized rectangle changes to `App`, which reruns extraction for the edited field.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, PDF.js.

## Global Constraints

- Fields remain isolated to their source document and page.
- Crops are stored as normalized coordinates.
- Extraction reruns only for the crop changed by the user.

---

### Task 1: Model unplaced fields and selection

**Files:**
- Modify: `src/types.ts`, `src/App.tsx`, `src/components/FieldsPanel.tsx`
- Test: `src/components/FieldsPanel.test.tsx`

**Interfaces:**
- `ExtractedField.rect` becomes optional.
- `FieldsPanel` produces `onSelectField(id)` and `onStartField(name)` creates an unplaced field.

- [ ] **Step 1: Write the failing test**

```tsx
test('creates an unplaced field before a crop exists', async () => {
  render(<FieldsPanel fields={[]} onCreateField={onCreate} {...callbacks} />);
  await userEvent.type(screen.getByLabelText('New field name'), 'Total');
  await userEvent.click(screen.getByRole('button', { name: 'Add field' }));
  expect(onCreate).toHaveBeenCalledWith('Total');
});
```

- [ ] **Step 2: Verify RED**

Run: `node node_modules/vitest/vitest.mjs run src/components/FieldsPanel.test.tsx`

Expected: FAIL because the callback and unplaced state do not exist.

- [ ] **Step 3: Implement minimal state**

Create `{ id, name, page: 1, value: '', status: 'idle' }` immediately in `App`, set it selected, and display `Click to place` for a field without `rect`.

- [ ] **Step 4: Verify GREEN**

Run: `node node_modules/vitest/vitest.mjs run src/components/FieldsPanel.test.tsx`

Expected: PASS.

### Task 2: Place and edit selected crop boxes

**Files:**
- Modify: `src/components/PdfCanvas.tsx`, `src/App.tsx`, `src/styles.css`
- Test: `src/components/PdfCanvas.test.tsx`

**Interfaces:**
- `PdfCanvas` consumes `selectedFieldId` and emits `onCropChange(fieldId, rect, page)`.

- [ ] **Step 1: Write the failing test**

```tsx
test('reports a new normalized crop for the selected field', async () => {
  render(<PdfCanvas selectedFieldId="field-1" fields={[unplacedField]} onCropChange={onCropChange} />);
  await drag(screen.getByTestId('pdf-overlay'), { x: 20, y: 20 }, { x: 120, y: 120 });
  expect(onCropChange).toHaveBeenCalledWith('field-1', expect.objectContaining({ width: .5 }), 1);
});
```

- [ ] **Step 2: Verify RED**

Run: `node node_modules/vitest/vitest.mjs run src/components/PdfCanvas.test.tsx`

Expected: FAIL because crop-change callbacks do not exist.

- [ ] **Step 3: Implement crop editing**

Start a new crop when the selected field has no rectangle. For a selected box, use interior dragging to translate and four corner handles to resize. Clamp all changes to the PDF page and emit normalized values on pointer release.

- [ ] **Step 4: Verify GREEN**

Run: `node node_modules/vitest/vitest.mjs run src/components/PdfCanvas.test.tsx`

Expected: PASS.

### Task 3: Re-extract on crop completion and verify

**Files:**
- Modify: `src/App.tsx`, `src/components/PdfCanvas.tsx`, `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
test('shows an unplaced selected field ready for placement', () => {
  render(<App seededDocuments={[documentWithUnplacedField]} />);
  expect(screen.getByText('Click to place')).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED**

Run: `node node_modules/vitest/vitest.mjs run src/App.test.tsx`

Expected: FAIL because unplaced feedback does not exist.

- [ ] **Step 3: Implement extraction lifecycle**

Set the changed field to `extracting`, use the new rectangle to call `extractTextFromRegion`, then save either `ready` plus value or `error` plus a message. Style selected and editable crop states with handles and clear instructions.

- [ ] **Step 4: Verify GREEN and build**

Run: `node node_modules/vitest/vitest.mjs run && node node_modules/vite/bin/vite.js build`

Expected: all tests PASS and Vite build succeeds.
