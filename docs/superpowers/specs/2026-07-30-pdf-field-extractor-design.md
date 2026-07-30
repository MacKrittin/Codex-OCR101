# PDF Field Extractor — Design

## Goal

Provide a private, browser-only web application for extracting named text fields from one or more PDF files. Users upload PDFs, define individual fields by drawing a rectangular area on a page, review the extracted text, and export the results as a `.txt` file.

## Scope

- Accept multiple PDF uploads in one session.
- Keep each PDF's fields independent; fields are never shared automatically between files.
- Render PDF pages in the browser with page navigation and zoom.
- Let users add a named field, draw, move, resize, rename, and delete its crop rectangle.
- Extract embedded PDF text that overlaps the crop rectangle.
- When embedded text is unavailable, run browser-side OCR only on the cropped image region.
- Allow editing extracted values before export.
- Export a UTF-8 text file grouped by source filename and then field name.

## Non-goals

- No server, accounts, cloud storage, database, or upload of document content outside the browser.
- No reuse of fields across different uploaded PDFs in this release.
- No full-document OCR pass; OCR occurs only when a selected crop lacks embedded text.
- No CSV, Excel, or JSON export in this release.

## Interface

The screen uses a three-column editor layout.

1. **Document rail (left):** upload button, uploaded PDF list, active-document state, and page count.
2. **PDF canvas (center):** selected page rendered at a controllable zoom; navigation controls; a transparent annotation layer that captures drag-to-draw and displays labeled crop rectangles.
3. **Fields and results (right):** add-field control, selected document's field list, editable extracted values, and export button.

The primary workflow is: upload → select document and page → add a field name → drag a crop → inspect or correct the value → repeat → export.

## Data model

All state is in memory for the active browser session.

- `Document`: id, filename, PDF bytes, page count, and `fields`.
- `Field`: id, name, page number, normalized rectangle (`x`, `y`, `width`, `height`), extracted value, and extraction state (`idle`, `extracting`, `ready`, `error`).

Normalized coordinates preserve each crop's location while zoom changes. A field belongs to exactly one document and one page.

## Extraction flow

1. On crop completion, map the normalized rectangle to PDF coordinates.
2. Read embedded text items from the chosen page and retain items intersecting the rectangle; sort them in reading order and join into the field value.
3. If no embedded text is found, render only the cropped region to an offscreen canvas and send it to a client-side OCR worker.
4. Save the result to the field, show its state, and permit manual correction.

All document parsing, rendering, cropping, and OCR remain in the browser.

## Error handling

- Reject non-PDF uploads with a visible message.
- Show field-level extraction errors without blocking other fields or files.
- Disable export when there are no extracted fields, explaining why.
- Preserve manually edited results when users switch document, page, or zoom.

## Testing

- Unit tests cover coordinate normalization, text-region selection/order, text export formatting, and field/document state changes.
- Component tests cover adding a field, creating a crop, editing a result, and switching documents without cross-file field leakage.
- Browser QA validates multiple upload, page selection, crop manipulation, embedded-text extraction, export download, and responsive layout.

## Acceptance criteria

- A user can upload at least two PDFs and create distinct fields in each.
- A user can draw a rectangle on a selected page and see a named field with an extracted or editable value.
- An image-only PDF activates browser-side OCR only for the chosen crop.
- Export creates one `.txt` file containing all extracted values organized by filename and field name.
- No server endpoint is required or contacted for document processing.
