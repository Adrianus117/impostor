# Impostor – Akte (PWA)

Ein Offline-Party-Spiel: variable Spieleranzahl, variable Anzahl Impostor,
Fragenpaare mit gleicher Antwort-Art, "Handy-weiterreichen"-Verhör-Flow,
Auflösung mit Stempel-Effekt.

## Warum du das hosten musst

Damit die App wie eine normale App installierbar ist ("Zum Startbildschirm
hinzufügen") und offline funktioniert, muss sie einmal über **https** (oder
localhost) ausgeliefert werden – Browser aktivieren Service Worker (die
Offline-Funktion) nur über eine sichere Verbindung. Einmal installiert,
braucht sie danach kein Internet mehr.

## Schnellster Weg: GitHub Pages (kostenlos, ~5 Minuten)

1. Erstelle ein neues Repository auf github.com (z. B. `impostor-app`).
2. Lade alle Dateien aus diesem Ordner in das Repository hoch
   (`index.html`, `style.css`, `app.js`, `questions.js`, `manifest.json`,
   `service-worker.js`, den Ordner `icons/`).
3. Gehe im Repository zu **Settings → Pages**
4. Bei "Source" wähle den Branch `main` und Ordner `/ (root)`, dann
   **Save**.
5. Nach ca. 1 Minute ist die App erreichbar unter:
   `https://DEIN-BENUTZERNAME.github.io/impostor-app/`

## Alternative: Netlify Drop

Auf https://app.netlify.com/drop den ganzen Ordner per Drag & Drop
hochladen – du bekommst sofort eine https-URL, keine Anmeldung nötig.

## Auf dem Handy installieren

**Android (Chrome):** URL öffnen → Menü (⋮) → "App installieren" bzw.
"Zum Startbildschirm hinzufügen".

**iPhone (Safari):** URL öffnen → Teilen-Symbol → "Zum Home-Bildschirm".

Die App erscheint danach mit eigenem Icon wie jede andere App und startet
im Vollbild ohne Browser-Leiste. Nach dem ersten Öffnen (einmal mit
Internet) funktioniert sie komplett offline, da alle Dateien vom Service
Worker zwischengespeichert werden.

## Spielregeln kurz

- Mindestens 3 Spieler, 1 bis (Spieleranzahl − 2) Impostor.
- Jede Runde: ein zufälliges Fragenpaar wird gewählt. Impostor bekommen
  eine andere, aber thematisch passende Frage als der Rest.
- Handy wird reihum weitergegeben, jeder tippt seine Antwort ein.
- Danach wird die "richtige" Frage und alle Antworten offengelegt –
  die Gruppe diskutiert und deckt anschließend im Spiel auf, wer
  Impostor war
  
- Fragenpool erweitern: einfach in `questions.js` weitere Einträge nach
  dem gleichen Muster (`category`, `crew`, `impostor`) ergänzen.
