<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stadtrallye Bürgerfest 2027 – Auerbach in der Oberpfalz</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Container für alle Bildschirme (Screens) -->
    <div id="app" class="container">
        
        <!-- SCREEN 1: STARTSEITE / TEAM-ERSTELLUNG -->
        <section id="screen-start" class="screen active">
            <div class="card text-center">
                <h1>Stadtrallye</h1>
                <h2>Bürgerfest 2027</h2>
                <p class="location">Auerbach in der Oberpfalz</p>
                <div class="spacer"></div>
                <form id="team-form" onsubmit="handleTeamRegistration(event)">
                    <label for="team-name">Wie heißt euer Team?</label>
                    <input type="text" id="team-name" placeholder="z.B. Die Stadtfüchse" required autocomplete="off">
                    <button type="submit" class="btn primary">Los geht's</button>
                </form>
                <div class="admin-link-wrapper">
                    <button onclick="switchScreen('screen-testmode')" class="btn secondary small">Zum Testmodus / Admin</button>
                </div>
            </div>
        </section>

        <!-- SCREEN 2: SPIELOBERFLÄCHE -->
        <section id="screen-game" class="screen">
            <div class="header-bar">
                <span id="display-team-name">Team: --</span>
                <span id="display-points">Punkte: 0</span>
            </div>
            <div class="card">
                <h3>Fortschritt: <span id="display-progress">0 / 9</span> Stationen</h3>
                <div class="progress-bar-bg"><div id="progress-bar-fill" style="width: 0%;"></div></div>
                
                <div class="current-station-box">
                    <h4>Nächster Ort / Hinweis:</h4>
                    <p id="display-clue">Lade Hinweis...</p>
                </div>

                <div class="action-buttons">
                    <button onclick="openScanner()" class="btn primary">QR-Code scannen</button>
                    <button onclick="openNotes()" class="btn secondary">Notizen</button>
                </div>
            </div>
            <div class="footer-actions">
                <button onclick="togglePause()" id="btn-pause" class="btn warning">Pause</button>
            </div>
        </section>

        <!-- SCREEN 3: QR-CODE SCANNER -->
        <section id="screen-scanner" class="screen">
            <div class="card text-center">
                <h3>QR-Code Scanner</h3>
                <p>Halte die Kamera auf den QR-Code an der Station.</p>
                <div id="scanner-container">
                    <!-- Platzhalter für die echte Kamera / html5-qrcode -->
                    <div class="camera-placeholder">Kamerabereich (Wird aktiv)</div>
                </div>
                <p id="scanner-error" class="error-msg"></p>
                <button onclick="switchScreen('screen-game')" class="btn secondary">Zurück zum Spiel</button>
            </div>
        </section>

        <!-- SCREEN 4: STATIONSAUFGABE -->
        <section id="screen-task" class="screen">
            <div class="card">
                <h3 id="task-title">Stationsaufgabe</h3>
                <p id="task-location-desc" class="subtext"></p>
                <div class="task-content-box">
                    <p id="task-description">Aufgabentext lädt...</p>
                    
                    <!-- Eingabebereich für Antworten -->
                    <div id="task-input-area">
                        <input type="text" id="task-answer-input" placeholder="Eure Antwort eingeben...">
                    </div>
                </div>

                <div class="task-buttons">
                    <button onclick="submitAnswer()" class="btn primary">Antwort absenden</button>
                    <button onclick="requestHint()" class="btn warning">Hinweis (-Punkte)</button>
                    <button onclick="skipTask()" class="btn danger">Aufgabe überspringen</button>
                </div>
            </div>
        </section>

        <!-- SCREEN 5: PAUSE -->
        <section id="screen-pause" class="screen">
            <div class="card text-center">
                <h2>Pause aktiv</h2>
                <p>Das Spiel ist pausiert. Trink etwas und ruh dich aus!</p>
                <div class="spacer"></div>
                <button onclick="togglePause()" class="btn primary">Spiel fortsetzen</button>
            </div>
        </section>

        <!-- SCREEN 6: NOTIZEN -->
        <section id="screen-notes" class="screen">
            <div class="card">
                <h3>Eure Notizen</h3>
                <p class="subtext">Hier könnt ihr Zwischenergebnisse oder Hinweise festhalten.</p>
                <textarea id="team-notes-input" placeholder="Schreibt hier eure Notizen..."></textarea>
                <div class="spacer"></div>
                <button onclick="saveNotes()" class="btn primary">Speichern & Zurück</button>
            </div>
        </section>

        <!-- SCREEN 7: FINALE -->
        <section id="screen-finale" class="screen">
            <div class="card text-center">
                <h1>🎉 Finale!</h1>
                <h2>Ihr habt es geschafft!</h2>
                <p>Ihr habt alle Stationen der Stadtrallye in Auerbach erfolgreich absolviert.</p>
                <div class="spacer"></div>
                <button onclick="switchScreen('screen-survey')" class="btn primary">Zur Umfrage</button>
            </div>
        </section>

        <!-- SCREEN 8: UMFRAGE -->
        <section id="screen-survey" class="screen">
            <div class="card">
                <h3>Umfrage zur Stadtrallye</h3>
                <p>Wie hat euch die Rallye gefallen?</p>
                <form onsubmit="submitSurvey(event)">
                    <label>Spaßfaktor (1-5):</label>
                    <select id="survey-fun">
                        <option value="5">⭐⭐⭐⭐⭐ Super</option>
                        <option value="4">⭐⭐⭐⭐ Gut</option>
                        <option value="3">⭐⭐⭐ Geht so</option>
                        <option value="2">⭐⭐ Langweilig</option>
                        <option value="1">⭐ Schlecht</option>
                    </select>
                    <div class="spacer"></div>
                    <label>Was war eure Lieblingsstation?</label>
                    <input type="text" id="survey-favorite" placeholder="Lieblingsstation...">
                    <div class="spacer"></div>
                    <button type="submit" class="btn primary">Umfrage abschicken</button>
                </form>
            </div>
        </section>

        <!-- SCREEN 9: TESTMODUS / ADMIN -->
        <section id="screen-testmode" class="screen">
            <div class="card">
                <h3>Testmodus & Simulation</h3>
                <p class="subtext">Hier kannst du als Veranstalter alles durchtesten.</p>
                <div class="spacer"></div>
                <h4>QR-Code Simulation:</h4>
                <div id="test-qr-buttons" class="grid-buttons">
                    <!-- Wird per JS befüllt -->
                </div>
                <div class="spacer"></div>
                <button onclick="switchScreen('screen-start')" class="btn secondary">Zurück zur Startseite</button>
            </div>
        </section>

    </div>

    <!-- Verknüpfung der Logik -->
    <script src="app.js"></script>
</body>
</html>
/* Zentrales Designsystem */
:root {
    --primary-color: #2b6cb0;
    --primary-hover: #2c5282;
    --accent-color: #d69e2e;
    --danger-color: #e53e3e;
    --warning-color: #dd6b20;
    --bg-color: #f7fafc;
    --card-bg: #ffffff;
    --text-color: #2d3748;
    --border-radius: 12px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 16px;
}

.container {
    width: 100%;
    max-width: 480px; /* Mobile First Ansicht */
}

.screen {
    display: none;
}

.screen.active {
    display: block;
}

.card {
    background-color: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
}

.text-center {
    text-align: center;
}

h1, h2, h3 {
    color: var(--primary-color);
    margin-bottom: 8px;
}

.location {
    font-weight: 600;
    color: #4a5568;
}

.subtext {
    font-size: 0.9rem;
    color: #718096;
    margin-bottom: 16px;
}

.spacer {
    height: 16px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

input[type="text"], textarea, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 16px;
}

textarea {
    resize: vertical;
    min-height: 120px;
}

.btn {
    display: block;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    margin-bottom: 8px;
    transition: background 0.2s;
}

.btn.primary {
    background-color: var(--primary-color);
    color: white;
}
.btn.primary:hover {
    background-color: var(--primary-hover);
}

.btn.secondary {
    background-color: #e2e8f0;
    color: var(--text-color);
}

.btn.warning {
    background-color: var(--warning-color);
    color: white;
}

.btn.danger {
    background-color: var(--danger-color);
    color: white;
}

.btn.small {
    padding: 8px;
    font-size: 0.85rem;
}

.header-bar {
    display: flex;
    justify-content: space-between;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.progress-bar-bg {
    background-color: #e2e8f0;
    border-radius: 4px;
    height: 8px;
    width: 100%;
    overflow: hidden;
    margin-bottom: 16px;
}

#progress-bar-fill {
    background-color: var(--accent-color);
    height: 100%;
    width: 0%;
    transition: width 0.3s ease;
}

.current-station-box {
    background-color: #ebf8ff;
    border-left: 4px solid var(--primary-color);
    padding: 12px;
    border-radius: 0 8px 8px 0;
    margin-bottom: 16px;
}

.camera-placeholder {
    background-color: #2d3748;
    color: white;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-bottom: 16px;
}

.error-msg {
    color: var(--danger-color);
    font-size: 0.9rem;
    margin-bottom: 12px;
}

.grid-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}
// SPIELSTAND & DATEN
let gameState = {
    teamName: "",
    routeId: null,
    stationOrder: [],
    currentIndex: 0, // 0 bedeutet: Sie müssen zur 1. Station ihrer Route
    points: 100,
    startTime: null,
    notes: "",
    isPaused: false
};

// Lokale Stationen-Daten (Pflichtaufgaben ohne falsche Bonus-Einträge)
const stationsData = {
    1: { 
        name: "Rathaus", 
        clue: "Geht vom Schlossplatz zum historischen Rathaus am Marktplatz.", 
        title: "Stadtwappen-Puzzle & Die drei Berge", 
        desc: "Betrachte das Stadtwappen. Benenne als Pflichtaufgabe die drei Berge: Gottvaterberg, Grünberg und Pinzigberg." 
    },
    2: { name: "Bergleute", clue: "Folgt dem Hinweis vom Startpunkt zur Station der Bergleute.", title: "Bergleute", desc: "TODO: Konkrete Aufgabe einfügen." },
    3: { name: "Jahreszahlen", clue: "Haltet Ausschau nach historischen Jahreszahlen laut eurem Hinweis.", title: "Jahreszahlen", desc: "TODO: Konkrete Aufgabe einfügen." },
    4: { name: "Goldener Löwe", clue: "Folgt dem Hinweis zum Goldenen Löwen.", title: "4x4-Logikaufgabe", desc: "TODO: Logikaufgabe einfügen." },
    5: { name: "Heinrich Stromer", clue: "Such den Ort, der an Heinrich Stromer erinnert.", title: "Heinrich Stromer", desc: "TODO: Aufgabe einfügen." },
    6: { name: "Auerochse", clue: "Wo versteckt sich der Auerochse?", title: "Auerochse", desc: "TODO: Aufgabe einfügen." },
    7: { name: "Bücherei", clue: "Geht zur Bücherei für die zerrissene Nachricht.", title: "Zerrissene Nachricht", desc: "TODO: Aufgabe einfügen." },
    8: { name: "Kirche", clue: "Besucht die Kirche und den Eisenerzaltar.", title: "Kirche + Eisenerzaltar", desc: "TODO: Aufgabe einfügen." },
    9: { name: "Goldener Brunnen", clue: "Findet den Goldenen Brunnen für die letzte Rätselstation.", title: "Goldener Brunnen + Morse", desc: "TODO: Morseaufgabe einfügen." },
    10: { name: "Finale", clue: "Ihr habt alle Stationen geschafft! Kommt zum finalen Treffpunkt.", title: "Das große Finale", desc: "Willkommen im Ziel!" }
};

// Routen-Definitionen (Stationen 1-9 gemischt, Station 10 immer am Ende)
const routesConfig = {
    A: [1, 3, 5, 2, 7, 4, 9, 6, 8, 10],
    B: [2, 4, 1, 6, 8, 3, 5, 7, 9, 10],
    C: [3, 2, 6, 5, 9, 1, 4, 8, 7, 10]
};

// Wechsel zwischen den Ansichten (Screens)
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 1. Team-Registrierung & Automatische Routenverteilung vom Schlossplatz aus
function handleTeamRegistration(event) {
    event.preventDefault();
    const teamNameInput = document.getElementById('team-name').value.trim();
    if (!teamNameInput) return;

    gameState.teamName = teamNameInput;
    gameState.startTime = new Date();

    // Automatische Routenverteilung im Hintergrund (A, B oder C)
    const routesKeys = ['A', 'B', 'C'];
    const assignedRouteKey = routesKeys[Math.floor(Math.random() * routesKeys.length)];
    
    gameState.routeId = assignedRouteKey;
    gameState.stationOrder = routesConfig[assignedRouteKey];
    gameState.currentIndex = 0; // Startet bei der ersten Station der zugewiesenen Route

    updateGameUI();
    initTestModeButtons();
    switchScreen('screen-game');
}

// UI der Spieloberfläche aktualisieren
function updateGameUI() {
    document.getElementById('display-team-name').innerText = `Team: ${gameState.teamName}`;
    document.getElementById('display-points').innerText = `Punkte: ${gameState.points}`;
    
    // Fortschritt (Stationen 1 bis 9, exklusive Finale)
    const totalStations = gameState.stationOrder.length - 1;
    const progressPercent = (gameState.currentIndex / totalStations) * 100;
    document.getElementById('display-progress').innerText = `${gameState.currentIndex} / ${totalStations}`;
    document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;

    // Den genauen nächsten Ort / Hinweis für die anstehende Station anzeigen
    const currentStationId = gameState.stationOrder[gameState.currentIndex];
    const stationInfo = stationsData[currentStationId];
    
    if (gameState.currentIndex >= totalStations) {
        document.getElementById('display-clue').innerText = "Ihr habt alle 9 Stationen geschafft! Geht jetzt weiter zum Finale (Station 10).";
    } else {
        document.getElementById('display-clue').innerText = stationInfo ? stationInfo.clue : "Folgt eurem Hinweis.";
    }
}

// QR-Scanner öffnen
function openScanner() {
    if (gameState.isPaused) {
        alert("Das Spiel ist pausiert!");
        return;
    }
    switchScreen('screen-scanner');
}

// Simulieren des Scannens einer Station (für Testmodus)
function simulateScan(stationId) {
    const expectedStationId = gameState.stationOrder[gameState.currentIndex];

    if (stationId === expectedStationId) {
        // Richtiger QR-Code für die jetzige Station! Aufgabe öffnen
        loadTask(stationId);
        switchScreen('screen-task');
    } else {
        // Falscher QR-Code
        alert("Falscher Ort! Überlegt noch einmal genau und schaut euch euren Hinweis an.");
        switchScreen('screen-game');
    }
}

// Aufgabe laden
function loadTask(stationId) {
    const station = stationsData[stationId];
    document.getElementById('task-title').innerText = station.title;
    document.getElementById('task-location-desc').innerText = `Station: ${station.name}`;
    document.getElementById('task-description').innerText = station.desc;
}

// Antwort absenden
function submitAnswer() {
    alert("Richtig! Super gemacht.");
    gameState.currentIndex++; // Geht in der Route einen Schritt weiter

    if (gameState.currentIndex >= gameState.stationOrder.length - 1) {
        // Wenn 1-9 durch sind, wird Station 10 (Finale) freigeschaltet
        switchScreen('screen-finale');
    } else {
        updateGameUI();
        switchScreen('screen-game');
    }
}

// Hinweis anfordern
function requestHint() {
    gameState.points -= 3;
    updateGameUI();
    alert("Hinweis angefordert: Schaut euch am aktuellen Ort noch einmal ganz genau um!");
}

// Aufgabe überspringen
function skipTask() {
    if (confirm("Möchtet ihr diese Aufgabe wirklich überspringen? Das gibt Punktabzug, aber ihr bleibt auf eurer Route.")) {
        gameState.points -= 5;
        gameState.currentIndex++;
        if (gameState.currentIndex >= gameState.stationOrder.length - 1) {
            switchScreen('screen-finale');
        } else {
            updateGameUI();
            switchScreen('screen-game');
        }
    }
}

// Pause-Funktion
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    if (gameState.isPaused) {
        switchScreen('screen-pause');
    } else {
        switchScreen('screen-game');
    }
}

// Notizen öffnen & speichern
function openNotes() {
    document.getElementById('team-notes-input').value = gameState.notes;
    switchScreen('screen-notes');
}

function saveNotes() {
    gameState.notes = document.getElementById('team-notes-input').value;
    switchScreen('screen-game');
}

// Umfrage abschicken
function submitSurvey(event) {
    event.preventDefault();
    alert("Vielen Dank für eure Teilnahme am Bürgerfest 2027!");
    location.reload();
}

// Testmodus-Buttons dynamisch generieren
function initTestModeButtons() {
    const container = document.getElementById('test-qr-buttons');
    container.innerHTML = "";
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = "btn secondary small";
        btn.innerText = `Scan Station ${i} QR-Code`;
        btn.onclick = () => simulateScan(i);
        container.appendChild(btn);
    }
}
