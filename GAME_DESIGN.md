# ROAD ECHO — Game Design

## Design pillar
The player's own history is the opponent.

## Run progression
1. Run 1 records the player's route.
2. Run 2 introduces the first Echo from the saved route.
3. Run 3 introduces additional Echo generations and stronger memory events.
4. Later runs continue replaying the player's history rather than replacing it with conventional AI.

## Systems
- Vehicle physics: acceleration, braking, grip, momentum and vehicle-specific handling.
- World: reusable 3D highway segments, roadside scenery and procedural landmarks.
- Traffic: pooled vehicles with lane positions and different speeds.
- Echo: timestamped position, heading, speed and braking samples with interpolation.
- Memory events: shards, gates and Phase Shift feedback.
- Atmosphere: time-of-day lighting plus clear/rain/fog/storm weather.
- Persistence: best score, selected car, audio preference and up to three Echo routes.
