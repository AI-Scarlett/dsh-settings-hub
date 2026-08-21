# Security

## Permission summary

- No filesystem access.
- No network access.
- No command or subprocess execution.
- No credentials, accounts, or device access.
- No DSH Profile lifecycle changes or restart operations.
- Browser-only bounded `localStorage` for favorite IDs and built-in icon assignments.
- Built-in React-created line SVGs only; no remote icon font, image, stylesheet, or script.
- Read-only inspection of public DSH Client slot metadata.
- User-triggered activation of an existing control inside the current official settings dialog.

## Data limits

- At most 64 favorite IDs.
- At most 128 icon assignments, each restricted to the 14 built-in icon IDs.
- Stored JSON is rejected above 32 KiB.
- IDs are capped at 128 characters; display labels at 160 characters; search at 80 characters.
- Malformed, unavailable, or denied storage degrades to empty in-memory preferences.

## Prohibited behavior

The plugin must never hide, move, wrap, clone, replace, or inject icons into official settings navigation; register a Host route; use Loader/Fiber mutation APIs; import Host/Node modules into the Client; or log private settings data.

## Reporting

Report security issues privately to the repository owner before public disclosure. Do not include real Profile files, credentials, or private paths in a report.
