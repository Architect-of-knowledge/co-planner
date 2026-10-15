# Example: the first co-planner run (a web DAW, 2026-10-14)

The project: Creation Studio, a private browser DAW with a strong sound engine, about thirty instruments and effects, a desk of floating windows, and AI tools. The user's request, shortened: *"The DAW is a collection of components; we need to turn it into a real DAW. I should be able to make kick and bass patterns as blocks on the playlist and open the instrument easily. Amazing foundation, but the UI makes it impossible to make a song by hand. What else do I need for a better workflow?"*

## The map found the real cause

Three read-only search agents walked the journey "add a kick and a bass, make a pattern for each, arrange them". The friction list had ten items. Here are six, each with `file:line` evidence:
- new patterns belonged to no instrument;
- "New" in the piano roll put its clip at the end of the first lane, whatever lane you meant;
- four instruments started with no clip at all;
- picking a pattern opened yet another roll window;
- the playlist refused instrument drops;
- clicking a lane header renamed it by accident.

The cause behind all of them: **nothing shared a "selected channel" or "selected pattern"**, so every window guessed its own target. The map suggested where to investigate because it detected no common store; tracing the handlers established the missing shared selection. A heuristic map alone cannot prove the absence of other handoff mechanisms.

## How the rounds compounded

| Round | Asked | What the user's answer and **note** did |
|---|---|---|
| 1 | Lane model: instrument-bound lanes (recommended), merged tracks, or keep free lanes | Picked the recommendation, but the note said *"I want to keep it FL, but working; what do you suggest?"* That overturned the pick: the plan kept FL Studio's universal playlist |
| 2 | Which fixes ride on a shared selection; a soft "home channel" per lane; one verb set for clicks and AI | Took only the selection, and the note asked *"that aligns with my Background Studio routing concept, am I wrong?"* (the user's own earlier design: one source patched to many targets). The answer: yes, the selection is a routing signal for focus |
| 3 | The consumers of the selection; which windows listen (a **spread** over the real window list); pins | *"When you are right, you are right"*: took all the consumers. Notes added two new requests: right-click menus that know what's under the cursor, and hotkeys |
| 4 | One registry feeding five surfaces (right-click, menu bar, palette, hotkeys, AI verbs); FL hotkeys; hum-to-roll; the wave's size | Accepted. The note asked *"anything else to simplify?"* |
| 5 | Extras that each removed a found dead end; four proposed **design rules**; the held queue | All accepted. A note reported 0.3–0.5 s of MIDI keyboard lag, so round 6 traced it: a 400 ms render-ahead buffer plus the browser's output latency |
| 6 | How far to go on latency; how to split the parallel work | Chose the full fix plus a system audio setting, and asked for the downside, which was answered before the plan |

## 3rd knowledge that came up

- **Shared verbs** (A): the user's dream of telling the AI *"duplicate these 8 bars, add a riser, no bass on the last four sixteenths"* needs the same musical verbs as the new right-click menus. If every gesture is a named command, the AI and the person use one verb set, and every AI edit stays editable by hand.
- **The keys play the selected channel, already monitored** (A): the selection plus the controller's existing "wanted track" plus the engine's low-latency monitoring. FL's behaviour and most of the latency fix, for almost nothing.
- **Hum into the selected clip** (B): the existing microphone input plus the existing pitch-to-notes code plus the selection.

## The plan

- Wave 1: four contracts (a lane's soft home channel, three clip commands, the selection and keymap in the workspace, the verb table), then four parallel lanes with non-overlapping files, a latency task, and a merge gate.
- Every task had a done-when and one focused test.
- Four design rules were accepted for all future windows: shared verbs, one registry for five surfaces, the selection bus, and "starts usable".

## What the run taught the skill

Four fixes went into co-planner the same day:
- **No round before the map.** Round 1 had gone out early and recommended the wrong lane model.
- **The mandatory tally line.** It had been skipped.
- **A size gate.** Wave 1 grew from one item to about twelve without a cut question.
- **A review round after each wave**, so taste also learns from real use.

## Version note

This records the original 0.1 workflow. Version 0.2 uses explicit readiness checks, proportionate question rounds and scoped context instead of mandatory percentage tallies or fixed lane sizing. The original lessons still motivate inspecting evidence before recommending implementation changes.
