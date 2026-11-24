# Glossary

- **Purpose:** Establish consistent meanings for store, operations, and engineering terms.
- **Audience:** Taqnia stakeholders, developers, and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](project-brief.md), [Data model](../architecture/data-model.md), [Store API](../api/store-api.md)

| Term               | Definition                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Administrator      | Authorized staff member who manages catalog, orders, payments, shipping, settings, and content.                                      |
| Attribute          | A named technical characteristic whose values may vary by category, such as Wi-Fi standard, wavelength, or port count.               |
| Cart               | A temporary or authenticated collection of product quantities selected for purchase.                                                 |
| COD                | Cash on Delivery; payment is due when the order is delivered.                                                                        |
| Customer           | Registered user permitted to manage their profile, addresses, cart, and own orders.                                                  |
| EGP                | Egyptian Pound, the only version 1 currency.                                                                                         |
| Guest cart         | A temporary cart associated with a browser/session before a customer authenticates.                                                  |
| Inventory movement | Auditable record of a stock adjustment, receipt, reservation, or sale.                                                               |
| Minor unit         | Smallest currency unit used for exact money arithmetic. Prices and totals are integer minor units, never floating point.             |
| Order              | A submitted purchase record belonging to an authenticated customer and containing immutable item-price snapshots.                    |
| Payment reference  | Customer- or administrator-provided identifier for a payment transfer; it does not itself establish that payment cleared.            |
| SKU                | Stock Keeping Unit; a merchant-assigned identifier for a product or sellable variant.                                                |
| Variant            | A distinct purchasable option of a product, such as a model, length, or color, with its own SKU and potentially its own price/stock. |
| Verification note  | Internal administrator record explaining a manual payment review or status change.                                                   |
