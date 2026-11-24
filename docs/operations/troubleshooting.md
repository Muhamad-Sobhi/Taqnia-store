# Troubleshooting

- **Purpose:** Provide first-response guidance for development and cPanel issues.
- **Audience:** Developers and store operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Deployment runbook](deployment-runbook.md), [Hosting and deployment](../architecture/hosting-and-deployment.md), [Error handling](../engineering/error-handling-and-logging.md)

| Symptom                                                            | First checks                                                                                                                                                                                                                 |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App does not start in cPanel                                       | Confirm selected Node version, app root, startup command, `PORT`, production dependencies, build output, and app-manager logs. Do not change the WordPress site.                                                             |
| Store subdomain shows WordPress or a directory listing             | Verify the subdomain mapping and independent document root with GoDaddy; do not edit the corporate site's root or `.htaccess` as a workaround.                                                                               |
| Database connection fails                                          | Check host/port (`localhost:3306` per GoDaddy cPanel guidance), database name/user, grants, secret configuration, account connection limits, and whether the app runs in the same cPanel environment.                        |
| Build fails on `sharp`                                             | Remove the assumption of native optimization; use pre-optimized image assets and the documented unoptimized fallback.                                                                                                        |
| Migration fails                                                    | Stop and inspect the database backup, current migration state, and logs. Never edit an applied migration or blindly rerun production writes.                                                                                 |
| Locale page throws `isLocale is not a function` during development | Restart using `npm run dev` (the project script uses Webpack to avoid the observed Turbopack dev-runtime failure). Stop the prior dev server first; only remove `.next/dev` after all dev servers for this app have stopped. |
| Login or registration reports incomplete server configuration      | Copy `.env.example` to `.env`, set valid local MySQL credentials and a random `SESSION_SECRET`, then run the reviewed migrations and development seed. Do not use the example password as a real credential.                 |
| Customer cannot see order                                          | Check authenticated customer ownership and order state; do not broaden permissions to fix a single account.                                                                                                                  |
| Transfer payment is pending                                        | Admin must review through the agreed communication channel and record verification; screenshot upload alone is not a paid state.                                                                                             |
| Admin action is denied                                             | Verify server-side role assignment and audit context; do not rely on UI visibility as authorization.                                                                                                                         |

Do not paste secrets, complete personal data, or payment evidence into tickets or logs.
