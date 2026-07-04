// Jedes Paar hat die gleiche Antwort-ART (Ort, Zeit, Tätigkeit, ...),
// aber unterschiedliche "normale" Antworten für Crew vs. Impostor.
const QUESTION_PAIRS = [
  { category: "Ort", crew: "Nenne einen Ort, an dem du gerne Urlaub machen würdest.", impostor: "Nenne einen Ort, den du auf keinen Fall besuchen möchtest." },
  { category: "Tageszeit", crew: "Zu welcher Tageszeit bist du am produktivsten?", impostor: "Zu welcher Tageszeit bist du am müdesten?" },
  { category: "Tätigkeit", crew: "Was machst du am liebsten an einem Regentag?", impostor: "Was machst du am liebsten an einem sonnigen Tag?" },
  { category: "Essen", crew: "Was ist dein Lieblingsessen zum Frühstück?", impostor: "Was ist dein Lieblingsessen zum Abendessen?" },
  { category: "Person", crew: "Wen würdest du gerne einmal live treffen?", impostor: "Welche historische, bereits verstorbene Person würdest du gerne treffen?" },
  { category: "Beruf", crew: "Welchen Beruf hättest du gerne, wenn Geld keine Rolle spielt?", impostor: "Welchen Beruf würdest du niemals machen wollen?" },
  { category: "Tier", crew: "Welches Haustier hättest du gerne?", impostor: "Vor welchem Tier hast du am meisten Angst?" },
  { category: "Film-Genre", crew: "Welches Filmgenre magst du am liebsten?", impostor: "Welches Filmgenre magst du überhaupt nicht?" },
  { category: "Farbe", crew: "Was ist deine Lieblingsfarbe?", impostor: "Welche Farbe magst du am wenigsten?" },
  { category: "Gegenstand", crew: "Was würdest du zuerst aus einem brennenden Haus retten?", impostor: "Was würdest du sofort wegwerfen, wenn du müsstest?" },
  { category: "Verkehrsmittel", crew: "Mit welchem Verkehrsmittel reist du am liebsten?", impostor: "Mit welchem Verkehrsmittel reist du am ungernsten?" },
  { category: "Schulfach", crew: "Welches Schulfach mochtest/magst du am meisten?", impostor: "Welches Schulfach mochtest/magst du am wenigsten?" },
  { category: "Hobby", crew: "Was ist dein liebstes Hobby?", impostor: "Welches Hobby würdest du gerne mal ausprobieren?" },
  { category: "Musik", crew: "Welche Musikrichtung hörst du am liebsten?", impostor: "Welche Musikrichtung nervt dich am meisten?" },
  { category: "Sport", crew: "Welche Sportart würdest du gerne mal live im Stadion sehen?", impostor: "Welche Sportart findest du am langweiligsten anzuschauen?" },
  { category: "Jahreszeit", crew: "Was ist deine Lieblingsjahreszeit?", impostor: "Welche Jahreszeit magst du am wenigsten?" },
  { category: "Getränk", crew: "Was ist dein Lieblingsgetränk?", impostor: "Welches Getränk magst du überhaupt nicht?" },
  { category: "Superkraft", crew: "Welche Superkraft hättest du am liebsten?", impostor: "Welche Superkraft wäre für dich am nutzlosesten?" },
  { category: "Wetter", crew: "Welches Wetter magst du am liebsten?", impostor: "Welches Wetter magst du am wenigsten?" },
  { category: "Urlaubsart", crew: "Wie sieht dein Traumurlaub aus (Strand, Berge, Stadt, ...)?", impostor: "Welche Urlaubsart wäre für dich ein Albtraum?" },
  { category: "Fach/Thema", crew: "Über welches Thema könntest du stundenlang reden?", impostor: "Bei welchem Thema schaltest du sofort ab?" },
  { category: "Zahl", crew: "Was ist deine Glückszahl?", impostor: "Welche Zahl magst du überhaupt nicht?" },
  { category: "Kleidung", crew: "Welches Kleidungsstück trägst du am liebsten?", impostor: "Welches Kleidungsstück würdest du nie anziehen?" },
];

function pickRandomQuestionPair() {
  return QUESTION_PAIRS[Math.floor(Math.random() * QUESTION_PAIRS.length)];
}
