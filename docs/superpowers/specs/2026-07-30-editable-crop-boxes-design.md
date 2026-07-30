# Editable Crop Boxes — Design

## Goal

Allow users to create a named field before drawing its PDF area, then select that field to create or edit its crop box.

## Interaction

1. `Add field` creates a field immediately with no crop rectangle and selects it.
2. Selecting an unplaced field activates draw mode for that field; dragging on the current page assigns its first rectangle.
3. Selecting a placed field highlights its rectangle. Dragging the interior moves it; dragging one of four visible corner handles resizes it.
4. Releasing a modified rectangle persists normalized coordinates and reruns extraction for that field only.
5. A field remains associated with its selected document and page; changing a crop does not affect any other field.

## UI states

- Unplaced fields show `Click to place` in the field list.
- The selected field has a distinct card border and its crop box has a stronger outline.
- Editing reveals corner handles and a short instruction beneath the PDF.
- Extraction shows `Reading…` during an update, then returns to `Ready` or a field-level error.

## Testing

- Field creation produces an unplaced field before any crop exists.
- Selecting an unplaced field enters placement mode.
- Updating a crop sends new normalized coordinates for only the selected field.
- The existing export and document-isolation behaviours remain intact.
