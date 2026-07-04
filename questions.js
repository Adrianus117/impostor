// Struktur: jede Kategorie hat eine Liste von Fragenpaaren.
// Ein Fragenpaar besteht aus zwei gleichwertigen Fragen "a" und "b"
// (gleiche Antwort-ART, anderer Inhalt). Welche der beiden Fragen in
// einer Runde die Mehrheits- und welche die Impostor-Frage ist, wird
// bei jedem Rundenstart neu zufällig entschieden - steht hier NICHT fest.
//
// Neue Kategorie hinzufügen: neuen Schlüssel mit Array anlegen.
// Neue Frage zu bestehender Kategorie hinzufügen: einfach ein weiteres
// { a: "...", b: "..." } Objekt in das Array einfügen.

const QUESTION_POOL = {
  "Ort": [
    { a: "Nenne einen Ort, an dem du gerne Urlaub machen würdest.", b: "Nenne einen Ort, den du auf keinen Fall besuchen möchtest." },
    { a: "Nenne einen Ort, an dem du dich total entspannt fühlst.", b: "Nenne einen Ort, an dem du dich total unwohl fühlst." },
    { a: "An welchem Ort würdest du gerne mal übernachten (z.B. Baumhaus, Leuchtturm)?", b: "An welchem Ort würdest du niemals übernachten wollen?" },
  ],
  "Tageszeit": [
    { a: "Zu welcher Tageszeit bist du am produktivsten?", b: "Zu welcher Tageszeit bist du am müdesten?" },
    { a: "Um wie viel Uhr stehst du an einem normalen Schul-/Arbeitstag auf?", b: "Um wie viel Uhr stehst du an einem freien Tag (Wochenende) auf?" },
  ],
  "Tätigkeit": [
    { a: "Was machst du am liebsten an einem Regentag?", b: "Was machst du am liebsten an einem sonnigen Tag?" },
    { a: "Was machst du am liebsten im Schnee?", b: "Was machst du am liebsten bei Hitze?" },
  ],
  "Essen": [
    { a: "Was ist dein Lieblingsessen zum Frühstück?", b: "Was ist dein Lieblingsessen zum Abendessen?" },
    { a: "Was isst du am liebsten als Snack zwischendurch?", b: "Welchen Snack magst du überhaupt nicht?" },
    { a: "Was ist dein Lieblingsessen von deiner Familie/deinen Eltern?", b: "Welches Essen von früher magst du bis heute nicht?" },
  ],
  "Person": [
    { a: "Wen würdest du gerne einmal live treffen?", b: "Welche historische, bereits verstorbene Person würdest du gerne treffen?" },
  ],
  "Beruf": [
    { a: "Welchen Beruf hättest du gerne, wenn Geld keine Rolle spielt?", b: "Welchen Beruf würdest du niemals machen wollen?" },
  ],
  "Tier": [
    { a: "Welches Haustier hättest du gerne?", b: "Vor welchem Tier hast du am meisten Angst?" },
    { a: "Welches Tier findest du am beeindruckendsten?", b: "Welches Tier findest du am unangenehmsten?" },
  ],
  "Film-Genre": [
    { a: "Welches Filmgenre magst du am liebsten?", b: "Welches Filmgenre magst du überhaupt nicht?" },
    { a: "Welcher Filmheld-Typ wärst du am liebsten (z.B. mutig, clever, lustig)?", b: "Welcher Filmheld-Typ nervt dich am meisten (z.B. der ewige Trottel, der Draufgänger)?" },
  ],
  "Farbe": [
    { a: "Was ist deine Lieblingsfarbe?", b: "Welche Farbe magst du am wenigsten?" },
  ],
  "Gegenstand": [
    { a: "Was würdest du zuerst aus einem brennenden Haus retten?", b: "Was würdest du sofort wegwerfen, wenn du müsstest?" },
  ],
  "Verkehrsmittel": [
    { a: "Mit welchem Verkehrsmittel reist du am liebsten?", b: "Mit welchem Verkehrsmittel reist du am ungernsten?" },
    { a: "Welches Auto/Fahrzeug würdest du dir kaufen, wenn Geld egal wäre?", b: "Welches Fahrzeug würdest du niemals kaufen?" },
  ],
  "Schulfach": [
    { a: "Welches Schulfach mochtest/magst du am meisten?", b: "Welches Schulfach mochtest/magst du am wenigsten?" },
    { a: "Was war dein bestes Fach in der Schule?", b: "Bei welchem Fach hast du am meisten geschwitzt?" },
  ],
  "Hobby": [
    { a: "Was ist dein liebstes Hobby?", b: "Welches Hobby würdest du gerne mal ausprobieren?" },
  ],
  "Musik": [
    { a: "Welche Musikrichtung hörst du am liebsten?", b: "Welche Musikrichtung nervt dich am meisten?" },
    { a: "Welches Instrument würdest du gerne spielen können?", b: "Welches Instrument nervt dich, wenn andere es spielen?" },
  ],
  "Sport": [
    { a: "Welche Sportart würdest du gerne mal live im Stadion sehen?", b: "Welche Sportart findest du am langweiligsten anzuschauen?" },
    { a: "Welche Sportart würdest du gerne selbst mal ausprobieren?", b: "Welche Sportart würdest du niemals selbst machen?" },
  ],
  "Jahreszeit": [
    { a: "Was ist deine Lieblingsjahreszeit?", b: "Welche Jahreszeit magst du am wenigsten?" },
  ],
  "Getränk": [
    { a: "Was ist dein Lieblingsgetränk?", b: "Welches Getränk magst du überhaupt nicht?" },
  ],
  "Superkraft": [
    { a: "Welche Superkraft hättest du am liebsten?", b: "Welche Superkraft wäre für dich am nutzlosesten?" },
  ],
  "Wetter": [
    { a: "Welches Wetter magst du am liebsten?", b: "Welches Wetter magst du am wenigsten?" },
  ],
  "Urlaubsart": [
    { a: "Wie sieht dein Traumurlaub aus (Strand, Berge, Stadt, ...)?", b: "Welche Urlaubsart wäre für dich ein Albtraum?" },
    { a: "In welches Land würdest du gerne mal reisen?", b: "In welches Land würdest du niemals reisen wollen?" },
  ],
  "Fach/Thema": [
    { a: "Über welches Thema könntest du stundenlang reden?", b: "Bei welchem Thema schaltest du sofort ab?" },
  ],
  "Zahl": [
    { a: "Was ist deine Glückszahl?", b: "Welche Zahl magst du überhaupt nicht?" },
  ],
  "Kleidung": [
    { a: "Welches Kleidungsstück trägst du am liebsten?", b: "Welches Kleidungsstück würdest du nie anziehen?" },
  ],
  "Süßigkeit": [
    { a: "Was ist deine Lieblingssüßigkeit?", b: "Welche Süßigkeit magst du überhaupt nicht?" },
  ],
  "Serie": [
    { a: "Welche Serie könntest du immer wieder schauen?", b: "Welche Serie hast du abgebrochen, weil sie so schlecht war?" },
  ],
  "App": [
    { a: "Welche App nutzt du am meisten?", b: "Welche App löschst du sofort wieder?" },
    { a: "Welche Social-Media-Plattform nutzt du am meisten?", b: "Welche Social-Media-Plattform findest du am nervigsten?" },
  ],
  "Feiertag": [
    { a: "Welcher Feiertag ist dir am wichtigsten?", b: "Welcher Feiertag ist dir völlig egal?" },
  ],
  "Buch": [
    { a: "Welches Buchgenre liest du am liebsten?", b: "Welches Buchgenre würdest du niemals lesen?" },
  ],
  "Wochentag": [
    { a: "Welcher Wochentag ist dein Lieblingstag?", b: "Welcher Wochentag ist dein am wenigsten geliebter Tag?" },
  ],
  "Küche": [
    { a: "Welche Länderküche magst du am liebsten?", b: "Welche Länderküche magst du am wenigsten?" },
  ],
  "Handy-Nutzung": [
    { a: "Wofür nutzt du dein Handy am meisten?", b: "Wofür würdest du dein Handy am liebsten nie nutzen müssen?" },
  ],
  "Zimmer": [
    { a: "Welcher Raum in deiner Wohnung/deinem Haus ist dein Lieblingsraum?", b: "In welchem Raum hältst du dich am wenigsten gerne auf?" },
  ],
  "Comic/Held": [
    { a: "Welcher Superheld gefällt dir am besten?", b: "Welcher Superheld nervt dich am meisten / findest du am langweiligsten?" },
  ],
  "Emoji": [
    { a: "Welches Emoji benutzt du am häufigsten?", b: "Welches Emoji verstehst du nicht / nutzt du nie?" },
  ],
  "Lernstil": [
    { a: "Wie lernst du am liebsten für eine Prüfung?", b: "Welche Lernmethode hasst du am meisten?" },
  ],
  "Party": [
    { a: "Was darf auf keiner guten Party fehlen?", b: "Was macht für dich eine Party sofort kaputt?" },
  ],
  "Duft": [
    { a: "Welcher Geruch/Duft gefällt dir besonders gut?", b: "Welcher Geruch ist für dich am schlimmsten?" },
  ],
  "Zukunft": [
    { a: "Auf welche zukünftige Erfindung freust du dich am meisten?", b: "Vor welcher zukünftigen Entwicklung hast du am meisten Angst?" },
  ],
  "Videospiel": [
    { a: "Welches Videospiel-Genre spielst du am liebsten?", b: "Welches Videospiel-Genre findest du am langweiligsten?" },
  ],
};

// Wählt zufällig zuerst eine Kategorie, dann eine Frage innerhalb dieser
// Kategorie. So bleiben auch Kategorien mit nur einem Fragenpaar gleich
// wahrscheinlich wie Kategorien mit mehreren Varianten.
//
// Welche der beiden Fragen (a/b) zur Crew- bzw. Impostor-Frage wird,
// wird hier bei jedem Aufruf per Münzwurf neu entschieden - dadurch ist
// es über mehrere Runden hinweg nicht vorhersagbar, welche "Richtung"
// eines Paares die Impostor-Frage ist.
function pickRandomQuestionPair() {
  const categories = Object.keys(QUESTION_POOL);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const variants = QUESTION_POOL[category];
  const variant = variants[Math.floor(Math.random() * variants.length)];
  const swap = Math.random() < 0.5;
  return {
    category,
    crew: swap ? variant.b : variant.a,
    impostor: swap ? variant.a : variant.b,
  };
}
