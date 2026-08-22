# Security

## Permission summary

- No filesystem access.
- No network access.
- No command or subprocess execution.
- No credentials, accounts, or device access.
- No DSH Profile lifecycle changes or restart operations.
- Browser-only bounded `localStorage` for custom pages, multi-page/location assignments, unified ordering, favorite IDs, and built-in icon assignments.
- Built-in React-created line SVGs only; no remote icon font, image, stylesheet, or script.
- Read-only inspection of public DSH Client slot metadata.
- User-triggered activation of an existing control inside the current official settings dialog; the floating launcher may first activate the existing official Settings trigger after the same explicit click.
- Additive plugin-owned `settings.section`, `settings.plugins.tab`, and `shell.overlay` entries only.

## Data limits

- At most 64 favorite IDs.
- At most 128 icon assignments, each restricted to the 14 built-in icon IDs.
- At most 12 custom pages with 32-character labels, 128 item-to-page assignments, 128 assignments per bounded location list, and 256 ordered item IDs.
- Stored JSON is rejected above 32 KiB.
- IDs are capped at 128 characters; display labels at 160 characters; search at 80 characters.
- Malformed or unavailable storage degrades to empty in-memory preferences; denied writes keep the editor open and report that saving failed.

## Prohibited behavior

The plugin must never hide, move, wrap, clone, replace, or inject icons into shipped/third-party settings navigation entries. It may add and later dispose only its own entries through documented list slots. It must not register a Host route; use Loader/Fiber mutation APIs; import Host/Node modules into the Client; or log private settings data.

## Reporting

Report security issues privately to the repository owner before public disclosure. Do not include real Profile files, credentials, or private paths in a report.
