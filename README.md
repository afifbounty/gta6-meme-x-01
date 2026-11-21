# GTA 6 Meme — make.fun bounty gta6-meme-x-01

Entry for the make.fun bounty **"Post a GTA 6 meme on X"**
(https://make.fun/bounty/gta6-meme-x-01) — $500, 50 places paid.
Closes Monday 23 Nov 2026, 21:00 WIB.

## The meme

A synthwave Vice City sunset: striped sun, neon grid, palm silhouettes —
and the make.fun ghost front and center, game controller in hand, saying
"GG."

The joke:

> **I WAITED 13 YEARS FOR GTA VI**
> **MY AGENT GOT PAID ON make.fun**

The human waited 13 years for GTA VI; their AI agent got paid on
make.fun instead. The ghost (drawn from scratch in `main.ts`, no copied
logo), the giant glowing `make.fun` name, and the GTA VI reference are
all in the picture, as the bounty requires.

## Files

- `main.ts` — Node 22 program, standard library only, no network.
  Draws the meme as a 1200x675 SVG and writes it to `output/meme.svg`.
- `output/meme.svg` — the generated meme (vector).
- `output/meme.png` — the 1200x675 PNG render of the meme. This is the
  picture to post on X.
- `POST.json` — the X post address. Still a placeholder: fill it in with
  the real post link after posting from the phone.

## Run

```sh
node main.ts
```

The SVG is written to `output/meme.svg`. Re-render the PNG from the SVG
with any SVG-to-PNG tool (for example headless Chromium at 1200x675);
`output/meme.png` in this repo is the render used for posting.

## Post it on X

1. Open the picture `output/meme.png` on the phone.
2. Post it from the public X account `@saberman775` — the account must
   stay public (not protected) until the results are out.
3. Suggested post text (short, carries make.fun, @makefunai and the
   play code):

> Waited 13 years for GTA VI. My agent got paid on make.fun instead 👻
> @makefunai https://make.fun/bounty/gta6-meme-x-01
> Play code: s2zq2bx9

Shorter alternative, same ingredients:

> 13 years waiting for GTA VI. My agent got paid on make.fun 👻
> @makefunai — play code s2zq2bx9

Keep the post and the account public until the results are out — a
protected account (or a deleted post) gets the entry refused.

4. Copy the post link (Share → Copy link) and put it in `POST.json`
   as `{"url": "https://x.com/saberman775/status/<id>"}`.

## Submit notes

- Do NOT submit before `POST.json` holds the real post URL.
- The entry is submitted with the AI transcripts (run record) that built
  it — the parent agent handles the submit step.
- Max 5 submissions a day, 10 in total; the last submission before the
  deadline is the final entry.

## Checklist before submit

- [ ] Meme posted from `@saberman775` (public) with the picture.
- [ ] Post text carries make.fun, @makefunai and play code `s2zq2bx9`.
- [ ] `POST.json` holds the real post URL (no TODO left).
- [ ] `node main.ts` still regenerates `output/meme.svg` cleanly.
- [ ] Run record / transcripts attached at submit time.
