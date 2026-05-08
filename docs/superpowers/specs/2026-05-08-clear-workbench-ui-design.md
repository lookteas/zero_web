# Clear Workbench UI Design

## Context

Zero is a small personal site for the core loop of login/register, daily check-in, awareness records, and review reminders. The current UI already has a soft green card-based style and the main product flows are working. This design should polish the front-end experience without rebuilding page structure or expanding into low-priority areas.

The selected visual direction is "Clear Workbench": calmer, clearer, and more practical for writing and reviewing. It keeps the existing warm personal tone, but moves the surfaces slightly toward cleaner cyan-green accents, lighter depth, and more consistent form hierarchy.

## Goals

- Make the core pages feel like one coherent product surface.
- Improve readability and input comfort on mobile and desktop.
- Reduce visual heaviness from repeated borders, shadows, and decorative hero treatments.
- Keep the site personal, quiet, and focused rather than marketing-like.
- Make interactive states easier to see for mouse and keyboard users.

## Non-Goals

- Do not rebuild authentication, daily check-in, awareness records, or review logic.
- Do not introduce a new component library, animation system, routing structure, or design token framework.
- Do not redesign vote, discussion, or admin pages unless a shared style change naturally affects them.
- Do not replace page copy wholesale.
- Do not delete or rewrite core route files.

## Scope

Primary scope:

- `/` home
- `/today`
- `/logs`
- `/reviews`
- `/login` only for small consistency adjustments

Shared scope:

- `src/app/globals.css` design tokens and reusable visual utilities
- existing shell, buttons, cards, form fields, and feedback chrome where needed

## Visual Direction

The interface should keep the existing green foundation but shift toward a clearer cyan-green workbench feel:

- Backgrounds become cleaner and less creamy.
- Primary accents stay green but can pick up a cooler teal/cyan edge.
- Cards keep softness, but shadows become lighter and more consistent.
- Form modules use clear separation between prompt, input, and action zones.
- Hero graphics stay subtle and should not compete with the daily writing workflow.

Recommended color movement:

- Primary: keep near the current green, slightly cooler where useful.
- Support accent: introduce controlled cyan/teal only in hero glows, field accents, and secondary surface hints.
- Text: keep strong dark blue-green for contrast.
- Background: use pale mint/cyan whites, not saturated blue or lavender.

## Page Behavior

### Home

Home should remain a calm entry point. Keep the current hero and status structure, but tighten the visual relationship between the hero and the data cards so the first screen reads as one dashboard rather than separate decorative blocks.

Expected improvements:

- Status cards should look like compact dashboard instruments.
- Primary action for today's task should remain obvious.
- Decorative orbit/glow treatment should be lighter if it distracts from content.

### Today

Today is the most important workflow. It should feel like a writing workbench with three clear fields and a low-friction submit path.

Expected improvements:

- The topic card, form panel, and share panel should have consistent shell styling.
- Field modules should be visually distinct but not overly colorful.
- Save and submit actions should feel stable and reachable on mobile.
- Submitted/editable states should remain clear.

### Logs

Awareness records should feel immediate and light. The page should invite quick capture, not heavy journaling.

Expected improvements:

- The current cyan-leaning hero can remain, but should align with the shared clear workbench tone.
- Topic relationship and input sections should use consistent panel headers.
- Recent records should be scannable with less visual noise.

### Reviews

Reviews should feel warmer than logs but still part of the same system. Recovery review states may keep a restrained amber accent.

Expected improvements:

- Review cards should better separate task context from writing inputs.
- Recovery accents should be visible without making the whole page feel like a warning.
- History link and pending count should remain easy to find.

### Login

Login should match the clearer surface language but remain simple.

Expected improvements:

- Keep the existing hero/form composition.
- Reduce mismatch between login card styling and app workbench cards.
- Preserve clear login/register actions.

## Components And Styling

Prefer small local improvements to existing components:

- `src/components/app-shell.tsx`: keep structure; adjust only spacing or surface consistency if needed.
- `src/components/primary-button.tsx`: ensure hover, active, and focus-visible states are consistent.
- `src/components/form-field.tsx`: preserve associated labels; improve focus ring and input comfort.
- `src/components/section-card.tsx` and page-local shell components: align radius, border, and shadow usage.
- Page hero classes in `src/app/globals.css`: tune color, density, and motion rather than replacing them.

Avoid adding abstractions unless they remove clear duplication in the touched code. If a helper is introduced, it should stay small and match existing local patterns.

## Accessibility And Responsive Requirements

- Inputs must keep labels or equivalent accessible names.
- Focus-visible states must be obvious on links, buttons, radio options, summaries, and form controls.
- Clickable elements should have pointer cursor and stable hover states.
- Mobile width around 375px must not horizontally scroll.
- Text must fit inside buttons and cards.
- Motion should remain subtle, and existing animated hero elements should respect reduced motion if practical in the implementation pass.
- Contrast should stay strong enough for body text and controls in light mode.

## Testing And Verification

Minimum verification after implementation:

- Run relevant source-level tests for touched pages/components.
- Run `npm run lint`.
- Run `npm run build` if changes touch shared app structure or several pages.
- If a dev server can be started, inspect the core pages at mobile and desktop widths.

Known project note: `npm run check:text` may have existing baseline warnings. Run it when practical, but do not expand this UI task into unrelated encoding cleanup.

## Implementation Constraints

- Use UTF-8 for all changed files.
- Keep changes local and incremental.
- Do not rewrite entire route files.
- Do not modify backend behavior.
- Update `../../docs/next-session.md` before finishing if implementation changes code or page state.
