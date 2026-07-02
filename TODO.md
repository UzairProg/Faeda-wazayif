# TODO

- [x] Inspect blueprint routes in `core.py`, `customers.py`, `companies.py`, `jobs.py`.
- [ ] Update `templates/new_design/index.html` navigation/button links to use correct endpoints:
  - Replace `href="#"` with `url_for(...)` for routes that exist.
  - Replace hardcoded paths only if they correspond to existing blueprint endpoints.
  - If route does not exist (e.g., team/team creation endpoints not defined in these blueprints), keep `href="#"` and add comment ` next to it.
- [ ] Run a quick sanity check (search for remaining `href="#"` in `index.html`).

