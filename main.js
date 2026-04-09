const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ENHARMONIC = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
const DEGREES = ['1', '2', '3', '4', '5', '6', '7'];

const MODES = [
    { name: 'Ionian (Major)', steps: [2, 2, 1, 2, 2, 2, 1], character: 'Bright, happy', offset: 0 },
    { name: 'Dorian', steps: [2, 1, 2, 2, 2, 1, 2], character: 'Minor but hopeful', offset: 2 },
    { name: 'Phrygian', steps: [1, 2, 2, 2, 1, 2, 2], character: 'Dark, exotic', offset: 4 },
    { name: 'Lydian', steps: [2, 2, 2, 1, 2, 2, 1], character: 'Dreamy, ethereal', offset: 5 },
    { name: 'Mixolydian', steps: [2, 2, 1, 2, 2, 1, 2], character: 'Bluesy, dominant', offset: 7 },
    { name: 'Aeolian (Natural Minor)', steps: [2, 1, 2, 2, 1, 2, 2], character: 'Sad, natural', offset: 9 },
    { name: 'Locrian', steps: [1, 2, 2, 1, 2, 2, 2], character: 'Tense, unstable', offset: 11 },
];

function getNoteName(rootStr, chromIdx) {
    const n = CHROMATIC[chromIdx % 12];
    if (rootStr.includes('b') && ENHARMONIC[n]) return ENHARMONIC[n];
    return n;
}

function findRelativeMajor(rootIdx, modeIdx) {
    const offset = MODES[modeIdx].offset;
    const majorRootIdx = (rootIdx - offset + 12) % 12;
    return CHROMATIC[majorRootIdx];
}

function build() {
    const rootSel = document.getElementById('root').value;
    const modeIdx = parseInt(document.getElementById('mode').value);
    const mode = MODES[modeIdx];
    const rootBase = rootSel.split(' ')[0];
    const rootIdx = CHROMATIC.indexOf(rootBase);

    // Build the 7 notes
    const notes = [];
    let cur = rootIdx;
    for (let i = 0; i < 7; i++) {
        notes.push(getNoteName(rootSel, cur));
        cur = (cur + mode.steps[i]) % 12;
    }

    // Scale title
    document.getElementById('scale-title').textContent = `${rootBase} ${mode.name}`;

    // Formula (W = whole step, H = half step)
    const formulaEl = document.getElementById('scale-formula');
    formulaEl.innerHTML = mode.steps.map((s, i) => {
        const label = s === 2 ? 'W' : 'H';
        const cls = s === 2 ? 'step-w' : 'step-h';
        const sep = i < mode.steps.length - 1 ? ' – ' : '';
        return `<span class="${cls}">${label}</span>${sep}`;
    }).join('');

    // Notes grid
    const grid = document.getElementById('notes-row');
    grid.innerHTML = '';
    notes.forEach((n, i) => {
        const pill = document.createElement('div');
        pill.className = 'note' + (i === 0 ? ' root' : '');
        pill.style.animationDelay = `${i * 40}ms`;
        pill.innerHTML = `<span class="note-name">${n}</span><span class="note-degree">${DEGREES[i]}</span>`;
        grid.appendChild(pill);
    });

    // Info strip
    document.getElementById('info-character').textContent = mode.character;
    const rel = findRelativeMajor(rootIdx, modeIdx);
    document.getElementById('info-relative').textContent = modeIdx === 0 ? '—' : `${rel} Major`;
    document.getElementById('info-count').textContent = '7';
}

document.getElementById('root').addEventListener('change', build);
document.getElementById('mode').addEventListener('change', build);
build();
