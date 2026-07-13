# Troubleshooting

## `No track module registered for type`

The track store validates each track through the module registry. Add the module to `createTrackStore({ modules })` before using tracks of that type.

## Duplicate track IDs

Track IDs must be unique. Use stable IDs when loading saved sessions or catalog selections; do not generate a new ID on every render unless you are intentionally creating a new track.

## Browser state resets

Create browser and track stores outside the component render path or inside a stable initialization boundary. Recreating stores resets region, order, settings state, and track data coordination.

## Track does not render after changing config

Check the mutation result from `updateConfig`, `updateBase`, or `addTrack`. Failed mutations return `{ ok: false, error }` and leave the current track state unchanged.

## Package docs and examples

Examples use `YOUR_URL_HERE` for track URLs. Replace it with a real BigWig, BigBed, or service URL that matches the module you are using.
