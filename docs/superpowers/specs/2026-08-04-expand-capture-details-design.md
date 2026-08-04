# Expandable Capture Details panel

## Goal

Allow users with many extraction fields to temporarily widen the Capture details panel without leaving the PDF workspace.

## Interaction

An accessible toggle in the Capture details header expands the right panel from 330px to 520px. Activating the same toggle returns it to the default width. The PDF workspace automatically uses the remaining width.

## Responsive behavior

The control changes only desktop grid widths. Existing tablet and mobile layouts keep the panel below the workspace, so the PDF remains usable.

## State and tests

`App` owns a session-only boolean expansion state and adds a class to the application shell. A component-level test verifies that activating the toggle switches its accessible label and reports the next expansion state.
