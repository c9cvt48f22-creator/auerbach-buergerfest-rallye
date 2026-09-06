// SPIELSTAND & DATEN
let gameState = {
    teamName: "",
    playerNames: "",
    routeId: null,
    stationOrder: [],
    currentIndex: 0,
    points: 100,
    startTime: null,
    notes: "",
    isPaused: false
};

// Lokale Stationen-Daten (Pflichtaufgaben ohne falsche Bonus-Einträge)
const stationsData = {
    1: { 
        name: "Rathaus", 
        clue: "Geht vom Schlossplatz zum historischen Rathaus am Marktplatz. Wichtige Berge im Wappen!", 
        title: "Stadtwappen-Puzzle & Die drei Berge", 
        desc: "Betrachte das Stadtwappen. Benenne als Pflichtaufgabe die drei Berge: Gottvaterberg, Grünberg und Pinzigberg." 
    },
    2: { name: "Bergleute", clue: "Folgt dem Hinweis vom Startpunkt zur Station der Bergleute.", title: "Bergleute", desc: "TODO: Konkrete Aufgabe einfügen." },
    3: { name: "Jahreszahlen", clue: "Haltet Ausschau nach historischen Jahreszahlen laut eurem Hinweis.", title: "Jahreszahlen", desc: "TODO: Konkrete Aufgabe einfügen." },
    4: { name: "Goldener Löwe", clue: "Folgt dem Hinweis zum Goldenen Löwen.", title: "4x4-Logikaufgabe", desc: "TODO: Konkrete Aufgabe einfügen." },
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
    const playerNamesInput = document.getElementById('player-names').value.trim();
    
    if (!teamNameInput || !playerNamesInput) return;

    gameState.teamName = teamNameInput;
    gameState.playerNames = playerNamesInput;
    gameState.startTime = new Date();

    // Automatische Routenverteilung im Hintergrund (A, B oder C)
    const routesKeys = ['A', 'B', 'C'];
    const assignedRouteKey = routesKeys[Math.floor(Math.random() * routesKeys.length)];
    
    gameState.routeId = assignedRouteKey;
    gameState.stationOrder = routesConfig[assignedRouteKey];
    gameState.currentIndex = 0;

    updateGameUI();
    initTestModeButtons();
    switchScreen('screen-game');
}

// UI der Spieloberfläche aktualisieren
function updateGameUI() {
    document.getElementById('display-team-name').innerText = `Team: ${gameState.teamName}`;
    document.getElementById('display-points').innerText = `Punkte: ${gameState.points}`;
    
    const totalStations = gameState.stationOrder.length - 1;
    const progressPercent = (gameState.currentIndex / totalStations) * 100;
    document.getElementById('display-progress').innerText = `${gameState.currentIndex} / ${totalStations}`;
    document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;

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
        loadTask(stationId);
        switchScreen('screen-task');
    } else {
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
    gameState.currentIndex++;

    if (gameState.currentIndex >= gameState.stationOrder.length - 1) {
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

// Notizen öffnen, speichern & schließen
function openNotes() {
    document.getElementById('team-notes-input').value = gameState.notes;
    switchScreen('screen-notes');
}

function saveNotes() {
    gameState.notes = document.getElementById('team-notes-input').value;
    switchScreen('screen-game');
}

function closeNotes() {
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
