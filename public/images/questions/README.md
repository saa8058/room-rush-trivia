# Atwix Trivia Question Images

Optional image assets for visual trivia questions live here.

Suggested folders:

- `geography/` for flags and map clues
- `landmarks/` for famous places
- `brands/` for brand/logo clues you have permission to use
- `animals/` for animal photos
- `cars/` for car badges, models, or silhouettes
- `football/` for stadiums, kits, or club clues you have permission to use
- `movies-tv/` for permitted visual clues
- `luxury-fashion/` for style, pattern, or fashion clues

The normal visual deck now uses real image sources instead of generated placeholder cards:

- flags use `flagcdn.com`
- brand, car, and fashion logos use `cdn.simpleicons.org`
- landmarks, stadiums, and animal photos use the local `/api/wiki-image` proxy, which redirects to Wikipedia/Wikimedia page images

You can still add your own permitted local assets later under paths such as:

```text
/images/questions/geography/canada-flag.svg
/images/questions/animals/panda.jpg
/images/questions/brands/nike-logo.svg
```

Do not add copyrighted logos, movie stills, club crests, or photos unless you have the right to use them.

If a real external image cannot load, the game shows a clean "Image clue unavailable" fallback instead of a fake logo or fake landmark.
