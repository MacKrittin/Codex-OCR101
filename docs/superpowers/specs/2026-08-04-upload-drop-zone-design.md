# Upload button drop zone

## Goal

Allow users to drop one or more PDF files directly onto the Upload PDF button.

## Behavior

The button becomes a drop target during file drag-over and displays `Drop PDF here`. On drop, it filters for PDFs and forwards the accepted `FileList` to the existing upload handler. Normal click-to-select behavior remains unchanged.

## Tests

A component test simulates dropping a PDF and verifies the upload handler receives it.
