# Crop Box Delete Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hoverable cancel button that removes only the selected crop box.

**Architecture:** `PdfCanvas` renders an accessible delete button for every visible crop and emits the field/crop identifiers. `App` owns the document state and removes the matching crop, regenerating the field’s combined text and status.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Lucide icons, CSS.

## Global Constraints

- Keep extraction entirely local in the browser.
- Delete only the selected crop area; keep its field and all other crops.
- Show the control on crop hover or keyboard focus.

---

### Task 1: Crop delete callback and control

**Files:**
- Modify: `src/components/PdfCanvas.tsx`
- Create: `src/components/PdfCanvas.test.tsx`
- Modify: `src/orange-theme.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `onDeleteCrop(fieldId: string, cropId: string): void` from `App`.
- Produces: a labelled cancel button per visible crop area.

- [ ] **Step 1: Write the failing component test**

```tsx
test('reports the matching field and crop when a crop cancel button is pressed', async () => {
  const onDeleteCrop = vi.fn();
  render(<PdfCanvas {...props} fields={[fieldWithCrop]} onDeleteCrop={onDeleteCrop} />);
  await userEvent.click(screen.getByRole('button', { name: 'Remove crop for Invoice' }));
  expect(onDeleteCrop).toHaveBeenCalledWith('field-1', 'crop-1');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node node_modules/vitest/vitest.mjs run src/components/PdfCanvas.test.tsx`

Expected: FAIL because `PdfCanvas` does not accept or render the crop delete control.

- [ ] **Step 3: Add the callback and button**

```tsx
<button
  className="crop-cancel"
  aria-label={`Remove crop for ${field.name}`}
  type="button"
  onPointerDown={(event) => event.stopPropagation()}
  onClick={(event) => { event.stopPropagation(); onDeleteCrop(field.id, crop.id); }}
>
  <X size={14} />
</button>
```

Add `onDeleteCrop` to `PdfCanvas` props and pass it from `App`. Style `.crop-cancel` at the crop box’s top-right corner with white/orange contrast, hidden by default and visible on `.crop-box:hover` or `.crop-box:focus-within`.

- [ ] **Step 4: Implement the state update in App**

```tsx
const deleteCrop = (fieldId: string, cropId: string) => {
  setDocuments((current) => updateDocument(current, activeId!, (doc) => ({
    ...doc,
    fields: doc.fields.map((field) => {
      if (field.id !== fieldId) return field;
      const crops = field.crops.filter((crop) => crop.id !== cropId);
      return { ...field, crops, value: crops.map((crop) => crop.value).filter(Boolean).join('\n'), status: crops.length ? 'ready' : 'idle', error: undefined };
    }),
  })));
};
```

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `node node_modules/vitest/vitest.mjs run src/components/PdfCanvas.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/PdfCanvas.tsx src/components/PdfCanvas.test.tsx src/orange-theme.css
git commit -m "feat: add crop delete control"
```

### Task 2: Full verification

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/components/PdfCanvas.tsx`

**Interfaces:**
- Consumes: the callback and visual control from Task 1.
- Produces: verified local behavior and a production build.

- [ ] **Step 1: Run the full test suite**

Run: `node node_modules/vitest/vitest.mjs run`

Expected: all tests pass.

- [ ] **Step 2: Build the application**

Run: `node node_modules/vite/bin/vite.js build`

Expected: build exits with code 0.

- [ ] **Step 3: Check the worktree**

Run: `git status --short`

Expected: no uncommitted implementation changes.
