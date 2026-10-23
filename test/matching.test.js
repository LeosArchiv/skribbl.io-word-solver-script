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
    let inputValue = '';

    const element = () => ({ style: {}, classList: { contains: () => false }, appendChild() {} });

    const documentStub = {
        readyState: 'complete',
        body: { classList: { contains: () => false }, appendChild() {} },
        addEventListener() {},
        removeEventListener() {},
        createElement: element,
        getElementById: () => element(),
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
                return { value: inputValue, dispatchEvent() {}, focus() {} };
            }
            return null;
        }
    };

    const sandbox = {
        module: { exports: {} },
        window: { addEventListener() {} },
        document: documentStub,
        console: { log() {}, info() {}, warn() {}, error() {} },
        setTimeout: () => 0,
        clearTimeout: () => {},
        setInterval: () => 0,
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
        setHints(elements) {
            hintElements = elements;
        },
        setInput(value) {
            inputValue = value;
        }
    };
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
