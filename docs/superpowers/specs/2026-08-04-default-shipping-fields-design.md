# Default shipping fields

## Goal

Give every newly uploaded PDF a ready-to-use set of common shipping extraction fields.

## Behavior

On successful upload, the document receives these empty fields in this order: Shipper, Consignee, Notify Party, Description of Goods, Shipping Marks, Total, Weight. Each field begins in idle status with no crop areas or extracted value.

## Scope

The fields are only assigned to newly uploaded documents. Users may rename, delete, or add fields as before. Existing uploaded documents are unchanged.

## Tests

A unit test verifies the factory returns the seven names in their required order and gives each field a unique id with idle, empty extraction state.
