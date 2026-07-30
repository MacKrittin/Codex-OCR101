# PDF Field Extractor

Upload one or more PDFs, name a field, then draw the exact region to capture. Text embedded in a PDF is read locally; image-only crops use local browser OCR. Files never leave the browser.

## Run

Use the bundled Node runtime if Node is not installed on your PATH. Install dependencies with `pnpm install`, then run `pnpm dev` and `pnpm test --run`.

OCR starts only for image-only selected regions and may take longer for large or low-resolution crops.
