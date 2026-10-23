// ==UserScript==
// @name         Skribbl.io Word Guessing Solver
// @namespace    http://tampermonkey.net/skribblio-solver
// @version      4.6
// @description  Filters the word list based on the Skribbl.io hint pattern. The underscore (_) character in the input is treated as a wildcard.
// @author       062Leo
// @match        *://skribbl.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const wordList = [
        "CD", "Pi", "Ra", "PC", "BH", "VW", "Öl", "O2", "Ei", "Aal", "Kuh", "Gas", "rot", "Uhr", "Arm", "MTV", "Ass", "Rom", "gut", "Ast", "Wal", "Fan", "UNO", "LED", "tot", "Axt", "KFC", "Van", "Gru", "LKW", "Eis", "BMX", "Hut", "DVD", "GTA", "Emu", "Box", "Ski", "Tal", "FBI", "CO2", "USB", "Bär", "Hai", "Bob", "Fee", "Sau", "alt", "RAM", "Kik", "Tau", "DNS", "SUV", "Bar", "See", "Pan", "Zug", "Ohr", "Huf", "Tee", "Reh", "Tuc", "Tag", "Bus", "Fuß", "Rad", "Tor", "Zeh", "DAX", "BMW", "RGB", "TNT", "Zoo", "IOS", "App", "DHL", "Tür", "UFO", "Hahn", "Hase", "Atem", "Mund", "Gott", "Link", "Mopp", "Erde", "Stab", "C-3PO", "Puma", "Sith", "Elle", "Boot", "Rose", "Mops", "Oboe", "Ufer", "Meer", "Hexe", "Hupe", "Löwe", "Fell", "Nemo", "Möwe", "Eber", "Lama", "Horn", "Land", "groß", "Flut", "taub", "Odin", "Jo-Jo", "ABBA", "Kran", "Zuma", "Mine", "Fifa", "Darm", "Krug", "hell", "Maki", "oben", "Peru", "Keks", "W-LAN", "Salz", "Saft", "Mais", "Käse", "Idee", "Kuba", "Dorf", "Baby", "grün", "Vene", "Brot", "jung", "Feld", "Boss", "Wald", "Quad", "Nuss", "Düne", "Loch", "Glut", "Yeti", "Euro", "Judo", "Atom", "Toad", "Senf", "voll", "Sarg", "Sohn", "Amor", "Hand", "Mars", "Herz", "Damm", "Oper", "Echo", "Wahl", "Koto", "Sand", "Ford", "Rock", "Haut", "Zelt", "Zoom", "leer", "Lego", "Jeep", "Reis", "Ende", "heiß", "Maut", "Oval", "dick", "Sumo", "Thor", "Pilz", "Hund", "Floh", "Jazz", "Rohr", "kurz", "dünn", "Diva", "Auge", "Jedi", "Tank", "Nest", "Akne", "Lady", "Finn", "Chor", "Eule", "Haus", "Audi", "Nixe", "Koch", "Raum", "müde", "Tipi", "Pony", "Text", "Lava", "R2-D2", "Logo", "Ball", "Gnom", "kalt", "Taxi", "Elmo", "Orca", "warm", "Dora", "Tutu", "Holz", "Hals", "Taco", "Kamm", "Wort", "Loki", "Kopf", "Pech", "pink", "Elsa", "Igel", "Teig", "Cola", "ADHS", "Mohn", "Dame", "Urin", "frei", "Nasa", "Boje", "Ofen", "Helm", "Bank", "Ente", "Bart", "Elfe", "Säge", "kahl", "Floß", "Töne", "Iris", "Dorn", "Hulk", "hart", "Ikea", "Berg", "Hose", "Safe", "Ring", "blau", "Knie", "Yoga", "Polo", "Nike", "Lehm", "Ober", "Farn", "Geld", "Lupe", "laut", "Gips", "Bett", "Olaf", "Welt", "Grab", "Ruhe", "Garn", "Stau", "Dach", "Leck", "Arzt", "Opel", "Form", "Auto", "Turm", "Lamm", "Zoll", "Navy", "Kohl", "Gras", "Efeu", "Band", "Rune", "Ebbe", "Frau", "Keim", "Silo", "Maus", "Film", "Wand", "Esel", "Dill", "Nerd", "Kanu", "Golf", "dürr", "Styx", "Bier", "Elch", "Meme", "Zaun", "Gier", "Affe", "Iran", "Korb", "Kind", "Lidl", "Gold", "Köln", "Blut", "Park", "Ziel", "Kino", "Made", "Diät", "Zahn", "gelb", "Föhn", "Oase", "Moos", "Dieb", "Kiwi", "Kilt", "Biss", "Chat", "Yoda", "Sieg", "Rick", "Gans", "Held", "Narr", "Seil", "tief", "Bock", "Pups", "Fiat", "weiß", "Büro", "Glas", "Chef", "Buch", "Huhn", "Topf", "Mond", "Xbox", "iPad", "Zeus", "Fass", "Robe", "Soße", "Aldi", "Nase", "Oreo", "Netz", "Pfad", "Gang", "Wurm", "Rübe", "Ecke", "Zopf", "Pfau", "Luke", "Dose", "Zahl", "Gift", "lila", "Gong", "Tuba", "Wolf", "Kinn", "Harz", "Wind", "Wade", "Bass", "Wein", "Baum", "Real", "Mann", "Nacht", "Virus", "Tulpe", "Schaf", "Nepal", "Grube", "Tukan", "Waage", "Schuh", "Kunst", "Waffe", "knien", "genau", "Villa", "Bombe", "jagen", "Bogen", "Sturz", "Boxer", "braun", "Amsel", "atmen", "Radar", "Riese", "Organ", "Beine", "Kohle", "Blüte", "Poker", "Raupe", "Mumie", "Adler", "stark", "Gully", "Küche", "Olive", "Gelee", "Milka", "Niere", "Curry", "Degen", "Essen", "Zecke", "Lasso", "Xerox", "Comic", "Pirat", "Anzug", "Bongo", "blind", "Pixel", "Blitz", "Höhle", "Dumbo", "Sahne", "Eimer", "Blase", "Ärmel", "teuer", "Zelle", "Schal", "Speer", "Säule", "Fanta", "Opera", "Pokal", "Apple", "Wolle", "Reise", "Geier", "Ratte", "Otter", "Jesus", "Münze", "Panda", "Snack", "Salat", "Kurve", "Kappe", "Alarm", "Drama", "Disco", "Hüfte", "Zwerg", "Harfe", "Döner", "Spieß", "Kakao", "Steam", "Tasse", "Jeans", "Spion", "Orbit", "Stuhl", "Laser", "Hagel", "Bagel", "Bühne", "Genie", "Totem", "Faust", "Pumba", "Bingo", "Krebs", "gehen", "Käfer", "Regal", "Donut", "Mütze", "Geist", "Birne", "Ziege", "leise", "Tokio", "Hütte", "Wespe", "Sturm", "Knopf", "Toast", "Daune", "Müsli", "Kokon", "Luchs", "Suppe", "Fleck", "Nebel", "Kebab", "Pfund", "Kabel", "Cajon", "Hölle", "Pferd", "Biber", "Gummi", "Wiese", "Tails", "Abend", "Kefir", "Skoda", "Durst", "Leber", "Kegel", "Stoff", "Falte", "König", "Pfeil", "Zweig", "Guiro", "Haare", "Mähne", "U-Bahn", "Nudel", "Hirte", "Möhre", "Pudel", "Inuit", "Hürde", "Seite", "Dreck", "Spule", "Duplo", "Kobra", "Grill", "Magie", "Musik", "Goofy", "Flöte", "Taser", "Insel", "Hydra", "Kazoo", "Kater", "Clogs", "Hecke", "Robbe", "Husky", "Ahorn", "Motte", "Tesla", "Stall", "Tinte", "Paris", "Besen", "Kehle", "Gouda", "Uluru", "Welle", "Mafia", "Handy", "Dampf", "Geige", "Cello", "Gabel", "Linse", "spitz", "Wolke", "Tabak", "Bruch", "Crocs", "Liane", "Bibel", "Papst", "Punkt", "Duell", "Weste", "Tafel", "Ruder", "Palme", "Couch", "Marke", "Dürre", "Penne", "flach", "Krieg", "Schoß", "Darts", "Nitro", "Agent", "Anker", "Nonne", "Knast", "Maler", "Pedal", "Klaue", "Zeuge", "nähen", "Groot", "kauen", "Biene", "Bauch", "Vater", "Pluto", "Funke", "Glück", "Kopie", "Junge", "Beute", "Jacht", "Speck", "Asien", "Wunde", "Zügel", "Kreuz", "Dolch", "Party", "Peach", "Euter", "Pfand", "Asche", "älter", "Kreis", "Zebra", "Engel", "Quark", "Troll", "Chips", "alles", "Preis", "Perle", "Kugel", "Lampe", "faxen", "Markt", "Narbe", "Minze", "Möbel", "Rubin", "Allee", "Sport", "Eisen", "Beule", "links", "Brust", "krank", "Ferse", "Bison", "Texas", "China", "Staub", "Hitze", "Juwel", "Mücke", "Essig", "Kleid", "Wachs", "Taube", "Roman", "Tiger", "Glanz", "Atlas", "Decke", "Herde", "Japan", "Zorro", "Pasta", "Falle", "Stein", "Jenga", "Hotel", "Gasse", "Linie", "Krähe", "Rolex", "Titan", "Noten", "Blume", "Corgi", "offen", "klein", "Zunge", "Profi", "beten", "Farbe", "Regen", "Luigi", "Spore", "Ninja", "Rampe", "Nadel", "Teich", "Warze", "Joker", "Salon", "Mulan", "Frost", "Pilot", "Rippe", "Torte", "Käfig", "Chile", "Träne", "Motor", "Katze", "Vodka", "Adobe", "Welpe", "Ozean", "Kerze", "Pizza", "Shrek", "Anime", "Mixer", "Honig", "Komet", "lesen", "Prinz", "Birke", "Bambi", "Ayran", "laden", "Maske", "Rauch", "Smart", "Fuchs", "Samen", "Koala", "Kamin", "Säure", "Nagel", "Lachs", "Traum", "Weide", "Basar", "Golem", "Basis", "Wange", "Queue", "Lanze", "Spiel", "Bulle", "Venus", "Pflug", "Kunde", "Magma", "Wall-e", "Sonic", "Krake", "boxen",
        "Krone", "weich", "Popel", "Creme", "Jäger", "Hecht", "Wario", "Laute", "Gurke", "sanft", "Emoji", "Dachs", "Truhe", "Tisch", "Henne", "Thron", "Stern", "Stadt", "Säbel", "Licht", "Leine", "Skype", "Sauna", "Figur", "Trend", "Abzug", "Venom", "Notch", "Zange", "Kröte", "Knete", "Opfer", "Onkel", "Fisch", "Zelda", "Clown", "Küste", "unten", "AC/DC", "Polen", "Blatt", "Karte", "Jacke", "Wippe", "Wanze", "Pappe", "Orgel", "Vogel", "Lemur", "Stirn", "Flash", "Busch", "antik", "Keule", "Feder", "Limbo", "Pepsi", "Morty", "Ampel", "Kette", "Rugby", "Chaos", "Liebe", "Yoshi", "Rodeo", "Autor", "Puder", "Model", "Imker", "Bauer", "Süden", "Mario", "Haken", "Hafen", "Delle", "Seife", "Zitze", "Sumpf", "Köder", "Video", "Sonne", "Natur", "Wiege", "Milch", "Pauke", "Kamel", "Braut", "Sushi", "Hades", "Wales", "Dämon", "Fluss", "Puppe", "Pause", "Tibet", "Reibe", "Pfote", "Stock", "Teeei", "Duden", "Tumor", "Sitar", "Intel", "Osten", "Brett", "Eiche", "Stift", "Kirby", "Wüste", "Mönch", "Leder", "Oscar", "Lilie", "Radio", "Hyäne", "Wurst", "Queen", "Kranz", "Bohne", "Apfel", "Lunge", "U-Boot", "Banjo", "Hügel", "Kiste", "Brexit", "Gehirn", "Drache", "Glocke", "Arktis", "Gondel", "Eltern", "Hockey", "Bäcker", "mobben", "Westen", "Snoopy", "niesen", "Delfin", "Wetter", "Knoten", "Ungarn", "Cowboy", "Kanada", "Dattel", "Bürste", "Müller", "Henker", "Anwalt", "Hammer", "Rüssel", "Dusche", "Pavian", "Brille", "Hacker", "Himmel", "Mammut", "Bremen", "Kleber", "Frucht", "Geysir", "Flügel", "Hippie", "Papier", "Fussel", "Maurer", "Artist", "Ritter", "Stereo", "Eclair", "Louvre", "Gebäck", "Schnee", "Hobbit", "Winter", "Grille", "Kneipe", "spülen", "Eistee", "Tetris", "Selfie", "tippen", "Pollen", "Rosine", "rudern", "Reifen", "Razzia", "Tapete", "Kupfer", "Turban", "Darwin", "Shogun", "Seekuh", "denken", "atomar", "Schach", "Bounty", "Montag", "Gebiss", "binden", "Hummer", "rollen", "Karate", "Qualle", "Kojote", "Berlin", "TikTok", "Kürbis", "Lippen", "Gollum", "Straße", "Pickel", "Hälfte", "NASCAR", "Goblin", "Weizen", "Glatze", "Segway", "fangen", "Zirkel", "Vulkan", "Kaffee", "Bowser", "Thanos", "Google", "Achsel", "Ferien", "Hantel", "Kabine", "Voodoo", "Nickel", "Teller", "Nachos", "Poster", "Panzer", "Strauß", "Anubis", "Locher", "Sattel", "zupfen", "Helium", "Haribo", "Einöde", "Huawei", "suchen", "Tasche", "melken", "Südpol", "Rührei", "Vakuum", "Fliege", "Elster", "Brause", "Monaco", "Saturn", "Mosaik", "Mörder", "wütend", "Reddit", "Chemie", "zerren", "Tandem", "Rezept", "laufen", "heulen", "Brücke", "Bayern", "iPhone", "Kessel", "Rektor", "Tundra", "gähnen", "Athlet", "Reptil", "Jodeln", "Amazon", "Diener", "Waffel", "stoßen", "Kreide", "treten", "Metall", "Muffin", "Melone", "Idefix", "lustig", "Zirkus", "Alpaka", "Pinata", "Statue", "Kaviar", "Laptop", "Tacker", "Obelix", "Keller", "Klinik", "Daumen", "Kruste", "Kuppel", "Taille", "Korken", "Merkur", "rechts", "geizig", "Lineal", "Ozelot", "Pac-Man", "Island", "Urlaub", "Bonsai", "Shorts", "Ananas", "Redner", "Spinat", "Auster", "Gepäck", "Zombie", "Hunger", "modern", "Brezel", "sitzen", "Airbag", "winzig", "Fliese", "Salami", "Spaten", "giftig", "Hummel", "Buffet", "Vision", "Saphir", "Bambus", "Prisma", "Palast", "Spagat", "Hering", "Koffer", "Bronze", "Minute", "Pharao", "Bonbon", "Ameise", "Klasse", "zelten", "London", "Tweety", "Garage", "ernten", "Türkei", "Grinch", "Tennis", "Ferkel", "Grenze", "Krabbe", "Pfeife", "Fehler", "Kirche", "Dirndl", "Hawaii", "Ostsee", "Sockel", "Person", "Kanzel", "Parade", "Böller", "Pendel", "Podium", "Matsch", "Totoro", "Storch", "Sphinx", "Globus", "Banane", "Umhang", "Gemüse", "Benzin", "Uganda", "Grippe", "tanzen", "Schock", "Finger", "Zement", "Kostüm", "Cyborg", "drehen", "Wurzel", "beißen", "Pfanne", "lecken", "Diplom", "Domino", "zeigen", "Spinne", "Bikini", "Einrad", "Schere", "Tunnel", "Tattoo", "ringen", "Fahrer", "Gürtel", "Morgen", "Schule", "Roller", "Gewürz", "Athene", "fallen", "Sommer", "Shisha", "Kuchen", "Geröll", "Winzer", "Kapsel", "Flagge", "Messer", "Popeye", "Silber", "Tiegel", "zoomen", "lachen", "Kiefer", "Python", "Ostern", "Bohrer", "feiern", "Rechen", "Punkte", "Batman", "Zyklop", "Magier", "Wirbel", "Parfüm", "Sichel", "Socken", "Matrix", "Bizeps", "glühen", "Kermit", "Frosch", "Eigelb", "Jetski", "Fächer", "Eminem", "Lawine", "Deckel", "saufen", "Gitter", "Stitch", "biegen", "Chrome", "Planet", "Punker", "Kasino", "Cousin", "winken", "backen", "Jaguar", "Schild", "Gepard", "haarig", "Garten", "Israel", "Rochen", "Minion", "frisch", "Grafik", "Eichel", "Katana", "Dollar", "Strand", "Soldat", "Sprite", "Fabrik", "Wimper", "Mandel", "Paypal", "Banner", "Rakete", "Hermes", "braten", "Quelle", "Irland", "kiffen", "Göttin", "Kissen", "Hanuta", "Freund", "Hirsch", "Fackel", "Unfall", "popeln", "Tomate", "Klippe", "Apollo", "Schatz", "Doktor", "Hotdog", "Puzzle", "Lehrer", "Dexter", "Punsch", "Würfel", "Disney", "sinken", "beizen", "küssen", "graben", "Museum", "Butter", "Papaya", "Schilf", "Fieber", "Planke", "Herbst", "Erbsen", "sauber", "Server",
        "Mutter", "Zucker", "Adidas", "Diesel", "Gefahr", "Gewehr", "Specht", "Rapper", "Toyota", "Räuber", "Tarzan", "Europa", "stehen", "Wecker", "Aktion", "falten", "Amboss", "Balkon", "Risiko", "billig", "Medusa", "fahren", "Uranus", "Nessie", "Abfall", "Slalom", "Kaktus", "Kanone", "Felsen", "Insekt", "nichts", "Läufer", "lernen", "würgen", "Nacken", "Corona", "Eisbär", "Norden", "Afrika", "Hocker", "Mexiko", "Fühler", "Gewalt", "Mantel", "Windel", "Donner", "Ballon", "Löffel", "Portal", "föhnen", "Knospe", "weinen", "Magnet", "Neptun", "singen", "Tablet", "Pfütze", "Mozart", "Safari", "Bagger", "Filter", "Sudoku", "wählen", "Narwal", "hüpfen", "Slinky", "Becken", "Aimbot", "Knödel", "Kredit", "Muskel", "Mikado", "Barbar", "Barsch", "Moskau", "Rücken", "Fossil", "Grotte", "Dynamo", "Seuche", "Orange", "Wiesel", "Büffel", "Narnia", "Stativ", "Leiter", "Indien", "Vampir", "Zikade", "Pinsel", "Rahmen", "Gandhi", "Beamer", "kochen", "Buddha", "Aufzug", "Lüfter", "Studio", "Dikdik", "Kamera", "Sessel", "Manege", "Rennen", "Schwan", "Teufel", "Twitch", "Widder", "Geweih", "Leiche", "Arbeit", "Köcher", "Ordner", "Cartoon", "Fußball", "Mädchen", "Königin", "Origami", "Schrank", "pfeifen", "Urknall", "Drucker", "Karaoke", "Libelle", "Italien", "Megafon", "Schwarm", "Pistole", "Polizei", "digital", "Lachgas", "Tabelle", "Forelle", "Panther", "brüllen", "Freibad", "flüssig", "Toaster", "pieksen", "Ferrero", "träumen", "Schmerz", "Fassade", "wackeln", "Vanille", "Hashtag", "Bargeld", "Amerika", "Dreieck", "Blitzer", "Cricket", "sperren", "Rentner", "keuchen", "Porsche", "Abgrund", "Sekunde", "Youtube", "Limette", "Schwamm", "Schacht", "Alkohol", "googeln", "Pinguin", "Militär", "Dracula", "Neumond", "Zigarre", "Giraffe", "Murmeln", "Lametta", "Tsunami", "Geologe", "Flasche", "Rüstung", "Pokemon", "Komödie", "berühmt", "Viertel", "Sheriff", "Creeper", "Eiszeit", "Spotify", "Dynamit", "Roboter", "Barcode", "Verlies", "Gärtner", "Muskete", "Marimba", "Kellner", "Phoenix", "Samstag", "Scanner", "Popcorn", "Stiefel", "Spiegel", "positiv", "spielen", "klebrig", "Kirsche", "trinken", "Prozent", "Zitrone", "Windrad", "Lexikon", "Machete", "Corrida", "kratzen", "Barbier", "Stadion", "Rasseln", "Chirurg", "drücken", "Auspuff", "MacBook", "Fritten", "Looping", "Gourmet", "Muschel", "Brocken", "Pompeji", "Frisbee", "Shampoo", "Ehefrau", "Oktopus", "grinsen", "Telefon", "Richter", "Kapitän", "Verkehr", "Kranich", "Student", "Harpune", "schwach", "Meister", "Spitzer", "Vlogger", "treiben", "Laterne", "Parkuhr", "Gedicht", "Billard", "Elefant", "Monokel", "Schmied", "Kuckuck", "draußen", "langsam", "Marokko", "abheben", "Cockpit", "Walnuss", "Bleiche", "Falafel", "Protest", "platzen", "rülpsen", "Freitag", "töpfern", "Papagei", "Stöpsel", "Peugeot", "Angebot", "Hubraum", "Nordsee", "kraulen", "tauchen", "Atomuhr", "Seeigel", "Rutsche", "Spritze", "Torpedo", "Schädel", "Getränk", "klicken", "Schwert", "Fußende", "Samsung", "Litschi", "spannen", "Schwanz", "AirPods", "Ukulele", "Maßstab", "Vatikan", "Fenster", "stechen", "Seelöwe", "niedrig", "Rettich", "Fleisch", "Zeitung", "Magazin", "Spargel", "Ehemann", "Posaune", "Eisberg", "Ohrring", "Discord", "Jupiter", "riechen", "Android", "Klingel", "Nachbar", "Tornado", "Bankier", "Karpfen", "Piranha", "Bugatti", "Spirale", "Monster", "Sehtest", "Mauspad", "Nashorn", "klingen", "spucken", "Okarina", "waschen", "Schwein", "Spanien", "Schweiß", "Joghurt", "Kreisel", "Aquaman", "brennen", "Praline", "pflügen", "Achteck", "Firefox", "sabbern", "brünett", "Plunder", "Tourist", "Sprache", "funkeln", "Kendama", "traurig", "Trophäe", "Grabmal", "Kniffel", "herzlos", "Anzeige", "bekifft", "Pipette", "Traktor", "Skyline", "Stempel", "schauen", "Gumball", "Granate", "Moskito", "Perücke", "Sixpack", "Doritos", "Seetang", "Hydrant", "Tollwut", "Twitter", "Lakritz", "Vietnam", "Skelett", "wachsen", "Hörtest", "Maibaum", "Quadrat", "Wildnis", "Pegasus", "Babyfon", "Vorhang", "Saxofon", "undicht", "Zwiebel", "Braille", "Parasit", "Sonntag", "Kolibri", "Komiker", "Katalog", "England", "Kompass", "Renault", "Gesicht", "Tablett", "Schweiz", "Samurai", "Maßband", "Erdnuss", "Koralle", "Arielle", "Florida", "Skilift", "Ravioli", "Hamburg", "Sanduhr", "Veranda", "Telekom", "Patriot", "Krieger", "Fahrrad", "doppelt", "Heizung", "Karotte", "Hipster", "schnell", "Prüfung", "negativ", "Aladdin", "Werbung", "Medizin", "Smaragd", "Bitcoin", "Galaxie", "Whiskey", "Wohnung", "Serbien", "sterben", "Venedig", "Thymian", "Familie", "Äffchen", "Diamant", "Grillen", "Graphit", "Eintopf", "Tropfen", "Äquator", "Avocado", "Trainer", "Pflaume", "dreckig", "Waluigi", "Gandalf", "Nahrung", "Beatbox", "lächeln", "Ukraine", "Spieler", "Bowling", "Dreirad", "Ketchup", "Savanne", "Scheune", "Belgien", "beatmen", "fliegen", "Trauben", "Malbuch", "Grizzly", "Erdkern", "Oberarm", "Konsole", "Gazelle", "Märchen", "Ferrari", "Titanic", "Xylofon", "Schleim", "kitzeln", "schwarz", "Klavier", "Diabolo", "Frieden", "Brunnen", "Glitzer", "Bahnhof", "Seehund", "Omelett", "Garnele", "drinnen", "Somalia", "Fallout", "Tochter", "Werwolf", "Kloster", "Kratzer", "Distanz", "Zahnfee", "Armband", "Ägypten", "Brownie", "Steuern", "Friseur", "Knochen", "Strumpf", "Florist", "Windows", "Gorilla", "Festung", "Alphorn", "Seerose", "Quartal", "Paprika", "Pudding", "umarmen", "Seewolf", "Lüftung", "Matrose", "Burrito", "Pfeffer", "Parcour", "Asterix", "Falltür", "Patrone", "Picasso", "Zahnrad", "Camping", "Nirwana", "Verband", "rauchen", "Konzert", "rechnen", "Gebäude", "Dessert", "Arterie", "Axolotl", "Ohrwurm", "Pelikan", "Leopard", "Cupcake", "Teppich", "Baklava", "Strudel", "Bigfoot", "Nutella", "Flipper", "Narkose", "Hamster", "Spender", "Vitamin", "Gitarre", "Trommel", "Einhorn", "Violine", "Fechten", "Veganer", "prallen", "bremsen", "Ballett", "Pastete", "Nordpol", "Walross", "Rentier", "Netflix", "Pflanze", "Scholle", "Uniform", "erröten", "Hebamme", "Drehtür", "Känguru", "Zentaur", "Pikachu", "Knöchel", "Trüffel", "Zeugnis", "Fischer", "Sprudel", "Lasagne", "Poseidon", "Lotterie", "Publikum", "Dänemark", "Amethyst", "Sandwich", "Mittwoch", "bleichen", "reinigen", "vertikal", "Vollmond", "Russland", "Turmalin", "Astgabel", "Rechnung", "Zehnagel", "stottern", "Eidechse", "anzeigen", "Sandburg", "Glühwein", "Maulwurf", "parallel", "Reaktion", "besessen", "Tagtraum", "Armbrust", "Stoppuhr", "Godzilla", "Mikrofon", "Atompilz", "Windsack", "Fahrzeug", "Gewitter", "Maniküre", "Kohlrübe", "Maikäfer", "Arbeiter", "Fernglas", "Langlauf", "Albtraum", "Laubsäge", "Kätzchen", "schlafen", "Hochzeit", "Asterisk", "Atlantis", "Splatoon", "Krawatte", "Fotograf", "Dickkopf", "umkehren", "berühren", "Meteorit", "Teekanne", "Addition", "Garfield", "Detektiv", "Schinken", "Alufolie", "Youtuber", "Streamer", "Keyboard", "begrüßen", "Windhose", "Songtext", "Tierheim", "rutschig", "Ellbogen", "E-Gitarre",
        "Schimmel", "Wilderer", "Mallorca", "Tiramisu", "Peperoni", "arbeiten", "Medaille", "Tretboot", "kopieren", "Steigung", "verletzt", "Skulptur", "Getreide", "Rapunzel", "Fußmatte", "Lutscher", "Knuckles", "Bücherei", "Gewinner", "Wachturm", "Singapur", "erinnern", "Gangster", "Wrestler", "Kreuzung", "Schlacht", "schenken", "Vodafone", "Schlauch", "anzünden", "Passwort", "Cerberus", "Snapchat", "Pyramide", "Geschäft", "Flugzeug", "Seilbahn", "flüstern", "Schleier", "Schulter", "betrügen", "verwirrt", "Maulkorb", "Satellit", "Kanister", "Nintendo",
        "Karamell", "Skalpell", "Antilope", "Schraube", "Keksdose", "verrückt", "Zahnarzt", "kuscheln", "Rockstar", "predigen", "Halsband", "Kopftuch", "Eselsohr", "Terrasse", "Sandbank", "Jahrbuch", "Olivenöl", "befehlen", "Goldtopf", "mürrisch", "Zylinder", "westlich", "Aufnahme", "Flamingo", "Fastfood", "Vogelbad", "Schlaufe", "Zickzack", "Hufeisen", "Bullseye", "Slowakei", "seekrank", "Asteroid", "schlagen", "Schlumpf", "Cocktail", "Katapult", "Plankton", "Kleinbus", "Grönland", "Kristall", "Marathon",
        "Portrait", "Deadpool", "Festival", "Mercedes", "Giftmüll", "Sitzbank", "schlecht", "Batterie", "kleckern", "abstrakt", "Schüssel", "Karneval", "Schienen", "Schranke", "Kroatien", "chemisch", "Anatomie", "Schleife", "Oberteil", "Rucksack", "Lavendel", "Champion", "Smarties", "Rennboot", "Pinzette", "Teddybär", "Snickers", "Weinrebe", "zwinkern", "Espresso", "Biologie", "Handtuch", "Amazonas", "Zypresse", "Rechteck", "Diskette", "klettern", "niedlich", "Fortnite", "Autobahn", "Minigolf", "Internet", "Geschenk", "Biotonne", "Munition", "Indianer", "Norwegen", "Waschbär", "Speichel", "Rasierer", "Schlägel", "Herkules", "stolpern", "Klempner", "Revolver", "Pringles", "Aquarium", "Schaufel", "Halbmond", "Rückgrat", "Napoleon", "Periskop", "rutschen", "Sechseck", "Schlange", "Kopflaus", "Atomkern", "Faultier", "Toilette", "Miniclip", "Schminke", "Teelicht", "Dienstag", "CD-Player", "Schnecke", "Tastatur", "Diabetes", "Physalis", "Baseball", "Anführer", "scrollen", "Überfall", "schreien", "Horizont", "Anhalter", "Hörgerät", "Gasmaske", "Ohrhörer", "Realität", "Friedhof", "Tentakel", "Splitter", "besuchen", "Schweden", "Tinnitus", "Himbeere", "Nilpferd", "Odysseus", "Calamari", "Zauberer", "Skrillex", "versagen", "Zucchini", "stricken", "Obstkorb", "Polizist", "Triangel", "Schalter", "Windpark", "Truthahn", "Tierarzt", "Barbecue", "wünschen", "Sitzsack", "Raclette", "Reporter", "Thailand", "Sandalen", "Aprikose", "Bumerang", "Pflaster", "Veilchen", "Anakonda", "Pakistan", "Fässchen", "Zeppelin", "erzählen", "Nasenbär", "Webseite", "Elektron", "Trompete", "Simbabwe", "Pistazie", "Jagdziel", "Anhänger", "kriechen", "Hühnchen", "Facebook", "Fahrbahn", "Schotter", "Theremin", "Goldesel", "Skittles", "Kalender", "Suchhund", "kopfüber", "Fahrwerk", "Superman", "Brokkoli", "Erdbeben", "Motorrad", "Knoppers", "Peitsche", "Jalapeno", "Blutegel", "Anfänger", "Minirock", "Zeitlupe", "Kopfende", "Skorpion", "Bajonett", "Unterarm", "Rumänien", "Portugal", "Computer", "Priester", "Sombrero", "Einstein", "Division", "geduldig", "Konfetti", "Fujiyama", "Schlucht", "Haarband", "Zwieback", "kabellos", "Enderman", "Handkuss", "Allergie", "Invasion", "Skimaske", "Meerenge", "Stoßzahn", "WhatsApp", "Panflöte", "Dionysos", "Reinheit", "Erdbeere", "Maschine", "Hüpfburg", "Frühling", "Seestern", "Polyphem", "Bratsche", "Krokodil", "Matratze", "Kohlrabi", "Suchbild", "stampfen", "Mahlzeit", "Südkorea", "Sprecher", "Kaugummi", "Baumhaus", "Schaukel", "Groschen", "Albatros", "Maisfeld", "Picknick", "Orchidee", "ausruhen", "Eischnee", "Augenlid", "Passfoto", "Kastanie", "Schatten", "Netzwerk", "Postbote", "Alphabet", "Seegurke", "Dirigent", "rasieren", "Molkerei", "struppig", "schweben", "Teleskop", "Pfirsich", "Bärlauch", "Schwalbe", "Trichter", "Algerien", "schießen",
        "Fernrohr", "Rennauto", "Juwelier", "Religion", "Weinglas", "Bäckerei", "Tagebuch", "Sellerie", "Dampflok", "Augapfel", "Schnabel", "Filmriss", "Tablette", "tropisch", "Bullauge", "Finnland", "Baguette", "Weltraum", "Hähnchen", "Monopoly", "Versteck", "Rollator", "Staudamm", "Pobacken", "Lötlampe", "Schnauze", "Tartaros", "Diagramm", "Blizzard", "Vuvuzela", "Graffiti", "schielen", "Pullover", "Dompteur", "Limonade", "Broadway", "Warnweste", "Katamaran", "behindert", "Rollladen", "verwelken", "DVD-Player", "Komponist", "Labyrinth", "Amsterdam", "ängstlich", "Bundestag", "obdachlos", "Photoshop", "kostenlos", "Brasilien", "Toastbrot", "Frettchen", "Feuerball", "Zitteraal", "Fluglinie", "Röstaroma", "Rosenkohl", "Aubergine", "Zwillinge", "Nordkorea", "Serviette", "Instagram", "Gugelhupf", "Flachdach", "Präsident", "Fernseher", "Community", "Lebkuchen", "betrunken", "Triebwerk", "Glücksrad", "Malkasten", "angreifen", "schminken", "Barkeeper", "Marihuana", "Schnuller", "Fließband", "Apfelsaft", "Badekappe", "Mistgabel", "Brustkorb", "Inhalator", "Windmühle", "Beinrasur", "einkaufen", "Autoradio", "Werkstatt", "Comicbuch", "Cabriolet", "Autogramm", "Regisseur", "Minecraft", "Grammofon", "Stalagmit", "Wrestling", "Bräutigam", "Parkplatz", "Verlierer", "Paintball", "Nachtisch", "Gymnasium", "Giftzwerg", "Zahnlücke", "Mandarine", "Ingenieur", "erbrechen", "Vogelhaus", "Badminton", "Wolverine", "Pinocchio", "Müllkippe", "Architekt", "ertrinken", "Großvater", "Bulldozer", "aufwachen", "Schublade", "Schleuder", "Tonleiter", "Thunfisch", "Fahrkarte", "Golfwagen", "Raffaello", "Tauchgang", "Querflöte", "Steinpilz", "Reisepass", "Haselnuss", "Spiderman", "Badewanne", "Türklinke", "Spitzmaus", "vorspulen", "Antivirus", "Hollywood", "Schlitten", "Brombeere", "Knoblauch", "Flohmarkt", "Margarine", "Kopfhörer", "Stalaktit", "Hologramm", "Hammerhai", "epilieren", "Feuerzeug", "Zoowärter", "klatschen", "Abschluss", "schlüpfen", "Kolumbien", "Diagonale", "Kaninchen", "Lieferung", "Spaghetti", "Lorbeeren", "Pantomime", "Treibsand", "glücklich", "Glühbirne", "Philosoph", "Spielzeug", "Haarspray", "Overwatch", "chaotisch", "Badeanzug", "Spartacus", "Kraftwerk", "Kokosnuss", "Chihuahua", "Entdecker", "Surfbrett", "insolvent", "Sandsturm", "Professor", "Eiskaffee", "Sonnenbad", "Reisender", "Kraftfeld", "Gefängnis", "Baumkrone", "Tic-Tac-Toe", "Baumwolle", "Blaupause", "Geografie", "Damenbart", "Killerwal", "Zahnstein", "Mülleimer", "vergessen", "Monobraue", "Ungeheuer", "schwingen", "Propeller", "Pechvogel", "Kaktuseis", "Briefkopf", "Feuerwerk", "Hamburger", "Nachtclub", "gestresst", "Bergkette", "Teelöffel", "Scheidung", "zerreißen", "Injektion", "Blasebalg", "Türsteher", "Goldfisch", "Edelstein", "fabelhaft", "Schicksal", "Flughafen", "Recycling", "Stepptanz", "Antarktis", "überholen", "schreiben", "Sternbild", "Adrenalin", "depressiv", "Gummiband", "Apotheker", "Krankheit", "Esspapier", "Orchester", "Katzenhai", "Handschuh", "Silvester", "Schlüssel", "schütteln", "Akkordeon", "Burgruine", "Stuhlbein", "Lagerhaus", "Häuptling", "Paparazzi", "Flutlicht", "Segelboot", "Nachthemd", "massieren", "Pendeluhr", "Mischpult", "Saftladen", "Steinzeit", "Spongebob", "Nasenring", "Gummiente", "Trampolin", "Mikroskop", "Beethoven", "Atombombe", "königlich", "Zigarette", "Aufhänger", "Makkaroni", "Chinatown", "Strohhalm", "Kleinkind", "Unterhose", "Gießkanne", "Planwagen", "Totenkopf", "Bleistift", "Südafrika", "Schnupfen", "Halbkreis", "Grabstein", "Barcelona", "Basilikum", "PewDiePie", "Buntstift", "Apfelkern", "Frühstück", "Epilepsie", "Aufkleber", "Lavalampe", "Duschkopf", "Bomberman", "Strahlung", "Dudelsack", "Steuerrad", "fernsehen", "Kuhglocke", "Wundbrand", "Erkältung", "Cranberry", "Bettwanze", "Alchemist", "schwimmen", "schnitzen", "Countdown", "ClickBait", "Orang-Utan", "Limousine", "Lederhose", "Regenwald", "Erfindung", "Federball", "Löwenzahn", "Rollstuhl", "Wohnwagen", "Nachricht", "Universum", "Osterhase", "Tretmühle", "erfrieren", "Wohlstand", "Kleeblatt", "Excalibur", "Kolosseum", "Bratwurst", "Sicherung", "Vermieter", "unendlich", "Goldkette", "Spiegelei", "Schwimmer", "Exkrement", "Elfenbein", "Nudelholz", "Sackgasse", "Microsoft", "Teletubby", "Bildhauer", "Notre-Dame", "Plätzchen", "Bettdecke", "Haarfarbe", "schlucken", "Zeitbombe", "Alligator", "schwitzen", "Klebeband", "Brüllaffe", "Karussell", "Zimtrolle", "Trinkgeld", "Weißwurst", "LKW-Fahrer", "Croissant", "Milchmann", "gemütlich", "Dschungel", "schwanger", "Geheimnis", "Milchzahn", "Halskette", "Kakerlake", "Bandnudel", "Chewbacca", "Bösewicht", "Reflexion", "Gekritzel", "Werbespot", "Rezeption", "Beziehung", "Strommast", "aufnehmen", "McDonalds", "verlassen", "Gentleman", "Zahnseide", "Garderobe", "Skydiving", "Kartoffel", "Tambourin", "Kontinent", "Stinktier", "Pizzabote", "Frutarier", "Sarkophag", "Bernstein", "Ladegerät", "Terrarium", "Gymnastik", "Operation", "Bauernhof", "Mistkäfer", "schmelzen", "Einschlag", "Fingerhut", "Raumanzug", "versöhnen", "übergeben", "studieren", "Katzenklo", "Klobrille", "Eierlikör", "Blaubeere", "Blaulicht", "Nagellack", "Lachgummi", "Astronaut", "Postkarte", "Kniebeuge", "Steckdose", "Snowboard", "Muttermal", "Stirnband", "Riesenrad", "Gänsehaut", "Zahnpasta", "Blattlaus", "Bedienung", "Gladiator", "Notizbuch", "Marmelade", "aufwerten", "Müllwagen", "Cerealien", "Drillinge", "Waldbrand", "Chamäleon", "Interview", "Explosion", "Eiszapfen", "Teebeutel", "Animation", "Baumstamm", "Evolution", "Dachboden", "Schaffner", "Kredithai", "3D-Drucker", "Luxemburg", "Generator", "Nasenhaar", "schneiden", "Bestatter", "Suezkanal", "Busfahrer", "feuerfest", "Deodorant", "gehorchen", "drechseln", "inkognito", "Staffelei", "Schweißer", "Halbinsel", "Symphonie", "Tauziehen", "Steinbock", "Zugbrücke", "Honigwabe", "Einsiedler", "Schutzhelm", "Puppenhaus", "Realschule", "Sprungturm", "Handschlag", "Kegelrobbe", "machomäßig", "Kinderarzt", "Brathering", "Geburtstag", "übersetzen", "Ringfinger", "Glückskeks", "Tachometer", "Basketball", "Mausefalle", "Bücherwurm", "Raumschiff", "Brusthaare", "Bärenfalle", "Burggraben", "Türstopper", "reparieren", "Katzenauge", "Afrofrisur", "Halskrause", "Hausnummer", "Frankreich", "Dreadlocks", "Wasserhahn", "Schnorchel", "Baumschule", "Beerdigung", "Gefangener", "Archäologe", "Elektriker", "Katzengold", "Grapefruit", "Goldbarren", "Schimpanse", "verdampfen", "Kronkorken", "Altersheim", "unsichtbar", "Purzelbaum", "Notizblock", "Schlagzeug", "Höhenangst", "Eisfischen", "Mechaniker", "Tresorraum", "Badezimmer", "Solarzelle", "Neuseeland", "Schienbein", "Kathedrale", "Polarlicht", "Petersilie", "Clownfisch", "meditieren", "Volleyball", "Whiteboard", "Glückspilz", "Waisenkind", "Leuchtstab", "Etagenbett", "Klebestift", "Rolls-Royce", "Wohnzimmer", "Handgelenk", "Schubkarre", "Brecheisen", "Sensenmann", "Spielplatz", "Wasserball", "Brieftaube", "Wasserfall", "Darsteller", "Schokolade", "Geschlecht", "Vegetarier", "Guillotine", "Hamsterrad", "Rasenmäher", "Weitsprung", "Tschechien", "Laubbläser", "Rolltreppe", "Radieschen", "Käseglocke",
        "Laubhaufen", "beschützen", "Wunderland", "Himmelbett", "Kaulquappe", "Sumoringer", "Leiterbahn", "Tankstelle", "Türschloss", "Holzfäller", "Spitzhacke", "Fischgräte", "Bauchnabel",
        "Zahnspange", "Kartenhaus", "Abonnement", "Eierbecher", "Hausschuhe", "Taschenuhr", "Vogelbeere", "Strandkorb", "Kugelfisch", "Pfadfinder", "Ladebalken", "Luftschiff", "Stoßstange", "Tumbleweed", "Feueralarm", "Abendessen", "Sesamsamen", "Verbrecher", "Höllenhund", "bezaubernd", "Kontrabass", "Busbahnhof", "Kabelsalat", "Winkekatze", "Augenbraue", "Aasfresser", "Papiertüte", "Bestrafung", "Handfläche", "Bluterguss", "Kreuzotter", "Schlafsack", "Kofferraum", "Madagaskar", "Falschgeld", "Skateboard", "Volkswagen", "Cappuccino", "Armbanduhr", "Mayonnaise", "Baumstumpf", "Tierfutter", "Augenringe", "Kreuzfahrt", "Kettensäge", "Armdrücken", "Windbeutel", "Sauerstoff", "Haarspange", "Entensuppe", "Lagerfeuer", "Hängematte", "Widerstand", "Adamsapfel", "Klemmbrett", "Topflappen", "Feierabend", "jonglieren", "Smartphone", "Analphabet", "rückgängig", "Tannenbaum", "Mozzarella", "Aftershave", "Halbleiter", "Eiersuchen", "Körperteil", "Indonesien", "Superkraft", "Sandkasten", "Cinderella", "skribbl.io", "Todesstern", "Lautstärke", "Klappstuhl", "Hürdenlauf", "Zauberstab", "Wendekreis", "Blutspende", "Salzwasser", "Pusteblume", "Coffeeshop", "Prinzessin", "Besenstiel", "Bademantel", "Mathematik", "Didgeridoo", "Skischanze", "Leichtsinn", "Spüllappen", "Nussschale", "Klarinette", "Baumkuchen", "Milchshake", "Motorhaube", "Furzkissen", "Stonehenge", "Oberfläche", "Koteletten", "Ohrmuschel", "Gesundheit", "Eisbrecher", "Mikrowelle", "Geldwäsche", "Temperatur", "Scherzkeks", "Herzschlag", "Seifenoper", "vergrößern", "elektrisch", "Augenbinde", "Seiltänzer", "Zuckerguss", "Käsekuchen", "Geodreieck", "Grashüpfer", "Sweatshirt", "Eiffelturm", "Nagelfeile", "Fledermaus", "Brettspiel", "Schneeball", "Minotaurus", "Jahreszeit", "Saftpresse", "Donnerstag", "Supermarkt", "Schlachter", "Denkzettel", "Tischdecke", "Kameramann", "Dalmatiner", "Landschaft", "Großmutter", "Taxifahrer", "Regenbogen", "Einhornwal", "Talentshow", "Ärmelkanal", "Marshmello", "Zahnbürste", "Farbroller", "Essiggurke", "Marionette", "Experiment", "Videospiel", "Verpackung", "Tragfläche", "Apokalypse", "Kuchenteig", "Österreich", "Terminator", "Vogelkäfig", "Achterbahn", "Champagner", "Obstgarten", "Bruderherz", "Untergrund", "Kettenhemd", "Ziegenbart", "Wasserbett", "Wasserturm", "Textmarker", "Journalist", "Fallschirm", "Messbecher", "Nachtlicht", "Krummsäbel", "Backenzahn", "Aristokrat", "Holzscheit", "Verstärker", "Hawaiihemd", "Chinchilla", "Schwimmbad", "Zündschnur", "trainieren", "Kitesurfen", "Küchentuch", "Murmelbahn", "Australien", "Patenonkel", "Murmeltier", "Sauerkraut", "Restaurant", "Saugglocke", "Wetterhahn", "Breakdance", "Ameisenbär", "Taufbecken", "Trittstufe", "Hackbraten", "Erfrierung", "Klingelton", "Müllabfuhr", "Feuerwache", "Arztkoffer", "Hampelmann", "Gürteltier", "Faustkampf", "Wörterbuch", "Panzerband", "Stecknadel", "Paraglider", "Bildschirm", "Helikopter", "Schneemann", "Schottland", "Geldbeutel", "Psychologe", "Fadenkreuz", "Rollschuhe", "Leuchtturm", "Tupperdose", "Schneehase", "Sprühfarbe", "Stewardess", "Blumenkohl", "Goldnugget", "schüchtern", "detonieren", "Zimmermann", "Hundehütte", "Hosenstall", "Fettuccine", "Windsurfer", "Atmosphäre", "Callcenter", "Güterwagen", "Bügeleisen", "Stimmgabel", "Stethoskop", "Treppenhaus", "Katastrophe", "Sowjetunion", "Fingernagel", "Sesamstraße", "Schneebesen", "Hochstapler", "Playstation", "Bienenstich", "schwindelig", "Sockenpuppe", "Hängebrücke", "Beförderung", "Straßenbahn", "Sonnenbrand", "Seifenblase", "Schatzinsel", "Motherboard", "Maskottchen", "Nasenspitze", "Hirschkäfer", "Nagelpflege", "Rotkehlchen", "Osterinseln", "Partnerlook", "Froschkönig", "Liebesbrief", "Philippinen", "Stegosaurus", "unsterblich", "Heckspoiler", "Seilrutsche",
        "Speisekarte", "Strumpfhose", "farbenblind", "Fischernetz", "Knallfrosch", "Bankdrücken", "Schlafmütze", "Milchstraße", "Rindfleisch", "Hafenbecken", "Schneesturm", "Tischtennis", "Spinnennetz", "Dachschaden", "Renaissance", "Überschrift", "Ziegelstein", "Hosentasche", "Abflussrohr", "Bücherregal", "Schlagsahne", "Matrjoschka", "Wunschliste", "Reifenpanne", "Rauchmelder", "Nähkästchen", "Warndreieck", "Marterpfahl", "Osterglocke", "Augenklappe", "Nähmaschine", "Tutanchamun", "Wäscheleine", "Vogelspinne", "Fensterbank", "Hausmeister", "Radiergummi", "Schneekette", "Schamesröte", "Anglerfisch", "Flaschenzug", "Traubensaft", "Taschengeld", "Sternfrucht", "Wandteppich", "Litfaßsäule", "Muskelkater", "Nadelkissen", "Kuckucksuhr", "Filmemacher", "Bahnschiene", "Pinienkerne", "Farbpalette", "Zielscheibe", "Schneemobil", "Wasserwaage", "Reagenzglas", "überwintern", "Bürgersteig", "Stoßdämpfer", "Sparschwein", "Kuchengabel", "Geldautomat", "Stangenbrot", "Kohlensäure", "Schneefuchs", "Kinderwagen", "Cheerleader", "Gipfelkreuz", "Blindenhund", "Traumfänger", "Leiterwagen", "Besenkammer", "Feldstecher", "Pfannkuchen", "Tortenheber", "Wanderstock", "Mottenkugel", "Berühmtheit", "Busenfreund", "Preisschild", "Kichererbse", "Schutzengel", "Punktestand", "Telefonbuch", "Autoclicker", "Triceratops", "Nasenbluten", "Staubsauger", "Schnurrbart", "Lesezeichen", "Lidschatten", "Mitternacht", "Eselsbrücke", "Haltestelle", "marschieren", "Waschmittel", "Pfauenfeder", "Brillenetui", "Schneeengel", "Wildschwein", "Erdmännchen", "Absperrband", "Untersetzer", "Niederlande", "Schäferhund", "Hexenschuss", "Mähdrescher", "Honiglöffel", "Baskenmütze", "Schornstein", "Apfelkuchen", "Nasenlöcher", "Rückspiegel", "kugelsicher", "Unterwäsche", "Liegestütze", "Weintrauben", "Fliegenpilz", "verschütten", "Schildkröte", "Kartenspiel", "Buttermilch", "Gewächshaus", "Schlumpfine", "Oktoberfest", "Heuschrecke", "Meteorologe", "Kühlschrank", "Dinosaurier", "Plastiktüte", "Zahnstocher", "Schuhkarton", "Lippenstift", "Kalifornien", "Schwarz-Weiß", "Achselhöhle", "Schwerkraft", "Kreditkarte", "Essstäbchen", "Mistelzweig", "Kurzschluss", "provozieren", "Zeigefinger", "Panzerfaust", "Hauptschule", "Verbrennung", "Briefkasten", "Grafikkarte", "Kirschblüte", "Vulkanologe", "Argentinien", "Tischplatte", "Wüstenfuchs", "Bauarbeiter", "Rennstrecke", "Kletterwand", "Sechserpack", "Thermometer", "Fingerpuppe", "Schlafanzug", "Raumstation", "Waffeleisen", "Büroklammer", "Tunnelblick", "Kerzendocht", "Wärmflasche", "Ringelblume", "Sonnencreme", "Rollenspiel", "verteidigen", "Geisterbahn", "Schneekugel", "Kommunismus", "Bärenhunger", "Highlighter", "Armleuchter", "Regenmantel", "Stromschlag", "Skispringen", "Elektroauto", "Feuerstelle", "Regenschirm", "Schaumkrone", "Bauchredner", "Lamborghini", "Luftschloss", "Minesweeper", "Universität", "Subtraktion", "Granatapfel", "Brieföffner", "Sprechblase", "Abrissbirne", "Bienenstock", "Vogelstrauß", "Zuckerwatte", "Wirbelsäule", "Kennzeichen", "Erwachsener", "Süßigkeiten", "Glücksspiel", "Waschstraße", "Nagelschere", "Dosenöffner", "Brennnessel", "Waschlappen", "Nussknacker", "Dachfenster", "Ameisenigel", "Flammkuchen", "Taschentuch", "wiederholen", "Zaubertrick", "Stoppschild", "Rotkäppchen", "Mittagessen", "Streichholz", "Auflaufform", "Haarschnitt", "Bademeister", "vollständig", "Morgenstern", "Suppenkelle", "Schnapsglas", "Kugelstoßen", "Waschbecken", "Kieselstein", "Marienkäfer", "Sonnenblume", "Steuergerät", "Machu-Picchu", "gelangweilt", "Marshmallow", "Weihnachten", "Wunderlampe", "Klimaanlage", "Artischocke", "Deutschland", "Fernsehturm", "Zaubertrank", "Tintenfisch", "Ratatouille", "Katzenstreu", "zertrümmern", "Küstenwache", "Dornröschen", "Kellerassel", "schnorcheln", "Briefträger", "Krankenhaus", "Kompassnadel", "Tintenklecks", "Fahnenstange", "Telefonkabel", "Kastagnetten", "Seepferdchen", "Kontrollturm", "Eichhörnchen", "Cheeseburger", "Bibliothekar", "Bogenschütze", "Kindergarten", "Lichtschwert", "Würfelqualle", "Velociraptor", "Bohnenstange", "Schauspieler", "Angestellter", "Hieroglyphen", "Kontaktlinse", "Rasierschaum", "asymmetrisch", "Höhlenmensch", "Laboratorium", "Strickleiter", "Lautsprecher", "unterstützen", "Klaviersaite", "Kleiderbügel", "Stubenhocker", "ausgestorben", "Schriftrolle", "Griechenland", "Stacheldraht", "Goldlöckchen", "Schnurrhaare", "Schwertfisch", "Götterspeise", "Schiffstaufe", "Lebensmittel", "Tausendfüßer", "Dachgeschoss", "Befehlshaber", "Schottenrock", "Gartenschere", "Seilspringen", "Ohrenschmalz", "Zauberwürfel", "Nichtraucher", "Gabelstapler", "Gummibärchen", "Schreibtisch", "Schnürsenkel", "Scheibenwelt", "Glühwürmchen", "Wissenschaft", "Eisverkäufer", "Erdnuss-flips", "Scheinwerfer", "Wetterfrosch", "Überlebender", "Frankenstein", "Schlittschuh", "Artischocken", "Rezeptionist", "Führerschein", "Fahrradkette", "Neandertaler", "Lampenfieber", "Schallplatte", "Luftmatratze", "Geistesblitz", "Winterschlaf", "Proteinshake", "Luftschlange", "Eingabestift", "Karteikasten", "Konversation", "Kronleuchter", "Dorfbewohner", "Kanalisation", "Fingerspitze", "Bodybuilding", "Visitenkarte", "Korallenriff", "erschreckend", "Kühlmaschine", "Rettungsring", "Schrotflinte", "Speisekammer", "Meerjungfrau", "Rasiermesser", "Taschenlampe", "Modedesigner", "Aschenbecher", "Segelflieger", "Einzelhandel", "Gepäckträger", "Zuckerstange", "Leidenschaft", "Unterschrift", "Sonnenstrahl", "Tannenzapfen", "Freizeitpark", "Sonnenschirm", "Preiselbeere", "Spaghettieis", "Schiffswrack", "Spülmaschine", "Kanonenkugel", "Lichterkette", "Regentropfen", "Tiefkühlfach", "Feuerlöscher", "Lampenschirm", "Handschellen", "Aschenputtel", "Stachelbeere", "Krankenwagen", "Tierhandlung", "Buttermesser", "Taucheranzug", "verschwinden", "Wasserwerfer", "Korkenzieher", "Laserpointer", "Rasierklinge", "Zeitmaschine", "Wassermelone", "Thermoskanne", "Versicherung", "Rauchzeichen", "Topfschlagen", "bauchpinseln", "Glockenspiel", "Haarschuppen", "Glockenblume", "Wäschespinne", "zurückspulen", "Mittelfinger", "Sonnensystem", "applaudieren", "Wasserpfeife", "Flaschenhals", "Schlauchboot", "Fuchsschwanz", "Sonnenbrille", "Blumenstrauß", "Würfelbecher", "Gänsefüßchen", "Vollkornbrot", "Überraschung", "Telefonzelle", "Inlineskates", "Schneeflocke", "Teufelskreis", "Schnabeltier", "Schreibfeder", "Kriegsschiff", "Süßkartoffel", "Hüpfkästchen", "verschlossen", "Oberschenkel", "Schneekanone", "Flaschenpost", "Ghostbusters", "Gehirnwäsche", "Sternzeichen", "magersüchtig", "Trommelwirbel", "Grafiktablett", "Wolkenkratzer", "Kristallkugel", "Klassenzimmer", "Ameisenhaufen", "Lichtschalter", "Fitnesscenter", "Tintenpatrone", "Schleifpapier", "Wattestäbchen", "Meeresfrüchte", "Arbeitszimmer", "Kopfschmerzen", "Liechtenstein", "Unterschenkel", "herunterladen", "Bananenschale", "Achillessehne", "Rasensprenger", "Mundharmonika", "Handschuhfach", "Pfeffersalami", "Ohrenschützer", "Ringelschwanz", "Schlüsselbund", "Piratenschiff", "Fingerabdruck", "Heiratsantrag", "Uhrzeigersinn", "Warteschlange", "Schlüsselloch", "Segelflugzeug", "Waschmaschine", "Pterodactylus", "Schmetterling", "Gleichgewicht", "Schaltknüppel", "Wellensittich", "Gymnastikball", "Schlafstörung", "Schaukelpferd", "Lockenwickler", "Defibrillator", "Wäscheklammer", "Patronenhülse", "Mineralwasser", "Feuerwehrmann", "teleportieren", "Sternschnuppe", "Papierflieger", "Kondenswasser", "Geisterfahrer",
        "Einschränkung", "Wunschbrunnen", "Federmäppchen", "Fischstäbchen", "Observatorium", "Gänseblümchen", "Demonstration", "Meeresspiegel", "Wasserrutsche", "Bremsschwelle", "Flammenwerfer", "Vogelscheuche", "Schweinestall", "Einbahnstraße", "Kerzenständer", "hypnotisieren", "Milchschnitte", "Bienenkönigin", "Drachenfrucht", "Kartoffelbrei", "Kanarienvogel", "Nachbarschaft", "Wasserpistole", "Eierschachtel", "Sonnenaufgang", "Reinkarnation", "Schlüsselbein", "Gummiwürmchen", "schlafwandeln", "Trillerpfeife", "Zimmerpflanze", "Lebkuchenhaus", "Stachelrochen", "Erdnussbutter", "Kaugummikugel", "Silberbesteck", "Archaeopteryx", "Kernkraftwerk", "Geisterschiff", "Kürbislaterne", "Rettungsweste", "Schwarzpulver", "Schlafenszeit", "Krümelmonster", "Scharfschütze", "Ampelmännchen", "Zebrastreifen", "Pfannenwender", "Straßensperre", "Einkaufswagen", "Schnellstraße", "Feuerwehrauto", "Verkehrsinsel", "Pferdeschwanz", "Zwischendecke", "Lebkuchenherz", "Taschenmesser", "Brachiosaurus", "Schneekönigin", "Winterstiefel", "Bürgermeister", "Programmierer", "Fernbedienung", "Schaukelstuhl", "Leuchtreklame", "Haubentaucher", "Fensterklappe", "Hamsterbacken", "übergewichtig", "Photosynthese", "Weihnachtsbaum", "Außerirdischer", "Schreibschrift", "Heißluftballon", "Kaffeemaschine", "Stockcarrennen", "Zirkusdirektor", "sternhagelvoll", "Höhlenforscher", "Parallelogramm", "Sommersprossen", "Flaschendrehen", "zusammenzucken", "Heiligenschein", "Weihnachtsmann", "Grubenarbeiter", "Abschleppwagen", "Kugelschreiber", "Überschwemmung", "Motorradfahrer", "Galgenmännchen", "Armaturenbrett", "Frühlingsrolle", "Tennisschläger", "Strichmännchen", "Flaschenöffner", "Alphastrahlung", "Werkzeugkasten", "Science-Fiction", "Schaumschläger", "Luftkissenboot", "Reißverschluss", "Gefrierschrank", "Kleiderständer", "Kissenschlacht", "Schriftsteller", "Straßenlaterne", "differenzieren", "Notenschlüssel", "Radioaktivität", "Krokodilsträne", "Brustschwimmen", "untergewichtig", "Stachelschwein", "Geschirrspüler", "Wildwasserbahn", "Großbritannien", "Irokesenfrisur", "Nichtschwimmer", "Taschenrechner", "Multiplikation", "Vulkanausbruch", "Bushaltestelle", "Kerzenleuchter", "Kartoffelsuppe", "Kleiderschrank", "Schneewittchen", "Heizungskessel", "Geschenkpapier", "Kaiserschmarrn", "Schiedsrichter", "Aussichtspunkt", "Schlammschlacht", "Toilettenbürste", "Schraubendreher", "Modelleisenbahn", "Räucherstäbchen", "prokrastinieren", "Waschbrettbauch", "Doppeldeckerbus", "Christbaumkugel", "Brillenputztuch", "Wissenschaftler", "Toilettenpapier", "Gottesanbeterin", "Freiheitsstatue", "Bananenplantage", "Verfolgungsjagd", "Schneeglöckchen", "fleischfressend", "Nikolausstiefel", "Sattelschlepper", "Brillenschlange", "Schulterpolster", "Maschinengewehr", "Schleichwerbung", "Heinzelmännchen", "Netzhautscanner", "Kettenkarussell", "Fliegenklatsche", "Einkaufszentrum", "Scheibenwischer", "Überraschungs-Ei", "Presslufthammer", "Mikrofonständer", "Kreuzworträtsel", "Pflanzenfresser", "Tropfsteinhöhle", "Feuersalamander", "Lüftungsschacht", "Schreibmaschine", "Klapperschlange", "Sicherheitsgurt", "Vorschlaghammer", "Rückenschmerzen", "Wasserkreislauf", "Kartoffelpuffer", "Adventskalender", "Fleischbällchen", "zusammenbrechen", "Nachtsichtgerät", "Altweibersommer", "Getränkeautomat", "Geschirrschrank", "Meerschweinchen", "Baseballschläger", "Champagnersorbet", "Sonnenfinsternis", "Anhängerkupplung", "Krankenschwester", "Sicherheitsnadel", "Wasserfarbkasten", "Röntgenstrahlung", "Hochzeitskutsche", "Spaghettimonster", "Gesichtsbemalung", "Kartoffelschäler", "Hochzeitsglocken", "Skateboardfahrer", "Veröffentlichung", "Schornsteinfeger", "Personenschützer", "Papageientaucher", "Wettervorhersage", "Benachrichtigung", "Asteroidengürtel", "Altglascontainer", "Deckenventilator", "Anrufbeantworter", "Navigationssystem", "Tannenbaumständer", "Verkehrskontrolle", "Vorstellungskraft", "Hängebauchschwein", "Kaltwachsstreifen", "Laktoseintoleranz", "Hochspannungsmast", "Schlüsselanhänger", "Venusfliegenfalle", "Freundschaftsband", "Schreibtischstuhl", "Sicherheitsdienst", "Wasserschildkröte", "Windschutzscheibe", "Schaufensterpuppe", "Paralleluniversum", "Kernspintomografie", "Schraubenschlüssel", "Überwachungskamera", "Satellitenschüssel", "Süßigkeitenautomat", "Schneeballschlacht", "Mitfahrgelegenheit", "Tischtennisschläger", "Bandscheibenvorfall", "Schlangenbeschwörer", "Umweltverschmutzung", "Streichholzschachtel", "Gebrauchtwagenhändler", "Versicherungskaufmann", "Desoxyribonukleinsäure", "Reißverschlussverfahren", "Jay Z", "Ice Age", "Hip Hop", "Big Ben", "tic tac", "Kung Fu", "Van Gogh", "New York", "The Rock", "Among Us", "Bob Ross", "Iron Man", "Juke Box", "Mr. Bean", "Formel 1", "Jet Pack", "Corn Dog", "Yin Yang", "High Five", "Dark Mode", "John Cena", "Moby Dick", "Loch Ness", "Junk Food", "SIM Karte", "Peter Pan", "Hula Hoop", "Vault boy", "Taj Mahal", "King Kong", "Star Trek", "Pizza Hut", "Bruce Lee", "Toy Story", "Mona Lisa", "Elon Musk", "Lady Gaga", "Tetra Pak", "Coca Cola", "Las Vegas", "Milky Way", "Cat Woman", "Mezzo Mix", "Brad Pitt", "Star Wars", "Peppa Pig", "High Heels", "Steve Jobs", "Robin Hood", "Mont Blanc", "Jeff Bezos", "Ed Sheeran", "Katy Perry", "Bugs Bunny", "Totes Meer", "Iron Giant", "Happy Meal", "Rote Beete", "Family Guy", "Morse Code", "High Score", "Bob Marley", "London Eye", "Kinder Joy", "Daffy Duck", "Mario Kart", "Micky Maus", "Heidi Klum", "Bill Gates", "Scooby Doo", "Vin Diesel", "Biene Maja", "Doctor Who", "Usain Bolt", "Miss Piggy", "James Bond", "Pogo Stick", "Kim Jong-Un", "Mel Gibson", "Sailor Moon", "John Lennon", "Hello Kitty", "Donald Duck", "grüne Welle", "goldenes Ei", "Jackie Chan", "Donkey Kong", "Erste Hilfe", "Darth Vader", "Weißes Haus", "Angry Birds", "Blu-ray Disc", "Corn Flakes", "Burger King", "Slender Man", "The Beatles", "Dragon Ball", "Tower Bridge", "Barack Obama", "LeBron James", "Patrick Star", "Harry Potter", "Donald Trump", "Wonder Woman", "Lionel Messi", "Grand Canyon", "Bart Simpson", "toter Winkel", "Chuck Norris", "Mr. Meeseeks", "Social Media", "Lisa Simpson", "Fata Morgana", "Johnny Bravo", "scharfe Soße", "Black Friday", "Boris Becker", "Kinder Bueno", "Isaac Newton", "Kinder Riegel", "Günther Jauch", "Dagobert Duck", "Green Lantern", "Roter Teppich", "Mount Everest", "Homer Simpson", "Rocket League", "Kinder Pingui", "Geometry Dash", "Space Shuttle", "Jimmy Neutron", "Wilder Westen", "Angela Merkel", "frei schweben", "Justin Bieber", "falsche Zähne", "Marge Simpson", "Morgan Freeman", "salto schlagen", "Angelina Jolie", "goldener Apfel", "Berliner Mauer", "Fidget Spinner", "Bungee Jumping", "Kim Kardashian", "Kinder Country", "Mount Rushmore", "Freddie Faulig", "Schwarzes Loch", "Käpt'n Blaubär", "Wladimir Putin", "Susan Wojcicki", "kleiner Finger", "Virtual Reality", "Mark Zuckerberg", "Abraham Lincoln", "Stephen Hawking", "Fred Feuerstein", "Crash Bandicoot", "William Wallace", "Animal Crossing", "Michael Jackson", "Charlie Chaplin", "Süßholz raspeln", "Captain America", "Nintendo Switch", "Sherlock Holmes", "Fitness Trainer", "Heiße Schokolade", "gebrochenes Herz", "Opernhaus Sydney", "Raupe Nimmersatt", "Schweinchen Dick", "Standing Ovation", "Pippi Langstrumpf", "Lightning McQueen", "Kinder Schoko-bons", "Thaddäus Tentakel", "Cristiano Ronaldo", "Leonardo DiCaprio", "Olympische Spiele", "Tyrannosaurus Rex", "Chinesische Mauer", "Brandenburger Tor", "fliegendes Schwein", "Tasmanischer Teufel", "William Shakespeare", "Schwarzwälder Kirschtorte", "Pu der Bär", "Call of Duty", "Eis am Stiel", "Tom und Jerry", "Finn und Jake", "Clash of Clans", "Herr der Ringe", "Tour de France", "Romeo und Julia", "König der Löwen", "Shaun das Schaf", "Vincent van Gogh", "Fast and Furious", "Phineas und Ferb", "Fluch der Karibik", "League of Legends", "Hänsel und Gretel", "Leonardo da Vinci", "Bob der Baumeister", "Great Barrier Reef", "Kinder Choco Fresh", "Satz des Pythagoras", "Simon and Garfunkel", "Seattle Space Needle", "Reise nach Jerusalem", "Der Rosarote Panther", "Der gestiefelte Kater", "Empire State Building", "Sendung mit der Maus", "Schiefer Turm von Pisa", "Mensch ärgere dich nicht"
    ];
    let guessedWords = new Set();
    let lastPatternString = "";
    let intervalId = null;
    let isRunning = true;

    let currentPotentialGuesses = [];
    let currentGuessIndex = 0;
    let patternStructureCache = [];
    let patternBoundaryCache = [];
    let currentInputCache = "";

    let isTypingByScript = false;

    let currentMode = '';
    let listMaxHeight = 450; 


    function getInfoContainer() {
        return document.getElementById('guesserInfo');
    }

    function handleGuessClick(event) {
        const clickedWord = event.currentTarget.dataset.word;
        if (clickedWord) {
            typeWord(clickedWord, false);
        }
    }

    function scrollToCurrentGuess() {
        const container = document.getElementById('guessListContainer');
        const currentItem = document.getElementById('current-guess');
        if (container && currentItem) {
            const containerScrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            const itemOffsetTop = currentItem.offsetTop;
            const itemHeight = currentItem.offsetHeight;

            if (itemOffsetTop + itemHeight > containerScrollTop + containerHeight) {
                container.scrollTop = itemOffsetTop - containerHeight + itemHeight;
            } else if (itemOffsetTop < containerScrollTop) {
                container.scrollTop = itemOffsetTop;
            }
        }
    }

    function handleSliderChange(event) {
        listMaxHeight = parseInt(event.target.value);
        const container = document.getElementById('guessListContainer');
        if (container) {
            container.style.maxHeight = listMaxHeight + 'px';
        }
    }

    function updateInfoDisplay(patternStructure, potentialGuesses) {
        const infoContainer = getInfoContainer();
        if (!infoContainer) return;

        let listItems = potentialGuesses.map((guess, index) => {
            const isCurrent = index === currentGuessIndex;
            const id = isCurrent ? 'current-guess' : '';
            const wordUpper = guess.toUpperCase();

            const groupIndex = Math.floor(index / 3);
            const bgColor = groupIndex % 2 === 0 ? '#9C916D' : '#6D6E9C';

            const textColor = isCurrent ? 'red' : '#eeeeee';
            const fontWeight = isCurrent ? 'bold' : 'normal';
            const borderStyle = isCurrent ? '2px solid red' : '2px solid transparent';

            return `<div id="${id}" data-word="${guess}" class="guesser-guess-item" style="background-color: ${bgColor}; color: ${textColor}; font-weight: ${fontWeight}; border: ${borderStyle}; padding: 2px 5px; cursor: pointer;">${wordUpper}</div>`;
        }).join('');

        let content = `
            <strong>How-To-Use:</strong>
            <ul style="margin: 0; padding-left: 15px; font-size: 11px;">
                <li><strong>&#x25B2;/&#x25BC;</strong>: <br>Eintrag markieren</li>
                <li><strong>&#x25BA;(Rechts)</strong>: <br>Markierten Eintrag bestätigen</li>
                <li><strong>Klick</strong>: <br>Eintrag wählen & bestätigen</li>
                <li><strong>Tastatureingaben</strong> <br>filtern die Liste. <br>"_" = unbekannter Buchstabe</li>
            </ul>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 5px 0;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
                <span style="font-size: 10px; color: #666;">⇕</span>
                <input type="range" id="heightSlider" min="100" max="600" value="${listMaxHeight}" style="flex: 1; height: 4px; cursor: pointer;">
            </div>
            <strong>--- Vorschläge (${potentialGuesses.length}) ---</strong>
            <div id="guessListContainer" style="max-height: ${listMaxHeight}px; overflow-y: auto; margin-top: 5px; padding: 5px; border: 1px solid #ccc; background-color: #f9f9f9; border-radius: 4px;">
                ${listItems}
            </div>
        `;
        infoContainer.innerHTML = content;

        const slider = document.getElementById('heightSlider');
        if (slider) {
            slider.addEventListener('input', handleSliderChange);
        }

        document.querySelectorAll('.guesser-guess-item').forEach(item => {
            item.removeEventListener('click', handleGuessClick);
            item.addEventListener('click', handleGuessClick);
        });
    }

    function createInfoContainer() {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'guesserInfo';
        infoDiv.style.position = 'fixed';
        infoDiv.style.top = '10px';
        infoDiv.style.right = '10px';
        infoDiv.style.zIndex = '9998';
        infoDiv.style.backgroundColor = 'white';
        infoDiv.style.padding = '10px';
        infoDiv.style.border = '1px solid #ddd';
        infoDiv.style.borderRadius = '6px';
        infoDiv.style.width = '200px';
        infoDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

        document.body.appendChild(infoDiv);
        infoDiv.innerHTML = "Loading Script...";
    }

    function getWordPattern(forceUpdate = false) {
        const hintContainer = document.querySelector('#game-word .container');
        if (!hintContainer) return null;

        const hintElements = hintContainer.querySelectorAll('.hint');
        if (hintElements.length === 0) return null;

        const patternStructure = [];
        const boundaryMarkers = [];
        let currentWordPattern = [];
        let hasUnderscore = false;
        let currentPatternString = "";

        hintElements.forEach(el => {
            const rawText = el.textContent || "";
            // The page may deliver an umlaut decomposed ("a" + U+0308). Without
            // NFC that is two code units, fails the char.length === 1 check
            // below, gets dropped, and the pattern ends up one position short.
            const char = rawText.trim().toLowerCase().normalize('NFC');
            const isBoundaryHint = el.classList.contains('uncover') && (char.length === 0 || char === '-');

            if (isBoundaryHint) {
                if (currentWordPattern.length > 0) {
                    patternStructure.push(currentWordPattern);
                }
                currentWordPattern = [];
                boundaryMarkers.push(char === '-' ? '-' : ' ');
                currentPatternString += (char === '-' ? '-' : ' ');
                return;
            }

            if (char.length === 1) {
                currentWordPattern.push(char);
                currentPatternString += char;
                if (char === '_') {
                    hasUnderscore = true;
                }
            } else if (char.length === 0 && el.classList.contains('uncover')) {
                if (currentWordPattern.length > 0) {
                    patternStructure.push(currentWordPattern);
                }
                currentWordPattern = [];
                currentPatternString += ' ';
            }
        });

        if (currentWordPattern.length > 0) {
            patternStructure.push(currentWordPattern);
        }

        if (!hasUnderscore) return null;

        if (!forceUpdate && currentPatternString === lastPatternString) {
            return null;
        }

        lastPatternString = currentPatternString;
        patternStructureCache = patternStructure;
        patternBoundaryCache = boundaryMarkers;
        return patternStructure;
    }

    function joinWordsWithBoundaries(words, boundaries = []) {
        if (words.length === 0) {
            return "";
        }

        return words.reduce((current, word, index) => {
            if (index === 0) {
                return word;
            }

            const separator = boundaries[index - 1] || ' ';
            return current + separator + word;
        }, "");
    }

    function filterWordList(patternStructure, boundaryMarkers = [], userInputValue = "") {
        if (!patternStructure || patternStructure.length === 0) return [];

        let flatPattern = [];
        for (let i = 0; i < patternStructure.length; i++) {
            flatPattern = flatPattern.concat(patternStructure[i]);
            if (i < patternStructure.length - 1) {
                const boundary = boundaryMarkers[i] || ' ';
                flatPattern.push(boundary);
            }
        }

        const userInput = userInputValue.toLowerCase(); 

        const possibleGuesses = matchPattern(wordList, flatPattern, userInput)
            .filter(guess => !guessedWords.has(guess));

        return possibleGuesses;
    }

    function matchPattern(list, pattern, userInputPart = "") {
        // Same reason as in getWordPattern: typed or pasted text can arrive
        // decomposed, and the list is composed.
        userInputPart = userInputPart.normalize('NFC');

        const wordLength = pattern.length;
        const matchingWords = [];

        for (const rawWord of list) {
            const word = rawWord.toLowerCase();

            if (word.length !== wordLength) continue;

            let match = true;
            for (let i = 0; i < wordLength; i++) {
                const requiredChar = pattern[i];
                const currentWordChar = word[i];

                // Check 1: Pattern matching
                if (requiredChar !== '_') {
                    // If it's a specific character (letter, space, hyphen), it must match exactly
                    if (requiredChar !== currentWordChar) {
                        match = false;
                        break;
                    }
                } else {
                    // If it's a wildcard '_', it must NOT be a separator (space or hyphen)
                    // This prevents "_______" from matching "Ice-Tea" or "New York"
                    if (currentWordChar === ' ' || currentWordChar === '-') {
                        match = false;
                        break;
                    }
                }

                // Check 2: User input matching (if user has typed something)
                if (userInputPart.length > i) {
                    const requiredInputChar = userInputPart[i];

                    if (requiredInputChar !== '_' && requiredInputChar !== currentWordChar) {
                        match = false;
                        break;
                    }
                }
            }

            if (match) {
                matchingWords.push(word);
            }
        }
        return matchingWords;
    }

    function typeWord(word, isNavigation = false) {
        const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');
        if (!inputField) return false;

        if (isNavigation) {
            isTypingByScript = true;
        }

        inputField.value = word;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.dispatchEvent(new Event('change', { bubbles: true }));

        if (isNavigation) {
            setTimeout(() => {
                isTypingByScript = false;
            }, 50);
        }

        return true;
    }

    function autoGuesserLoop(forceUpdate = false) {
        if (!isRunning) return;

        const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');
        const currentInput = inputField ? inputField.value.trim() : "";

        const hintContainer = document.querySelector('#game-word .container');
        const wordRevealed = hintContainer && hintContainer.textContent.includes('_') === false && hintContainer.querySelectorAll('.hint').length > 0;

        if (document.body.classList.contains('isDrawing') || wordRevealed) {
            guessedWords.clear();
            lastPatternString = "";
            currentPotentialGuesses = [];
            currentGuessIndex = 0;
            currentInputCache = "";

            if (currentMode !== 'drawing_or_guessed') {
                getInfoContainer().innerHTML = `
                    <strong>Du Zeichnest, hast das Wort erraten oder bist in keinem Spiel</strong>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 5px 0;">
                    <strong>How-To-Use:</strong>
                    <ul style="margin: 0; padding-left: 15px; font-size: 11px;">
                        <li><strong>&#x25B2;/&#x25BC;</strong>: Wählt Vorschlag aus (markiert).</li>
                        <li><strong>&#x25BA; (Rechts)</strong>: Füllt markierten Vorschlag in das Chat-Feld.</li>
                        <li><strong>Klick</strong>: Füllt Chat-Feld.</li>
                        <li><strong>Tippen (inkl. '_')</strong>: Filtert die Liste dynamisch.</li>
                    </ul>
                `;
                currentMode = 'drawing_or_guessed';
            }
            return;
        }

        const newPatternStructure = getWordPattern();
        const patternChanged = !!newPatternStructure;
        const inputChanged = currentInput !== currentInputCache;
        currentInputCache = currentInput;

        const patternToUse = newPatternStructure || patternStructureCache;
        let shouldFilter = patternChanged || inputChanged || forceUpdate || currentPotentialGuesses.length === 0 || currentMode !== 'guessing';

        if (patternToUse.length > 0) {
            if (shouldFilter) {
                currentPotentialGuesses = filterWordList(patternToUse, patternBoundaryCache, currentInput);

                if (patternChanged || (inputChanged && !isTypingByScript)) {
                    currentGuessIndex = 0;
                } else {
                    currentGuessIndex = Math.min(currentGuessIndex, currentPotentialGuesses.length > 0 ? currentPotentialGuesses.length - 1 : 0);
                }

                updateInfoDisplay(patternStructureCache, currentPotentialGuesses);
                currentMode = 'guessing';
            }
        } else {
            if (currentMode !== 'no_pattern') {
                getInfoContainer().innerHTML = `
                    <strong>Du Zeichnest, hast das Wort erraten oder bist in keinem Spiel</strong>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 5px 0;">
                    <strong>How-To-Use:</strong>
                    <ul style="margin: 0; padding-left: 15px; font-size: 11px;">
                        <li><strong>&#x25B2;/&#x25BC;</strong>: Wählt Vorschlag aus (markiert).</li>
                        <li><strong>&#x25BA; (Rechts)</strong>: Füllt markierten Vorschlag in das Chat-Feld.</li>
                        <li><strong>Klick</strong>: Füllt Chat-Feld.</li>
                        <li><strong>Tippen (inkl. '_')</strong>: Filtert die Liste dynamisch.</li>
                    </ul>
                `;
                currentMode = 'no_pattern';
            }
        }
    }


    function navigateList(direction) {
        if (isRunning) {
            if (currentPotentialGuesses.length === 0) {
                return;
            }

            if (direction === 'down') {
                currentGuessIndex = (currentGuessIndex + 1) % currentPotentialGuesses.length;
            } else if (direction === 'up') {
                currentGuessIndex = (currentGuessIndex - 1 + currentPotentialGuesses.length) % currentPotentialGuesses.length;
            }

            updateInfoDisplay(patternStructureCache, currentPotentialGuesses);
            scrollToCurrentGuess();
        }
    }

    function handleArrowDown(event) {
        if (event.key === "ArrowDown") {
            const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');
            if (document.activeElement === inputField || currentPotentialGuesses.length > 0) {
                event.preventDefault();
            }
            navigateList('down');
        }
    }

    function handleArrowUp(event) {
        if (event.key === "ArrowUp") {
            const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');
            if (document.activeElement === inputField || currentPotentialGuesses.length > 0) {
                event.preventDefault();
            }
            navigateList('up');
        }
    }

    function handleTabKey(event) {
        if (event.key === "Tab"||event.key === "ArrowRight") {
            const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');

            if (isRunning && inputField) {
                const wordToType = currentPotentialGuesses[currentGuessIndex];

                if (wordToType) {
                    event.preventDefault();
                    typeWord(wordToType, true);

                    if (document.activeElement !== inputField) {
                        inputField.focus();
                    }
                }
            }
        }
    }

    function handleEnterKey(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');

            if (inputField === document.activeElement) {
                const sentWord = inputField.value.trim().toLowerCase();

                if (sentWord && wordList.map(w => w.toLowerCase()).includes(sentWord.split(' ')[0])) {
                    guessedWords.add(sentWord);
                }

                if (patternStructureCache.length > 0) {
                    setTimeout(() => {
                        autoGuesserLoop(true);
                    }, 50);
                }
            }
        }
    }

    function handleDocumentInput(event) {
        const inputField = document.querySelector('#game-chat .chat-form input[type="text"]');

        if (isTypingByScript || !inputField || event.target !== inputField) {
            return;
        }

        if (isRunning && patternStructureCache.length > 0) {
            autoGuesserLoop(true);
        }
    }

    function startGuesser() {
        if (intervalId === null) {
            isRunning = true;
            intervalId = setInterval(autoGuesserLoop, 1500);
        }
    }

    // --- Initialisierung ---

    document.addEventListener('keydown', handleArrowDown);
    document.addEventListener('keydown', handleArrowUp);
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEnterKey);
    document.addEventListener('input', handleDocumentInput);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createInfoContainer();
            startGuesser();
        });
    } else {
        createInfoContainer();
        startGuesser();
    }

    console.log('[Skribbl-Script] Skribbl.io Auto-Guesser V3.0 geladen (mit Höhen-Slider).');

    // Test hook: in the browser `module` is undefined, so this is a no-op there.
    // test/matching.test.js uses it to reach the matching logic.
    if (typeof module === 'object' && module !== null && module.exports) {
        module.exports = { wordList, matchPattern, filterWordList, getWordPattern, joinWordsWithBoundaries };
    }
})();