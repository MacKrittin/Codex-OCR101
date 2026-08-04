# Crop box deletion

## Goal

Let a user remove one unwanted crop area without removing its field or any other crop areas.

## Interaction

Each rendered crop box contains an accessible cancel button in its top-right corner. The button is hidden until the crop box is hovered or receives keyboard focus. Selecting it prevents the canvas drawing handler from running and removes only the matching crop.

## Data flow

`PdfCanvas` reports the crop identifier and field identifier. `App` removes that crop from the corresponding field, rebuilds the field value from the remaining crops, and returns the field to `idle` if no crops remain or `ready` otherwise.

## Error handling and tests

The handler is a no-op when the requested field or crop is absent. A component test verifies that activating the cancel button reports the expected field and crop identifiers.
