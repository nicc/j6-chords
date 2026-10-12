# J-6 reference data

Source: Roland J-6 Owner's Manual v1.02 (Chord Set List p.25–33, Phrase List p.34).

## Files
- `chord-sets.json`: all 100 chord sets. Each set has 12 chords, one per key, C to B.
- `styles.json`: the 9 styles and their 12 variations.
- `genres.json`: a short description of each genre label and which sets it covers.

## chord-sets.json fields
- `key`: the keyboard button (C, C#, D … B).
- `chord`: the chord name in standard syntax.
- `notes`: the notes the manual lists, low to high (C4 = middle C).
- `manual`: only present when I changed the name's meaning, not just its spelling. It shows the manual's original name.
- `flag`: something in the manual looks wrong or doesn't add up. Notes are never changed; flags explain the doubt.
- Set-level `flag` / `note`: applies to the whole set (set 59 has a flag; set 88 has a note).

## Naming conventions
- `maj7` = major 7th (the manual writes `M7`), `m7` = minor 7th, `7` = dominant 7th.
- `dim` / `dim7` / `m7b5` = diminished / diminished 7th / half-diminished. `aug` = augmented.
- `sus2` / `sus4` = 3rd replaced by the 2nd / 4th. `add9` = triad plus 9th, no 7th.
- Extensions in brackets: `7(13)`, `maj7(#11)`, `m7(b13)`. `(no3)` = no 3rd.
- `/X` = X is the bass note.
- Sets 14–16 are two-note intervals: `C (oct)`, `C (4th)`, `C5` (power chord).
- Sharps and flats are kept as the manual prints them, so some sets use Bb and others A#.

## What was checked
- Every note and name was extracted from the PDF's text with two different PDF tools, which agreed exactly, and every set was compared by eye with the page image.
- Every chord name was checked against its notes. Where the notes clearly spell a different chord, `chord` is corrected and `manual` keeps the original. Where it's unclear, the name is kept and `flag` says why.
- Some manual names leave out an extension (for example `Dm9` with no 7th in set 85). Those are left as printed unless the notes contradict them.
