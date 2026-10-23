/**
 * Tests for the hint pattern matching in Skript.js.
 *
 * Run: node test/matching.test.js
 *
 * Skript.js is a browser IIFE, so it is loaded into a vm context with the
 * smallest window/document stub it touches at load time; its test hook at the
 * bottom hands out the matching functions. The hint elements are modelled after
 * src/Hints_format.html (a boundary is <div class="hint uncover"> </div> for a
 * space and ...>-</div> for a hyphen).
 *
 * src/TestWords.txt supplies the separator fixtures (Orang-Utan, Rote Beete,
 * Sitzbank, Tic-Tac-Toe); the umlaut and length cases run against the full
 * German list embedded in Skript.js.
 */

'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'Skript.js'), 'utf8');

const testWords = [
    ...new Set(
        fs
            .readFileSync(path.join(root, 'src', 'TestWords.txt'), 'utf8')
            .split(/[,\r\n]+/)
            .map((word) => word.trim())
            .filter(Boolean)
    )
];

// --- script under test, loaded with a stub page ------------------------------

function loadScript() {
    let hintElements = [];
    const listeners = {};
    let pollCallback = null;

    const element = () => ({
        style: {},
        classList: { contains: () => false },
        appendChild() {},
        addEventListener() {},
        removeEventListener() {}
    });

    function fire(type, event) {
        (listeners[type] || []).forEach((handler) => handler(event));
    }

    // One persistent chat input, so what the script writes into it is still
    // there on the next read, and its 'input' event reaches the document the
    // way a real one bubbles.
    const chatInput = {
        value: '',
        focus() {},
        dispatchEvent(event) {
            if (event.type === 'input') {
                fire('input', { target: chatInput });
            }
            return true;
        }
    };

    const infoContainer = Object.assign(element(), { innerHTML: '' });

    const documentStub = {
        readyState: 'complete',
        activeElement: chatInput,
        body: { classList: { contains: () => false }, appendChild() {} },
        addEventListener(type, handler) {
            if (!listeners[type]) listeners[type] = [];
            listeners[type].push(handler);
        },
        removeEventListener() {},
        createElement: element,
        getElementById: (id) => (id === 'guesserInfo' ? infoContainer : element()),
        querySelectorAll: () => [],
        querySelector(selector) {
            if (selector === '#game-word .container') {
                return hintElements.length === 0
                    ? null
                    : {
                        textContent: hintElements.map((hint) => hint.textContent).join(''),
                        querySelectorAll: () => hintElements
                    };
            }
            if (selector.startsWith('#game-chat')) {
                return chatInput;
            }
            return null;
        }
    };

    const sandbox = {
        module: { exports: {} },
        window: { addEventListener() {} },
        document: documentStub,
        console: { log() {}, info() {}, warn() {}, error() {} },
        // Run it instead of dropping it: the poll below is 1500 ms away, so by
        // then every 50 ms timer the script sets has long since fired.
        setTimeout: (callback) => {
            callback();
            return 0;
        },
        clearTimeout: () => {},
        setInterval: (callback) => {
            pollCallback = callback;
            return 1;
        },
        clearInterval: () => {},
        Event: class {
            constructor(type) {
                this.type = type;
            }
        }
    };

    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: 'Skript.js' });

    return {
        api: sandbox.module.exports,
        input: chatInput,
        setHints(elements) {
            hintElements = elements;
        },
        setInput(value) {
            chatInput.value = value;
        },
        // One turn of the 1500 ms interval the script installs at load.
        poll() {
            assert.ok(pollCallback, 'the script installed no poll');
            pollCallback();
        },
        keydown(key) {
            fire('keydown', { key, preventDefault() {} });
        },
        // The user editing the field by hand: value plus the event that follows.
        typeByHand(value) {
            chatInput.value = value;
            chatInput.dispatchEvent({ type: 'input' });
        },
        panel() {
            return infoContainer.innerHTML;
        }
    };
}

// The suggestion panel is the only thing the user sees, so the list and the
// selection are read back out of the markup updateInfoDisplay renders.
function panelWords(html) {
    return [...html.matchAll(/data-word="([^"]*)"/g)].map((match) => match[1]);
}

function panelSelection(html) {
    const match = html.match(/id="current-guess" data-word="([^"]*)"/);
    return match ? match[1] : null;
}

const { api } = loadScript();
const wordList = api.wordList;

// Arrays handed back from the vm context carry that context's Array prototype,
// which deepStrictEqual rejects; plain() strips them back to host values.
function plain(value) {
    return JSON.parse(JSON.stringify(value));
}

function matchPattern(list, pattern, userInput = '') {
    return plain(api.matchPattern(list, pattern, userInput));
}

// Builds the .hint elements skribbl renders for a display string:
// '_' blank, letter revealed, ' ' or '-' a revealed word boundary.
function hints(display) {
    return [...display].map((char) => {
        const uncovered = char !== '_';
        return {
            textContent: char,
            classList: { contains: (name) => name === 'hint' || (uncovered && name === 'uncover') }
        };
    });
}

// The boundaries are what getWordPattern caches alongside the structure and
// autoGuesserLoop passes back into filterWordList.
function boundariesOf(display) {
    return [...display].filter((char) => char === ' ' || char === '-');
}

// Full chain: hint DOM -> pattern structure -> candidate list.
function guessesFor(display, userInput = '') {
    const page = loadScript();
    page.setHints(hints(display));
    const structure = page.api.getWordPattern(true);
    assert.ok(structure, `getWordPattern returned no structure for "${display}"`);
    assert.strictEqual(
        structure.length,
        boundariesOf(display).length + 1,
        'one more segment than boundaries expected'
    );
    return plain(page.api.filterWordList(structure, boundariesOf(display), userInput));
}

// --- runner -----------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed += 1;
        console.log(`ok   ${name}`);
    } catch (error) {
        failed += 1;
        console.log(`FAIL ${name}\n     ${error.message}`);
    }
}

// --- length ------------------------------------------------------------------

test('word list is loaded', () => {
    assert.ok(wordList.length > 1000, `only ${wordList.length} words`);
    assert.deepStrictEqual(testWords, ['Orang-Utan', 'Rote Beete', 'Sitzbank', 'Tic-Tac-Toe']);
});

test('only words of exactly the pattern length match', () => {
    const result = matchPattern(wordList, '_____');
    assert.ok(result.length > 0);
    assert.ok(result.every((word) => word.length === 5), 'a candidate had the wrong length');
    assert.ok(!result.includes('sitzbank'));
});

test('a shorter or longer pattern excludes the word', () => {
    assert.deepStrictEqual(matchPattern(testWords, '_______'), []);
    assert.deepStrictEqual(matchPattern(testWords, '________'), ['sitzbank']);
    assert.deepStrictEqual(matchPattern(testWords, '_________'), []);
});

// --- revealed letters --------------------------------------------------------

test('revealed letters must sit in the right position', () => {
    assert.deepStrictEqual(matchPattern(testWords, 's_tz____'), ['sitzbank']);
    assert.deepStrictEqual(matchPattern(testWords, '_itz____'), ['sitzbank']);
});

test('a letter in the wrong position excludes the word', () => {
    assert.deepStrictEqual(matchPattern(testWords, 'z_tz____'), []);
    assert.deepStrictEqual(matchPattern(testWords, 's_zt____'), []);
});

test('a wildcard stands for a letter, never for a separator', () => {
    // 10 blanks must not match "rote beete" or "orang-utan": both carry a
    // separator at a position the pattern claims is a letter.
    assert.deepStrictEqual(matchPattern(testWords, '__________'), []);
    assert.deepStrictEqual(matchPattern(testWords, '____ _____'), ['rote beete']);
    assert.deepStrictEqual(matchPattern(testWords, '_____-____'), ['orang-utan']);
    assert.deepStrictEqual(matchPattern(testWords, '___-___-___'), ['tic-tac-toe']);
});

test('a separator in the pattern must sit where the word has it', () => {
    assert.deepStrictEqual(matchPattern(testWords, '_____ ____'), []);
    assert.deepStrictEqual(matchPattern(testWords, '____-_____'), []);
});

test('a pattern that fits nothing returns an empty list', () => {
    assert.deepStrictEqual(matchPattern(wordList, 'qqqqq'), []);
    assert.deepStrictEqual(matchPattern(wordList, 'si_zbonk'), []);
});

// --- umlauts -----------------------------------------------------------------

test('a wildcard matches an umlaut', () => {
    assert.ok(matchPattern(wordList, 'b_r').includes('bär'));
    assert.ok(matchPattern(wordList, '___').includes('bär'));
    assert.ok(matchPattern(wordList, '_l').includes('öl'));
});

test('a revealed umlaut matches only the umlaut word', () => {
    assert.ok(matchPattern(wordList, 'bär').includes('bär'));
    assert.ok(!matchPattern(wordList, 'bär').includes('bar'));
});

test('an umlaut is not folded to its base letter', () => {
    assert.ok(!matchPattern(wordList, 'bar').includes('bär'));
    assert.ok(!matchPattern(wordList, 'tur').includes('tür'));
});

test('sz is not folded to ss', () => {
    assert.ok(matchPattern(wordList, 'fuß').includes('fuß'));
    assert.deepStrictEqual(matchPattern(['Fuß'], 'fuss'), []);
});

test('umlaut words survive the hint chain, revealed or blank', () => {
    assert.ok(guessesFor('___').includes('bär'));
    assert.ok(guessesFor('_ä_').includes('bär'));
    assert.ok(guessesFor('b_r').includes('bär'));
});

test('an uppercase umlaut hint is matched against the lowercase list', () => {
    assert.ok(guessesFor('_Ä_').includes('bär'));
    assert.ok(guessesFor('_Ü_').includes('tür'));
});

// --- case --------------------------------------------------------------------

test('the capitalised word list is matched case-insensitively', () => {
    assert.ok(wordList.includes('Sitzbank'), 'list stores words capitalised');
    assert.deepStrictEqual(matchPattern(['Sitzbank'], 'sitzbank'), ['sitzbank']);
    assert.deepStrictEqual(matchPattern(['Sitzbank'], 'SITZBANK'), [], 'pattern is expected lowercase');
});

test('uppercase hints are lowered before matching', () => {
    assert.ok(guessesFor('S_TZBANK').includes('sitzbank'));
    assert.ok(guessesFor('TIC-T_C-TOE').includes('tic-tac-toe'));
});

test('candidates are reported in lowercase', () => {
    assert.ok(matchPattern(wordList, 'sitzbank').every((word) => word === word.toLowerCase()));
});

// --- typed user input --------------------------------------------------------

test('typed letters narrow the candidates', () => {
    assert.deepStrictEqual(matchPattern(testWords, '________', 'si'), ['sitzbank']);
    assert.deepStrictEqual(matchPattern(testWords, '________', 'xi'), []);
});

test('an underscore typed by the user is a wildcard too', () => {
    assert.deepStrictEqual(matchPattern(testWords, '________', '_i'), ['sitzbank']);
});

test('typed input with an umlaut narrows the candidates', () => {
    assert.ok(matchPattern(wordList, '___', 'bä').includes('bär'));
    assert.ok(!matchPattern(wordList, '___', 'bä').includes('bar'));
});

test('typed input reaches the chain through filterWordList', () => {
    assert.ok(guessesFor('________', 'sitz').includes('sitzbank'));
    assert.ok(guessesFor('________', 'sitz').every((word) => word.startsWith('sitz')));
    assert.deepStrictEqual(guessesFor('________', 'qitz'), []);
});

// --- normalization asymmetry -------------------------------------------------

// Hints built from explicit per-position texts, so a single position can carry
// the decomposed pair an NFD page delivers.
function hintsFrom(parts) {
    return parts.map((text) => {
        const uncovered = text !== '_';
        return {
            textContent: text,
            classList: { contains: (name) => name === 'hint' || (uncovered && name === 'uncover') }
        };
    });
}

function guessesForParts(parts, userInput = '') {
    const page = loadScript();
    page.setHints(hintsFrom(parts));
    const structure = page.api.getWordPattern(true);
    assert.ok(structure, 'getWordPattern returned no structure');
    const boundaries = parts
        .map((text) => text.trim())
        .filter((text) => text.length === 0 || text === '-')
        .map((text) => (text === '-' ? '-' : ' '));
    return plain(page.api.filterWordList(structure, boundaries, userInput));
}

test('the word list is stored in NFC', () => {
    const decomposed = plain(wordList.filter((word) => word.normalize('NFC') !== word));
    assert.deepStrictEqual(decomposed, [], 'list entries must be composed');
});

test('an NFD hint does not shorten the pattern', () => {
    // 'a' + U+0308 is one hint element but two code units. Uncomposed it fails
    // the char.length === 1 check, is dropped, and the pattern loses a position.
    const page = loadScript();
    page.setHints(hintsFrom(['_', 'ä', '_']));
    assert.deepStrictEqual(plain(page.api.getWordPattern(true)), [['_', 'ä', '_']]);
});

test('a revealed umlaut delivered as NFD still matches', () => {
    assert.ok(guessesForParts(['_', 'ä', '_']).includes('bär'));
    assert.ok(guessesForParts(['_', 'ü', '_']).includes('tür'));
});

test('typed input delivered as NFD still narrows the candidates', () => {
    assert.ok(matchPattern(wordList, '___', 'bä').includes('bär'));
    assert.ok(!matchPattern(wordList, '___', 'bä').includes('bar'));
});

// --- self-match sweep over the whole list ------------------------------------

// What skribbl shows for a word before any letter is revealed: a blank per
// letter, the separators already visible.
function blankPatternFor(word) {
    return [...word.toLowerCase()].map((char) => (char === ' ' || char === '-' ? char : '_'));
}

test('every word finds itself from its own blank pattern', () => {
    const missing = plain(
        wordList.filter(
            (word) => !api.matchPattern(wordList, blankPatternFor(word)).includes(word.toLowerCase())
        )
    );
    assert.deepStrictEqual(missing, [], `${missing.length} of ${wordList.length} words cannot find themselves`);
});

test('every word finds itself with any single letter revealed', () => {
    const missing = [];
    for (const word of wordList) {
        const lower = word.toLowerCase();
        const blank = blankPatternFor(word);
        for (let i = 0; i < blank.length; i++) {
            const pattern = blank.slice();
            pattern[i] = lower[i];
            if (!api.matchPattern(wordList, pattern).includes(lower)) {
                missing.push(`${word}@${i}`);
            }
        }
    }
    assert.deepStrictEqual(missing, [], `${missing.length} revealed positions lost their word`);
});

test('every word finds itself fully revealed', () => {
    const missing = plain(
        wordList.filter(
            (word) => !api.matchPattern(wordList, [...word.toLowerCase()]).includes(word.toLowerCase())
        )
    );
    assert.deepStrictEqual(missing, [], `${missing.length} words lost themselves`);
});

test('every word survives the whole hint chain', () => {
    const missing = plain(
        wordList.filter((word) => !guessesFor(blankPatternFor(word).join('')).includes(word.toLowerCase()))
    );
    assert.deepStrictEqual(missing, [], `${missing.length} words were lost in the chain`);
});

// --- the script's own insert is not the user typing --------------------------

// A page in the guessing state, with the first suggestion list rendered.
function guessingPage(display) {
    const page = loadScript();
    page.setHints(hints(display));
    page.poll();
    return page;
}

test('the panel renders the candidates with the first one selected', () => {
    const page = guessingPage('___');
    const words = panelWords(page.panel());
    assert.ok(words.length > 50, `only ${words.length} candidates rendered`);
    assert.strictEqual(panelSelection(page.panel()), words[0]);
});

test('a candidate the script inserts does not narrow the list', () => {
    const page = guessingPage('___');
    const before = panelWords(page.panel());

    page.keydown('ArrowDown');
    page.keydown('ArrowDown');
    const selected = panelSelection(page.panel());
    assert.strictEqual(selected, before[2], 'two steps down should select the third candidate');

    page.keydown('Tab');
    assert.strictEqual(page.input.value, selected, 'the script should have inserted the selection');

    page.poll();
    assert.deepStrictEqual(panelWords(page.panel()), before, 'the candidate list must survive the poll');
    assert.strictEqual(panelSelection(page.panel()), selected, 'the selection must survive the poll');
});

test('the user can keep browsing after the script inserted a candidate', () => {
    const page = guessingPage('___');
    const before = panelWords(page.panel());

    page.keydown('Tab');
    page.poll();
    page.keydown('ArrowDown');

    assert.strictEqual(panelSelection(page.panel()), before[1]);
    assert.deepStrictEqual(panelWords(page.panel()), before);
});

test('text the user types still narrows the list', () => {
    const page = guessingPage('___');
    const before = panelWords(page.panel());

    page.typeByHand('bä');
    const narrowed = panelWords(page.panel());

    assert.ok(narrowed.length < before.length, 'typing must narrow the list');
    assert.ok(narrowed.every((word) => word.startsWith('bä')), JSON.stringify(narrowed));
    assert.ok(narrowed.includes('bär'));
});

test('editing what the script inserted narrows the list again', () => {
    const page = guessingPage('___');
    page.keydown('Tab');
    page.poll();

    page.typeByHand('bä');
    const narrowed = panelWords(page.panel());
    assert.ok(narrowed.length > 0);
    assert.ok(narrowed.every((word) => word.startsWith('bä')), JSON.stringify(narrowed));
});

test('clearing the field by hand restores the full list', () => {
    const page = guessingPage('___');
    const before = panelWords(page.panel());

    page.typeByHand('bä');
    assert.ok(panelWords(page.panel()).length < before.length);

    page.typeByHand('');
    assert.deepStrictEqual(panelWords(page.panel()), before);
});

// --- words already guessed ---------------------------------------------------

test('a guess typed as NFD is recorded as guessed', () => {
    const page = guessingPage('___');
    assert.ok(panelWords(page.panel()).includes('bär'));

    page.setInput('bär');
    page.keydown('Enter');

    const structure = page.api.getWordPattern(true);
    assert.ok(
        !plain(page.api.filterWordList(structure, [], '')).includes('bär'),
        'a word already guessed must drop out of the suggestions'
    );
});

test('a guess made of two words is recorded as guessed', () => {
    const page = guessingPage('____ _____');
    assert.ok(panelWords(page.panel()).includes('rote beete'));

    page.setInput('Rote Beete');
    page.keydown('Enter');

    const structure = page.api.getWordPattern(true);
    assert.ok(
        !plain(page.api.filterWordList(structure, [' '], '')).includes('rote beete'),
        'a multi-word guess must drop out of the suggestions'
    );
});

test('a chat message that is not a word of the list is not recorded', () => {
    const page = guessingPage('___');
    const before = panelWords(page.panel());

    page.setInput('bär ist falsch');
    page.keydown('Enter');

    const structure = page.api.getWordPattern(true);
    assert.deepStrictEqual(plain(page.api.filterWordList(structure, [], '')), before);
});

// --- pattern extraction ------------------------------------------------------

test('hint structure is split into segments at the boundaries', () => {
    const page = loadScript();
    page.setHints(hints('___ ____'));
    assert.deepStrictEqual(plain(page.api.getWordPattern(true)), [
        ['_', '_', '_'],
        ['_', '_', '_', '_']
    ]);
});

test('a fully revealed word yields no pattern', () => {
    const page = loadScript();
    page.setHints(hints('sitzbank'));
    assert.strictEqual(page.api.getWordPattern(true), null);
});

test('an unchanged pattern is reported only once', () => {
    const page = loadScript();
    page.setHints(hints('___'));
    assert.ok(page.api.getWordPattern());
    assert.strictEqual(page.api.getWordPattern(), null, 'second read should be cached');
    assert.ok(page.api.getWordPattern(true), 'forceUpdate bypasses the cache');
});

test('segments are joined with their own boundary characters', () => {
    assert.strictEqual(api.joinWordsWithBoundaries(['tic', 'tac', 'toe'], ['-', '-']), 'tic-tac-toe');
    assert.strictEqual(api.joinWordsWithBoundaries(['rote', 'beete']), 'rote beete');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
