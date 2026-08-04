# Expandable Capture Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users expand Capture details to 520px on desktop and return it to its standard width.

**Architecture:** App owns the expanded state and applies an application-shell class. FieldsPanel renders the toggle and reports its desired next state; responsive CSS preserves the existing stacked layout below 980px.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Lucide icons, CSS.

## Global Constraints

- Keep extraction entirely local in the browser.
- Expand from 330px to 520px only on desktop grids.
- Keep the existing tablet and mobile stacked layout.

---

### Task 1: Panel expansion toggle

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/FieldsPanel.tsx`
- Modify: `src/components/FieldsPanel.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `expanded: boolean` and `onExpandedChange(expanded: boolean): void`.
- Produces: an accessible expand/collapse control and a shell class that controls desktop width.

- [ ] **Step 1: Write the failing test**

```tsx
test('requests expansion from the Capture details header', async () => {
  const onExpandedChange = vi.fn();
  render(<FieldsPanel {...props} expanded={false} onExpandedChange={onExpandedChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'Expand Capture details' }));
  expect(onExpandedChange).toHaveBeenCalledWith(true);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node node_modules/vitest/vitest.mjs run src/components/FieldsPanel.test.tsx`

Expected: FAIL because the toggle does not exist.

- [ ] **Step 3: Implement the state and control**

```tsx
const [detailsExpanded, setDetailsExpanded] = useState(false);
<div className={`app-shell ${detailsExpanded ? 'details-expanded' : ''}`}>
<FieldsPanel expanded={detailsExpanded} onExpandedChange={setDetailsExpanded} />
```

```tsx
<button aria-label={expanded ? 'Collapse Capture details' : 'Expand Capture details'} onClick={() => onExpandedChange?.(!expanded)} />
```

- [ ] **Step 4: Add desktop CSS**

```css
.app-shell.details-expanded { grid-template-columns: 260px minmax(420px, 1fr) 520px; }
@media (max-width: 980px) { .app-shell.details-expanded { grid-template-columns: 220px minmax(360px, 1fr); } }
```

- [ ] **Step 5: Verify the focused test passes**

Run: `node node_modules/vitest/vitest.mjs run src/components/FieldsPanel.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/FieldsPanel.tsx src/components/FieldsPanel.test.tsx src/styles.css
git commit -m "feat: expand capture details panel"
```

### Task 2: Full verification

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/components/FieldsPanel.tsx`

- [ ] **Step 1: Run full tests**

Run: `node node_modules/vitest/vitest.mjs run`

Expected: all tests pass.

- [ ] **Step 2: Build production assets**

Run: `node node_modules/vite/bin/vite.js build`

Expected: build exits 0.
