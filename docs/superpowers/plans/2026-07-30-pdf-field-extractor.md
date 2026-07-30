# PDF Field Extractor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-only React application that lets users draw named PDF regions, extract their text locally, and download all values as a text file.

**Architecture:** Vite serves a client-only React/TypeScript application. PDF.js renders pages and supplies text-layer coordinates; the editor stores document-scoped normalized rectangles in React state. The extraction service reads text first, then rasterizes only empty selected regions for Tesseract.js OCR.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Testing Library, PDF.js (`pdfjs-dist`), Tesseract.js, Lucide React, CSS.

## Global Constraints

- All PDF parsing, rendering, crop generation, OCR, and export run locally in the browser; do not create HTTP endpoints.
- Multiple PDFs are allowed, but fields are isolated to the document on which they were created.
- A field uses one named normalized rectangle on one PDF page.
- Embedded text is preferred; OCR runs only when the selected region has no embedded text.
- Export is a UTF-8 `.txt` download grouped by filename and field name.
- Use test-driven development: run each new test once while failing before writing production code.

---

## File structure

- `package.json`: Vite commands and application dependencies.
- `src/types.ts`: Document, field, rectangle, and extraction types.
- `src/lib/geometry.ts`: Pure pixel/normalized-coordinate conversion and rectangle intersection helpers.
- `src/lib/exportText.ts`: Pure text-export formatter and browser download creator.
- `src/lib/pdfExtraction.ts`: PDF.js text-region extraction and crop-to-OCR orchestration.
- `src/components/DocumentRail.tsx`: Upload and active-document selection.
- `src/components/PdfCanvas.tsx`: Page rendering, navigation, zoom, crop overlay, and field selection.
- `src/components/FieldsPanel.tsx`: Field creation, editing, deletion, result state, and export control.
- `src/App.tsx`: Document-scoped state and composition of the three editor regions.
- `src/styles.css`: Responsive visual system and editor layout.
- `src/test/setup.ts`: DOM matchers and browser-API mocks.
- `src/lib/*.test.ts`, `src/App.test.tsx`: Behaviour-focused tests.

### Task 1: Create the Vite application shell and domain types

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/types.ts`, `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces `PdfDocument`, `ExtractedField`, `NormalizedRect`, and `ExtractionStatus` from `src/types.ts`.
- Produces an `App` component that subsequent tasks extend.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the empty document workspace', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /pdf field extractor/i })).toBeInTheDocument();
  expect(screen.getByText(/upload pdf/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because the project and `App` component do not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export type ExtractionStatus = 'idle' | 'extracting' | 'ready' | 'error';

export interface NormalizedRect { x: number; y: number; width: number; height: number; }
export interface ExtractedField {
  id: string; name: string; page: number; rect: NormalizedRect;
  value: string; status: ExtractionStatus; error?: string;
}
export interface PdfDocument {
  id: string; filename: string; data: ArrayBuffer; pageCount: number; fields: ExtractedField[];
}
```

Create a Vite React entry point and render an `h1` plus an accessible `Upload PDF` button in `App`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src
git commit -m "chore: scaffold PDF field extractor"
```

### Task 2: Implement coordinate and export utilities

**Files:**
- Create: `src/lib/geometry.ts`, `src/lib/geometry.test.ts`, `src/lib/exportText.ts`, `src/lib/exportText.test.ts`

**Interfaces:**
- Consumes: `NormalizedRect` and `PdfDocument` from `src/types.ts`.
- Produces `normalizeRect`, `denormalizeRect`, `rectanglesIntersect`, and `formatExportText`.

- [ ] **Step 1: Write the failing tests**

```ts
test('normalizes a crop against its canvas', () => {
  expect(normalizeRect({ x: 50, y: 25, width: 200, height: 100 }, 500, 250))
    .toEqual({ x: 0.1, y: 0.1, width: 0.4, height: 0.4 });
});

test('formats values grouped under each filename', () => {
  expect(formatExportText([{ filename: 'one.pdf', fields: [{ name: 'Invoice', value: 'A-01' }] }]))
    .toBe('one.pdf\nInvoice: A-01\n');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/geometry.test.ts src/lib/exportText.test.ts`

Expected: FAIL because utility modules do not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export const normalizeRect = (rect: PixelRect, width: number, height: number): NormalizedRect => ({
  x: rect.x / width, y: rect.y / height, width: rect.width / width, height: rect.height / height,
});

export const formatExportText = (documents: ExportDocument[]) =>
  documents.map(({ filename, fields }) => `${filename}\n${fields.map(({ name, value }) => `${name}: ${value}`).join('\n')}\n`).join('\n');
```

Include a `downloadText(filename, content)` helper that creates a UTF-8 `Blob`, invokes an object URL download, and revokes the URL.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/geometry.test.ts src/lib/exportText.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: add geometry and text export utilities"
```

### Task 3: Add client-side PDF text and OCR extraction

**Files:**
- Create: `src/lib/pdfExtraction.ts`, `src/lib/pdfExtraction.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `NormalizedRect`, a PDF.js page object, and an image crop.
- Produces `extractTextFromRegion(page, rect, viewport)` returning `Promise<string>`.

- [ ] **Step 1: Write the failing tests**

```ts
test('returns reading-order embedded text that intersects a selected region', async () => {
  const page = pageWithText([{ str: 'Invoice', x: 10, y: 10 }, { str: '42', x: 70, y: 10 }]);
  await expect(extractTextFromRegion(page, { x: 0, y: 0, width: .5, height: .5 }, viewport))
    .resolves.toBe('Invoice 42');
});

test('uses OCR only when no embedded item intersects the selected region', async () => {
  const page = pageWithText([]);
  await expect(extractTextFromRegion(page, fullRect, viewport, { recognize: async () => 'scan text' }))
    .resolves.toBe('scan text');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/pdfExtraction.test.ts`

Expected: FAIL because `extractTextFromRegion` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export async function extractTextFromRegion(page: PdfPage, rect: NormalizedRect, viewport: Viewport, ocr = worker) {
  const text = await page.getTextContent();
  const matching = text.items.filter((item) => rectanglesIntersect(itemBounds(item, viewport), denormalizeRect(rect, viewport.width, viewport.height)));
  if (matching.length) return matching.sort(readingOrder).map((item) => item.str).join(' ').trim();
  return ocr.recognize(await renderCrop(page, rect, viewport));
}
```

Use `pdfjs-dist` for page rendering/text content and Tesseract.js worker recognition. Keep worker creation lazy so it is loaded only when fallback OCR is required.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/pdfExtraction.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json src/lib/pdfExtraction.ts src/lib/pdfExtraction.test.ts
git commit -m "feat: extract PDF text with local OCR fallback"
```

### Task 4: Build document upload and isolated editor state

**Files:**
- Create: `src/components/DocumentRail.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: `PdfDocument` from `src/types.ts`.
- Produces `DocumentRail({ documents, activeId, onUpload, onSelect })`.

- [ ] **Step 1: Write the failing test**

```tsx
test('keeps fields separate when switching documents', async () => {
  render(<App />);
  await uploadPdfs(['first.pdf', 'second.pdf']);
  await userEvent.click(screen.getByRole('button', { name: 'first.pdf' }));
  await userEvent.click(screen.getByRole('button', { name: /add field/i }));
  await userEvent.click(screen.getByRole('button', { name: 'second.pdf' }));
  expect(screen.getByText(/no fields yet/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because upload and document selection are unavailable.

- [ ] **Step 3: Write minimal implementation**

Create an accept-PDF file input, read each file with `arrayBuffer()`, obtain the page count from PDF.js, and append a document with `fields: []`. Store the active document id in `App`; use immutable updates keyed by document id.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/DocumentRail.tsx src/styles.css
git commit -m "feat: upload and select independent PDF documents"
```

### Task 5: Build the page canvas and crop editor

**Files:**
- Create: `src/components/PdfCanvas.tsx`, `src/components/PdfCanvas.test.tsx`
- Modify: `src/App.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: active `PdfDocument`, page number, zoom, and fields.
- Produces `PdfCanvas({ document, fields, onCreateFieldRect, onSelectField })`.

- [ ] **Step 1: Write the failing test**

```tsx
test('creates a normalized rectangle after the user drags on the page', async () => {
  const onCreateFieldRect = vi.fn();
  render(<PdfCanvas document={document} fields={[]} onCreateFieldRect={onCreateFieldRect} onSelectField={vi.fn()} />);
  await drag(screen.getByTestId('pdf-overlay'), { x: 20, y: 30 }, { x: 120, y: 130 });
  expect(onCreateFieldRect).toHaveBeenCalledWith(expect.objectContaining({ x: .1, y: .15, width: .5, height: .5 }));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/PdfCanvas.test.tsx`

Expected: FAIL because the canvas editor does not exist.

- [ ] **Step 3: Write minimal implementation**

Render the current PDF page to a canvas. Position a same-sized absolute overlay above it, capture pointer down/move/up, clamp the rectangle to page bounds, normalize it, and call `onCreateFieldRect`. Render existing fields as labeled absolute rectangles and include page previous/next and zoom controls.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/PdfCanvas.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/PdfCanvas.tsx src/components/PdfCanvas.test.tsx src/App.tsx src/styles.css
git commit -m "feat: draw regions on rendered PDF pages"
```

### Task 6: Add field controls, extraction state, and download

**Files:**
- Create: `src/components/FieldsPanel.tsx`, `src/components/FieldsPanel.test.tsx`
- Modify: `src/App.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: selected document fields and `onFieldChange`, `onDelete`, `onExport` callbacks.
- Produces `FieldsPanel` and export workflow.

- [ ] **Step 1: Write the failing tests**

```tsx
test('edits the extracted value before exporting', async () => {
  render(<FieldsPanel fields={[readyField]} onFieldChange={onFieldChange} onDelete={vi.fn()} onExport={vi.fn()} />);
  await userEvent.clear(screen.getByLabelText(/invoice value/i));
  await userEvent.type(screen.getByLabelText(/invoice value/i), 'Corrected');
  expect(onFieldChange).toHaveBeenLastCalledWith('field-1', { value: 'Corrected' });
});

test('disables export when there are no fields', () => {
  render(<FieldsPanel fields={[]} onFieldChange={vi.fn()} onDelete={vi.fn()} onExport={vi.fn()} />);
  expect(screen.getByRole('button', { name: /export/i })).toBeDisabled();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/FieldsPanel.test.tsx`

Expected: FAIL because the fields panel does not exist.

- [ ] **Step 3: Write minimal implementation**

Show a field's editable name and value, status (`Extracting`, `Ready`, or error message), and delete action. Upon crop creation, create a named draft field, then call `extractTextFromRegion` and update its status/value. Export all document fields through `formatExportText` and `downloadText('extracted-data.txt', content)`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/FieldsPanel.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/FieldsPanel.tsx src/components/FieldsPanel.test.tsx src/App.tsx src/styles.css
git commit -m "feat: manage extracted fields and export text"
```

### Task 7: Polish responsive UI and verify the end-to-end workflow

**Files:**
- Modify: `src/styles.css`, `README.md`

**Interfaces:**
- Consumes: completed editor components.
- Produces: accessible desktop three-column layout and mobile stacked layout.

- [ ] **Step 1: Write the failing accessibility test**

```tsx
test('labels core editor controls', () => {
  render(<App seededDocuments={[documentWithField]} />);
  expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /export extracted text/i })).toBeEnabled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL until page and export control labels exist.

- [ ] **Step 3: Write minimal implementation**

Add focused keyboard-visible controls, responsive CSS breakpoints, loading/error empty states, and a README with `npm install`, `npm run dev`, `npm test`, browser-only privacy note, and local-OCR limitation note.

- [ ] **Step 4: Run all automated tests**

Run: `npm test -- --run && npm run build`

Expected: all tests PASS and the production build completes.

- [ ] **Step 5: Run browser QA and commit**

Run: `npm run dev -- --host 127.0.0.1`

Verify: upload two PDFs, draw a different field on each, change a value, click Export, and confirm the downloaded file has both document sections. Check a desktop and mobile viewport.

```bash
git add src/styles.css README.md src/App.test.tsx
git commit -m "feat: finish responsive PDF extraction workspace"
```
