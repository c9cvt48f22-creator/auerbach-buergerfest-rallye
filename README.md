<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stadtrallye Bürgerfest 2027 – Auerbach</title>
    <style>
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
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-color); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px; }
        .container { width: 100%; max-width: 480px; }
        .screen { display: none; }
        .screen.active { display: block; }
        .card { background-color: var(--card-bg); border-radius: var(--border-radius); padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 16px; }
        .text-center { text-align: center; }
        h1, h2, h3 { color: var(--primary-color); margin-bottom: 8px; }
        .spacer { height: 16px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; }
        input[type="text"], textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 1rem; margin-bottom: 16px; }
        .btn { display: block; width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; text-align: center; margin-bottom: 8px; background-color: var(--primary-color); color: white; }
        .btn.secondary { background-color: #e2e8f0; color: var(--text-color); }
        .btn.warning { background-color: var(--warning-color); color: white; }
        .header-bar { display: flex; justify-content: space-between; background: white; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; font-weight: bold; }
        .progress-bar-bg { background-color: #e2e8f0; border-radius: 4px; height: 8px; width: 100%; overflow: hidden; margin-bottom: 16px; }
        #progress-bar-fill { background-color: var(--accent-color); height: 100%; width: 0%; }
        .current-station-box { background-color: #ebf8ff; border-left: 4px solid var(--primary-color); padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 16px; }
        .grid-buttons { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    </style>
</head>
<body>

    <div id="app" class="container">
        <!-- STARTSEITE -->
        <section id="screen-start" class="screen active">
            <div class="card text-center">
                <h1>Stadtrallye</h1>
                <h2>Bürgerfest 2027</h2>
                <p>Auerbach in der Oberpfalz</p>
                <div class="spacer"></div>
                <form onsubmit="handleTeamRegistration(event)">
                    <label>Wie heißt euer Team?</label>
                    <input type="text" id="team-name" placeholder="z.B. Die Stadtfüchse" required>
                    <label>Vornamen der Mitspieler:</label>
                    <input type="text" id="player-names" placeholder="z.B. Anna, Jonas" required>
                    <div class="spacer"></div>
                    <button type="submit" class="btn">Los geht's</button>
                </form>
                <div class="spacer"></div>
                <button onclick="switchScreen('screen-testmode')" class="btn secondary">Zum Testmodus</button>
            </div>
        </section>

        <!-- SPIELOBERFLÄCHE -->
        <section id="screen-game" class="screen">
            <div class="header-bar">
                <span id="display-team-name">Team: --</span>
                <span id="display-points">Punkte: 100</span>
            </div>
            <div class="card">
                <h3>Fortschritt: <span id="display-progress">0 / 9</span> Stationen</h3>
                <div class="progress-bar-bg"><div id="progress-bar-fill" style="width: 0%;"></div></div>
                <div class="current-station-box">
                    <h4>Nächster Hinweis:</h4>
                    <p id="display-clue">Lade...</p>
                </div>
                <button onclick="openScanner()" class="btn">QR-Code scannen</button>
                <button onclick="openNotes()" class="btn secondary">Notizen</button>
            </div>
            <button onclick="togglePause()" class="btn warning">Pause</button>
        </section>

        <!-- STATIONSAUFGABE -->
        <section id="screen-task" class="screen">
            <div class="card">
                <h3 id="task-title">Aufgabe</h3>
                <p id="task-location-desc"></p>
                <p id="task-description" style="margin: 16px 0;"></p>
                <button onclick="submitAnswer()" class="btn">Antwort absenden (Richtig)</button>
                <button onclick="skipTask()" class="btn warning">Aufgabe überspringen</button>
            </div>
        </section>

        <!-- PAUSE -->
        <section id="screen-pause" class="screen">
            <div class="card text-center">
                <h2>Pause aktiv</h2>
                <p><strong>Die Zeitmessung wurde angehalten.</strong></p>
                <p style="margin: 12px 0; font-size: 0.9rem;">Das Spiel ist gesperrt. Ihr könnt während der Pause nicht weitermachen.</p>
                <button onclick="togglePause()" class="btn">Spiel fortsetzen</button>
            </div>
        </section>

        <!-- NOTIZEN -->
        <section id="screen-notes" class="screen">
            <div class="card">
                <h3>Eure Notizen</h3>
                <textarea id="team-notes-input" placeholder="Notizen..."></textarea>
                <button onclick="saveNotes()" class="btn">Speichern & Zurück</button>
                <button onclick="closeNotes()" class="btn secondary">Abbrechen</button>
            </div>
        </section>

        <!-- FINALE -->
        <section id="screen-finale" class="screen">
            <div class="card text-center">
                <h1>🎉 Finale!</h1>
                <p>Ihr habt alle Stationen geschafft!</p>
            </div>
        </section>

        <!-- TESTMODUS -->
        <section id="screen-testmode" class="screen">
            <div class="card">
                <h3>Testmodus</h3>
                <div id="test-qr-buttons" class="grid-buttons" style="margin: 16px 0;"></div>
                <button onclick="switchScreen('screen-start')" class="btn secondary">Zurück</button>
            </div>
        </section>
    </div>

    <script>
        let gameState = { teamName: "", playerNames: "", routeId: null, stationOrder: [], currentIndex: 0, points: 100, notes: "", isPaused: false };
        const stationsData = {
            1: { name: "Rathaus", clue: "Geht zum historischen Rathaus am Marktplatz.", title: "Stadtwappen-Puzzle", desc: "Benenne die drei Berge: Gottvaterberg, Grünberg, Pinzigberg." },
            2: { name: "Bergleute", clue: "Folgt dem Hinweis zur Station der Bergleute.", title: "Bergleute", desc: "Aufgabe Bergleute." },
            3: { name: "Jahreszahlen", clue: "Haltet Ausschau nach Jahreszahlen.", title: "Jahreszahlen", desc: "Aufgabe Jahreszahlen." },
            4: { name: "Goldener Löwe", clue: "Geht zum Goldenen Löwen.", title: "4x4-Logikaufgabe", desc: "Logikaufgabe Löwe." },
            5: { name: "Heinrich Stromer", clue: "Such den Ort von Heinrich Stromer.", title: "Heinrich Stromer", desc: "Aufgabe Stromer." },
            6: { name: "Auerochse", clue: "Wo ist der Auerochse?", title: "Auerochse", desc: "Aufgabe Auerochse." },
            7: { name: "Bücherei", clue: "Geht zur Bücherei.", title: "Zerrissene Nachricht", desc: "Aufgabe Bücherei." },
            8: { name: "Kirche", clue: "Besucht die Kirche.", title: "Kirche + Altar", desc: "Aufgabe Kirche." },
            9: { name: "Goldener Brunnen", clue: "Findet den Goldenen Brunnen.", title: "Morseaufgabe", desc: "Aufgabe Brunnen." },
            10: { name: "Finale", clue: "Ab zum Finale!", title: "Finale", desc: "Ziel erreicht!" }
        };
        const routesConfig = { A: [1,3,5,2,7,4,9,6,8,10], B: [2,4,1,6,8,3,5,7,9,10], C: [3,2,6,5,9,1,4,8,7,10] };

        function switchScreen(id) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function handleTeamRegistration(e) {
            e.preventDefault();
            gameState.teamName = document.getElementById('team-name').value;
            gameState.playerNames = document.getElementById('player-names').value;
            const keys = ['A', 'B', 'C'];
            gameState.routeId = keys[Math.floor(Math.random() * keys.length)];
            gameState.stationOrder = routesConfig[gameState.routeId];
            gameState.currentIndex = 0;
            updateGameUI();
            initTestMode();
            switchScreen('screen-game');
        }

        function updateGameUI() {
            document.getElementById('display-team-name').innerText = `Team: ${gameState.teamName}`;
            document.getElementById('display-points').innerText = `Punkte: ${gameState.points}`;
            const total = gameState.stationOrder.length - 1;
            document.getElementById('display-progress').innerText = `${gameState.currentIndex} / ${total}`;
            document.getElementById('progress-bar-fill').style.width = `${(gameState.currentIndex / total) * 100}%`;
            const id = gameState.stationOrder[gameState.currentIndex];
            document.getElementById('display-clue').innerText = gameState.currentIndex >= total ? "Ab zum Finale!" : stationsData[id].clue;
        }

        function openScanner() { if(!gameState.isPaused) alert("Scanner-Modus (Testmodus nutzen zum Simulieren)"); }
        
        function simulateScan(id) {
            if(id === gameState.stationOrder[gameState.currentIndex]) {
                const s = stationsData[id];
                document.getElementById('task-title').innerText = s.title;
                document.getElementById('task-location-desc').innerText = `Station: ${s.name}`;
                document.getElementById('task-description').innerText = s.desc;
                switchScreen('screen-task');
            } else {
                alert("Falscher Ort! Schaut auf euren Hinweis.");
            }
        }

        function submitAnswer() {
            alert("Richtig!");
            gameState.currentIndex++;
            if(gameState.currentIndex >= gameState.stationOrder.length - 1) {
                switchScreen('screen-finale');
            } else {
                updateGameUI();
                switchScreen('screen-game');
            }
        }

        function skipTask() {
            if(confirm("Überspringen? Das gibt Punktabzug.")) {
                gameState.points -= 5;
                gameState.currentIndex++;
                if(gameState.currentIndex >= gameState.stationOrder.length - 1) {
                    switchScreen('screen-finale');
                } else {
                    updateGameUI();
                    switchScreen('screen-game');
                }
            }
        }

        function togglePause() {
            gameState.isPaused = !gameState.isPaused;
            switchScreen(gameState.isPaused ? 'screen-pause' : 'screen-game');
        }

        function openNotes() { document.getElementById('team-notes-input').value = gameState.notes; switchScreen('screen-notes'); }
        function saveNotes() { gameState.notes = document.getElementById('team-notes-input').value; switchScreen('screen-game'); }
        function closeNotes() { switchScreen('screen-game'); }

        function initTestMode() {
            const c = document.getElementById('test-qr-buttons');
            c.innerHTML = "";
            for(let i=1; i<=10; i++) {
                const b = document.createElement('button');
                b.className = "btn secondary";
                b.style.padding = "8px";
                b.innerText = `Scan Station ${i}`;
                b.onclick = () => simulateScan(i);
                c.appendChild(b);
            }
        }
    </script>
</body>
</html>
