Static assets served at the site root. Drop your images here:

  hero.jpg        -> shown in the hero (right side) AND used as the social
                     share/preview image. Best fit: a wide ~16:9 image
                     (e.g. the "10 Min Makeup 40+" banner). 780x439+ is fine.

  instruktor.jpg  -> shown in the "Lösningen" section. Best fit: a portrait/
                     square beauty or makeup-artist photo (the headshot).

Filenames must match exactly (lowercase, .jpg). Until the files exist the page
shows a labelled placeholder box instead — nothing breaks.

To use .png instead, update the src in app/page.tsx (and openGraph in
app/layout.tsx) to /hero.png etc.
