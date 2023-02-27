# Search Fundamentals
***Volltextsuche funktioniert im Vergleich zu einer normalen Datenbankabfrage ganz anders.*** Grob gesagt, wird bei einer normalen Datenbankabfrage nach dem exakten Wert in einem Datenbankfeld gesucht.

***Bei Volltextsuche hingegen wird die Abfrage gegen analysierten Text durchgeführt. Die dabei eingesetzte Suchmaschine hat also ein Grundverständnis des zu suchenden Textes und erlaubt so wesentlich mehr Funktionalität als einfache Datenbankabfragen.***

***Schauen wir uns das anhand eines konkreten Beispiels an:***

***Eine Produktbeschreibung für eine Katzenkiste:***

Dieses Katzenkistchen bietet viel Platz für eine große Katze und hat eine praktische Abdeckung, die Gerüche einschließt.

Wenn ein Kunde nach solchem Katzenzubehör mit dem Suchbegriff “bietet viel Platz für eine große Katze” sucht, würde uns das finden mit einer normalen Datenbankabfrage bereits vor Herausforderungen stellen.

Wir könnten eine Wildcard-Abfrage verwenden welche nach dieser Passage in jedem Text sucht.

Wenn der Kunde allerdings nach “bietet für eine große Katze viel Platz” sucht, funktioniert das schon nicht mehr. Ausserdem müssten wir dafür sorgen, dass die Abfrage Gross- und Kleinschreibung ignoriert sowie mit doppeltem S wie auch dem deutschen ß umgehen kann. 

Eine weitere Option wäre es auch, Regular Expressions zu verwenden. Dies würde allerdings sehr schnell zu komplexen Abfragen führen welche in der Regel auch eher schlechte Performance liefern.

Spätestens wenn ein Kunde nach “Bietet Platz für eine grössere Katze” sucht, wäre diese Methode auch nicht mehr erfolgreich.

Befor ich dir zeige wie du die Reichweite deiner Applikation mit solcher Funktionalität supereinfach und schnell deutlich erhöhen kannst, zuerst kurz die Basics wie das überhaupt funktioniert.

## //Grafik
Der Text der durchsucht werden soll durchläuft einen Analyzer. Dieser produziert daraus eine Sammlung einzelner Token welche in einem Index abgelegt werden. Ein Token ist dabei ein Fragment des Textes, normalerweise ein einzelnes Wort oder eine Ableitung eines einzelnen Wortes. 

Wenn du eine Abfrage ausführst, durchläuft diese den selben Analyseprozess und generiert ebenfalls eine Sammlung einzelner Token. Dann wird nach Übereinstimmungen in den Token aus dem Suchbegriff und den zu durchsuchenden Text gesucht. Je nachdem wie viele Tokens übereinstimmen und in welcher Reihenfolge wird ein Score berechnet der mit dem Suchresultat zurück gegeben wird und nach dem die Resultate auch absteigend sortiert sind.

## //Grafik
Ein Analyzer verarbeitet den Text in 3 Schritten

Dem Character Filter, dem Tokenizer und dem Token Filter, wobei Character Filter und Token Filter optional sind. 

1. Die Character Filter entfernen einzelne Zeichen aus dem Text welche bei der Suche hinderlich wären. Beispielsweise Formatierungszeichen oder HTML-Tags. 
2. Sobald alle Character Filter durchgeführt wurden, wird der daraus resultierende Text dem Tokenizer übergeben. Der Tokenizer splittet den Text in die einzelnen Token auf. Normalerweise anhand von Leerzeichen oder anderer Sonderzeichen im Text. Ausserdem ermittelt er die Position der Token im Text. Diese Informationen sind für spezielle Abfragetypen, sowie für das Highlighting von Treffern in der Suchanfrage wichtig. Jeder Analyzer darf genau einen Tokenizer verwenden. 
3. Die Token welche vom Tokenizer produziert wurden werden zum letzten Schritt gesendet, den Token Filtern. Die Token Filter modifizieren-, entfernen- oder fügen Token hinzu. Wie bei den Character Filtern, können in einem Analyzer mehrere Token Filter vorkommen. Token Filter konvertieren typischerweise Tokens in Kleinbuchstaben, entfernen ungewünschte Token wie zum Beispiel Füllwörter oder führen ein so genanntes Stemming durch, welches Wörter in ihrer Stammform reduziert. 

Die Anforderungen an eine Datenbank zur Volltextsuche unterscheiden erheblich von den Anforderungen die eine “normale” Abfrage zu erfüllen hat. Daher wird für Volltextsuche in der Regel auch eine eigene Technologie eingesetzt, welche meistens auf der frei verfügbaren Apache Lucene Engine basiert. 

Atlas Search kombiniert hier die beiden Technologien MongoDB und Lucene unter einer, für Entwickler leicht anzuwendenden API. Du kannst aus vielen vorgefertigten Analyzern auswählen aber auch deine eigenen Analyzer aus den 3 vorher genannten Komponenten zusammenstellen.

## //Analyzer Output Page Example
Genug der Theorie, Zeit sich die Hände schmutzig zu machen.

Wie in all meinen Videos nehme ich als Basis die MDB Masterclass Tutorial App. Sie ist sehr einfach zu installieren und frei auf GitHub verfügbar. Der Link ist in der Videobeschreibung und das Video dazu blende ich dir oben rechts gerade ein.

By the way, wenn du noch nicht auf meinem YouTube Kanal abonniert bist, dann mach das doch bitte jetzt. Ich veröffentliche regelmässig neue Videos zu MongoDB und anderen Themen rund um die Entwicklung von Webanwendungen.

## //Compass
Um dem Tutorial zu folgen findest du die Testdaten unter /testData in der Datei “Katzenkistchen.json”

## //Atlas
Verbinde dich mit deinen Atlas Cluster. Du findest die Connection Informationen wenn du hier auf den Button “connect” klickst.

## //Compass
Lege in Compass eine neue Datenbank mit dem Namen “Products” und darin die Collection “productDescriptions” an. 

In diese Collection kannst du die Testdaten aus der Datei “testData/Katzenkistchen.json” laden.

## //Atlas
In Atlas kannst du jetzt den Search Index erstellen. Wähle dazu deinen MyCustomers Cluster aus und gehe auf den Search - Tab. Hier siehst du bereits den bestehenden Search Index aus der MDB Masterclass Tutorial App. 

Für dieses Tutorial erstellst du jedoch einen komplett neuen Search Index. Klicke dafür auf “CREATE INDEX” oben Rechts.

Als erstes kannst du zwischen visuellem und JSON Editor zum erstellen des Search Index wählen. Ich empfehle dir vor Allem zum beginnen mit dem visuellen Editor zu arbeiten. Du kannst jederzeit später zum JSON Editor wechseln.

Im nächsten Schritt musst du deinem Index einen Namen geben und die Collection auswählen welche die Daten enthält. Ich belasse hier den Namen auf “default” und wähle die soeben angelegte “productDescriptions” Collection in der Products Datenbank.

Im letzten Schritt kannst du jetzt den Analyzer definieren. Standardmässig wird hier der lucene.standard Analyzer mit einem dynamic mapping genutzt. So werden alle Felder in unserem Dokument mit diesem Analyzer bearbeitet und im Index abgelegt. 

Lege den Index genau so an in dem du auf “Create Search Index” klickst.

Das war schon alles. Jetzt werden alle Dokumente in der productDescriptions collection mit dem lucene standard Analyzer indexiert und sind bereit für die Volltextsuche. Wie ich vorhin erwähnt habe, ist die Abfrage des Suchindex mit der gleichen API möglich wie du auch normalerweise deine MongoDB abfragen wirst. Der Index wird auch automatisch mit den Daten in der Collection synchron gehalten. Veränderst du ein Dokument oder fügst eins hinzu, wird der neue Inhalt wiederum mit dem ausgewählten Analyzer im Index nachgeführt. 

## //Compass
Zeit diesen Index zu testen. Dazu wechsle ich wieder in Compass.

Den Suchindex sprichst du über eine Aggregation Pipeline an. Wähle dazu den “Aggregations” Tab und füge der Pipeline eine neue Stage hinzu.

Für die Volltextsuche muss die erste Stage in einer Aggregation eine $search Stage sein. Zusätzlich gebe ich den Score welchen ich von der Lucene Engine erhalte in einem neuen Feld “score” aus.
```JSON
[
  {
    $search: {
      index: "default",
      text: {
        query: "platz für eine große katze",
        path: "Description",
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

Schau dir das Resultat genau an. Es werden alle unsere Produkte gefunden, jedoch wird jenes in dem die meisten Worte in der ähnlichsten Reihenfolge vorkommen mit dem höchsten Score zuerst ausgegeben. Anders ist es, wenn ich nach dem Satz in der Beschreibung suche. Dafür wechsle ich die text suche durch eine phrase suche aus:

```JSON
[
  {
    $search: {
      index: "default",
      phrase: {
        query: "platz für eine große katze",
        path: "Description",
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

Hier spielt die Reihenfolge der Worte eine Rolle und es werden nur Resultate ausgegeben welche alle Worte in dem Satz beinhalten. Ändere ich die Reihenfolge, findet die Search Engine nichts mehr.
```JSON
[
  {
    $search: {
      index: "default",
      phrase: {
        query: "für eine große katze platz",
        path: "Description",
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

mit dem “Slop” parameter kann ich hier die toleranz erhöhen und definieren wie viele Worte in einer anderen Reihenfolge erscheinen dürfen:

```JSON
[
  {
    $search: {
      index: "default",
      phrase: {
        query: "für eine große katze platz",
        path: "Description",
        slop: 5
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

Was ist jedoch wenn mein Benutzer nach “für eine grössere Katze” sucht?

Die Suche läuft ins leere. Hier kommt ein neuer Analyzer ins Spiel der auch das sogenannte Stemming im Tokenfilter durchführt. Beim Stemming wird jedes Wort auf seine Grundform reduziert. Da dies Sprachabhängig ist, musst du einen sprachspezifischen Analyzer verwenden. Ich verwende hier den Lucene German. Schauen wir kurz was der Analyzer genau aus unserer Produktbeschreibung macht:

## //Analyzer Website
Wie du sehen kannst, wird hier aus grosse [gross] und auch aus grössere wird [gross]
Ausserdem werden Token für häufige Füllwörter wie “und”, “eine”, “für” entfernt.

Lass uns den Index kurz umbauen und schauen was mit unserer Query passiert: 

## //Atlas Switch to German
Es wird ein paar Sekunden dauern bis dein Suchindex angepasst wurde. Keine Angst, der alte Index bleibt bestehen bis der neue Index im Hintergrund vollständig aufgebaut wurde. Deine produktive Applikation kann also weiterhin auf den alten Index zugreifen.

Schauen wir was unsere Query nun ausgibt:
## //Compass
```JSON
[
  {
    $search: {
      index: "default",
      phrase: {
        query: "für eine grössere katze platz",
        path: "Description",
        slop: 5
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

## //Summary
Beim entwickeln von Volltextsuchen gilt es die Balance zu finden zwischen Präzision und Unschärfe. Es kommt hier stark darauf an wie deine Daten aussehen und was deine Benutzer von der Suche erwarten. Atlas hilft dir hier durch seine sehr einfache Implementierung und API schnell und sicher die richtigen Einstellungen zu finden.

In diesem Video habe ich nur grob an der Oberfläche gekratzt was mit Search alles möglich ist. Wenn du eine bestimmte Herausforderung für Volltextsuche hast, lass es mich doch bitte in den Kommentaren wissen, gerne gehe ich auf deine konkreten Problemstellungen ein und vielleicht mache ich, anonymisiert natürlich, ein Video über deine Herausforderung. 

Ich hoffe dieses Video hat dir Mehrwert gebracht und du hast etwas gelernt. Wenn du noch Fragen hast, kannst du mir gerne einen Kommentar hinterlassen oder mich auf Twitter kontaktieren.

Bis zum nächsten mal