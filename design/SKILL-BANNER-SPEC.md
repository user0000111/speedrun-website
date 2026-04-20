# Skill Banner Generation SOP
**Speedrun AI Labs — Internal Reference**
*Not for distribution. This file is excluded from the public website via .vercelignore.*

---

## Character Reference
**The Speedrun Bird** — metallic cyborg avian speedrunner.

Full visual spec: see `Speedrun_AI_Labs_Master_Spec_V1.pdf` in this folder.

Key attributes (non-negotiable):
- Material: brushed silver chrome/metal with anisotropic reflections
- Lighting: high-key white from above + internal blue/copper-glow pulses
- Pose: mid-stride profile run, forward-leaning, right-to-left orientation
- Accessories: semi-translucent purple/blue tech goggles, bionic fist with glowing circuitry (left arm), metallic clipboard + pen (right hand)
- Background: navy-blue tech gradient with data-swirl light lines
- FX: trailing digital pixels (blue/copper) + motion blur lines

---

## Generation Model
**Model:** `google/gemini-3-pro-image-preview` via OpenRouter

**No substitutions. No flash variants. No other Gemini versions.**

If this model is unavailable, stop and escalate to Addy — do not fall back to another model.

---

## Generation Method — REFERENCE IMAGE TECHNIQUE (NON-NEGOTIABLE)

**Do NOT use the text-only master prompt alone. Always use the reference image technique.**

The correct method (discovered 2026-04-11 by Addy):
1. Take an existing approved banner (e.g. `skill-no-slop.png`) as the reference image
2. Send it to Gemini with this prompt:

```
I need this image file 100% replicated with one change: on the clipboard where it says [EXISTING_TEXT],
I need that text replaced with "[INSERT_TEXT]"
```

Replace `[EXISTING_TEXT]` with what's currently on the clipboard (e.g. `WRITING`).
Replace `[INSERT_TEXT]` with the new skill text in ALL CAPS (e.g. `RBW SKILL`).

**Why this works:** Gemini replicates the exact pose, material, lighting, and composition from the reference. Text-only prompts produce standing poses and wrong character proportions.

**Reference image to use:** `images/skill-no-slop.png` (approved Writing banner — canonical reference)

---

## Master Prompt Template (fallback only — if no reference image available)

```
A high-resolution, 3D digital render of the precise metallic cyborg speedrunner bird character,
identical in pose and brushed chrome material. All details (purple-blue goggles, bionic fist
circuitry, and colorful pixels) must be preserved without variance. Centered on the metallic
clipboard, render the text '[INSERT_TEXT]' in all-caps, black, clear sans-serif font, mapped flat
to the surface. Frame the full character with small top/bottom gaps.
```

Replace `[INSERT_TEXT]` with the skill name in **ALL CAPS**.

Examples: `WRITING`, `DEEP AUDIT`, `WEATHER`, `MEMORY`

---

## QA Checklist (every banner — no exceptions)

### Step 1 — Watermark Scan
Pixel-scan the bottom-right 200×200px for Gemini's sparkle watermark (bright pixels on a dark background).

```python
from PIL import Image
img = Image.open('banner.png').convert('RGBA')
w, h = img.size
for y in range(h - 200, h):
    for x in range(w - 200, w):
        r, g, b, a = img.getpixel((x, y))
        if r > 60 or g > 70 or b > 90:
            # Watermark detected — paint over with sampled background colour
            img.putpixel((x, y), (10, 14, 30, 255))  # approx dark navy bg
img.save('banner-clean.png')
```

### Step 2 — Independent Validation
**Validator model:** `qwen/qwen3-vl-235b-a22b-thinking` via OpenRouter

Never use Gemini to validate Gemini output. Never use Claude to validate Claude output.

Validation prompt:
```
Rate this skill banner 1–10. Check:
1. Text is visible and perfectly centered on the clipboard surface
2. Character matches spec: chrome bird, purple-blue goggles, bionic fist, clipboard + pen
3. No watermarks, artefacts, or visual noise
4. Text follows clipboard perspective (flat-mapped to surface, not floating)
5. Overall production quality — would this look professional on a public website?

Score each criterion 1–10 and give an overall score.
```

### Step 3 — Approval Gate
- Qwen overall score must be **≥ 8/10**
- Addy must approve via Telegram before the banner is committed to the repo

If Qwen scores < 8, regenerate. Do not ask Addy to review a substandard banner.

---

## Critical Rules

**Never use PIL/Pillow to overlay text on 3D renders.**
Text must be rendered INTO the scene by Gemini using the master prompt above.
PIL text on a 3D surface looks flat, misaligned, and unprofessional.

**Never skip the watermark scan.**
Gemini adds a sparkle watermark to generated images. It must be removed before any banner goes live.

**Never substitute the generation model.**
The character fidelity depends on Gemini 3 Pro specifically. Other models produce drift.

---

## Output Specifications

| Property | Value |
|----------|-------|
| Format | PNG |
| Dimensions | Gemini native output (do not resize) |
| Location in repo | `images/skill-[slug].png` |
| Naming convention | `skill-[skill-name-lowercase-hyphenated].png` |

Examples: `skill-deep-audit.png`, `skill-no-slop.png`, `skill-weather.png`

---

## New Skill Launch Checklist

Every new skill repo MUST include on first commit — no exceptions:
- [ ] `SKILL.md` — the skill content
- [ ] `README.md` — origin story, problem, install instructions, site link, Skill Library cross-links
- [ ] `LICENSE` — copy from any existing Speedrunlab repo (MIT, copyright Speedrun AI Labs Pty Ltd)

GitHub shows "MIT License" in repo listings only when a `LICENSE` file exists. Missing it looks unprofessional.

---

## Existing Banners

| Skill | File | Status |
|-------|------|--------|
| Hermes | `images/skill-hermes.png` | Live ✅ |
| Deep Audit | `images/skill-deep-audit.png` | Live ✅ |
| No-Slop Writing | `images/skill-no-slop.png` | Live ✅ |
| Read-Before-Write | `images/skill-read-before-write.png` | Live ✅ |
