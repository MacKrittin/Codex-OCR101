# Export SI Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename export to Export SI form and log field key/value data in the console.

### Task 1: Console output

- [ ] Write a failing FieldsPanel test for the Export SI form button label.
- [ ] Run the focused test and verify failure.
- [ ] Rename the button and replace the App download callback with `console.log(Object.fromEntries(active.fields.map(...)))`.
- [ ] Re-run tests, build, commit `feat: log SI form export`, and push master.
