# Manual Tracklists

Since the Mixcloud public API doesn't expose tracklist data (even when tracklists are visible on their website), this project includes a system for manually adding tracklists to your mixes.

## How It Works

1. Tracklist data is stored in `src/_data/tracklists.json`
2. Data fetchers automatically merge manual tracklists with API data at build time
3. The mix player component displays tracklists when available
4. Tracklists appear as a collapsible section below the player

## Adding a Tracklist

### Step 1: Get the Cloudcast Slug

The slug is the unique identifier from the Mixcloud URL. For example:
```
URL: https://www.mixcloud.com/legendarymusic/the-afro-groove-library-the-groove-library-vol-1/
Slug: legendarymusic/the-afro-groove-library-the-groove-library-vol-1
```

### Step 2: Add to tracklists.json

Edit `src/_data/tracklists.json` and add your tracklist:

```json
{
  "legendarymusic/the-afro-groove-library-the-groove-library-vol-1": [
    {
      "position": 1,
      "artist": "Artist Name",
      "track": "Track Name"
    },
    {
      "position": 2,
      "artist": "Another Artist",
      "track": "Another Track"
    }
  ]
}
```

### Step 3: Optional - Add Start Times

If you know the start times (in seconds), you can add them:

```json
{
  "legendarymusic/your-mix-slug": [
    {
      "position": 1,
      "artist": "Artist Name",
      "track": "Track Name",
      "start_time": 0
    },
    {
      "position": 2,
      "artist": "Another Artist",
      "track": "Another Track",
      "start_time": 245
    }
  ]
}
```

### Step 4: Rebuild

The tracklist will appear automatically after the next build:

```bash
npm run build
# or
npm run dev
```

## Tracklist Format

Each track in the tracklist array must have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `position` | number | Yes | Track number in the mix |
| `artist` | string | Yes | Artist name |
| `track` | string | Yes | Track title |
| `start_time` | number | No | Time in seconds when the track starts |

## Example: Complete Tracklist

```json
{
  "legendarymusic/example-mix": [
    {
      "position": 1,
      "artist": "Awa Khiwe",
      "track": "Gounass",
      "start_time": 0
    },
    {
      "position": 2,
      "artist": "Amandla And Django",
      "track": "Degrees Of Freedom",
      "start_time": 245
    },
    {
      "position": 3,
      "artist": "Ahmed Ben Ali",
      "track": "Jana",
      "start_time": 512
    }
  ]
}
```

## Tips

1. **Finding Track Times**: Listen to the mix on Mixcloud and note when each track starts
2. **Copy from Mixcloud**: If the tracklist exists on Mixcloud, copy it from there
3. **Validation**: The build will show confirmation when tracklists are added:
   ```
   ✓ Adding manual tracklist for: Mix Name (12 tracks)
   ```
4. **Multiple Mixes**: You can add tracklists for multiple cloudcasts in the same file

## How It Displays

Tracklists appear as a collapsible section below each mix player:

- **Collapsed** by default to keep the UI clean
- **Click to expand** - shows all tracks
- **Track info** - displays position, artist, track name, and time
- **Responsive** - works on all screen sizes
- **Accessible** - proper ARIA labels and semantic HTML

## Technical Details

The tracklist data is:
1. Read from `src/_data/tracklists.json` during build
2. Merged with cloudcast data in the data fetcher (e.g., `theAfroGrooveLibrary.js`)
3. Converted to the same format the Mixcloud API would use (`sections` array)
4. Automatically displayed by the `mix-player.njk` component

This means if Mixcloud ever adds tracklists to their API, your manual tracklists will work exactly the same way.

## Future Plans

If Mixcloud adds tracklist support to their public API, the manual system will continue to work as a fallback or override mechanism.
