# Export SI form console output

## Goal

Rename the export action to Export SI form and expose the active document field values in the browser console.

## Behavior

Clicking Export SI form logs one plain object where each field name is a key and its current text is the value. The action no longer downloads a text file.

## Test

Verify the visible button label and that its callback can be invoked.
