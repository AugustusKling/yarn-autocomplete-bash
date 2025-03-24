#!/usr/bin/env node

const { readFileSync } = require('node:fs');

const compLine = process.env.COMP_LINE;
const cursorPosition = process.env.COMP_POINT;
const compLineToCursor = compLine.substring(0, cursorPosition);
const wordInCompletionBegin = compLineToCursor.lastIndexOf(" ") + 1;
const wordInCompletion = compLine.substring(wordInCompletionBegin, cursorPosition);
const commandWithArgs = compLine.replace(/^yarn\s+/, '');

// To parse options from Yarn CLI reference website:
// Array.from(document.querySelectorAll('.language-text')).map(e => e.innerText).flatMap(e => e.split(",")).map(e => e.replace(/ #0$/, '')).filter(e => e.length>2)
const commandOptions = {
    add: [
        "--json",
        "--fixed",
        "--exact",
        "--tilde",
        "--caret",
        "--dev",
        "--peer",
        "--optional",
        "--prefer-dev",
        "--interactive",
        "--cached",
        "--mode"
    ],
    bin: [
        "--verbose",
        "--json"
    ],
    'cache clean': [
        "--mirror",
        "--all"
    ],
    config: [
        "--no-defaults",
        "--json"
    ],
    'config get': [
        "--why",
        "--json",
        "--no-redacted"
    ],
    'config set': [
        "--json",
        "--home"
    ],
    'config unset': [
        "--home"
    ],
    constraints: [
        "--fix",
        "--json"
    ],
    'constraints query': [
        "--json"
    ],
    'constraints source': [
        "--verbose"
    ],
    dedupe: [
        "--strategy",
        "--check",
        "--json",
        "--mode"
    ],
    dlx: [
        "--package",
        "--quiet"
    ],
    'dlx @yarnpkg/sdks vim': [],
    'dlx @yarnpkg/sdks base': [],
    'dlx @yarnpkg/sdks vscode': [],
    exec: [],
    explain: [
        "--json"
    ],
    'explain peer-requirements': [],
    info: [
        "--all",
        "--recursive",
        "--extra",
        "--cache",
        "--dependents",
        "--manifest",
        "--name-only",
        "--virtuals",
        "--json"
    ],
    init: [
        "--private",
        "--workspace",
        "--install",
        "--name"
    ],
    install: [
        "--json",
        "--immutable",
        "--immutable-cache",
        "--refresh-lockfile",
        "--check-cache",
        "--check-resolutions",
        "--inline-builds",
        "--mode"
    ],
    link: [
        "--all",
        "--private",
        "--relative"
    ],
    node: [],
    'npm audit': [
        "--all",
        "--recursive",
        "--environment",
        "--json",
        "--no-deprecations",
        "--severity",
        "--exclude",
        "--ignore"
    ],
    'npm info': [
        "--fields",
        "--json"
    ],
    'npm login': [
        "--scope",
        "--publish",
        "--always-auth"
    ],
    'npm logout': [
        "--scope",
        "--publish",
        "--all"
    ],
    'npm publish': [
        "--access",
        "--tag",
        "--tolerate-republish",
        "--otp"
    ],
    'npm tag add': [],
    'npm tag list': [
        "--json"
    ],
    'npm tag remove': [],
    'npm whoami': [
        "--scope",
        "--publish"
    ],
    pack: [
        "--install-if-needed",
        "--dry-run",
        "--json",
        "--out"
    ],
    patch: [
        "--update",
        "--json"
    ],
    'patch-commit': [
        "--save"
    ],
    'plugin check': [
        "--json"
    ],
    'plugin import': [
        "--checksum"
    ],
    'plugin import from sources': [
        "--path",
        "--repository",
        "--branch",
        "--no-minify",
        "--force"
    ],
    'plugin list': [
        "--json"
    ],
    'plugin remove': [],
    'plugin runtime': [
        "--json"
    ],
    rebuild: [],
    remove: [
        "--all",
        "--mode"
    ],
    run: [
        "--inspect",
        "--inspect-brk",
        "--top-level",
        "--binaries-only",
        "--require"
    ],
    search: [],
    'set resolution': [],
    'set version': [
        "--yarn-path",
        "--only-if-needed",
        // Version names
        "latest", "canary", "classic", "4.x"
    ],
    'set version from sources': [
        "--path",
        "--repository",
        "--branch",
        "--plugin",
        "--dry-run",
        "--no-minify",
        "--force",
        "--skip-plugins"
    ],
    stage: [
        "--commit",
        "--reset",
        "--dry-run"
    ],
    unlink: [
        "--all"
    ],
    unplug: [
        "--all",
        "--recursive",
        "--json"
    ],
    up: [
        "--interactive",
        "--fixed",
        "--exact",
        "--tilde",
        "--caret",
        "--recursive",
        "--mode"
    ],
    'upgrade-interactive': [],
    version: [
        "--deferred",
        "--immediate",
        // Version names
        "major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease", "decline"
    ],
    'version apply': [
        "--all",
        "--dry-run",
        "--prerelease",
        "--recursive",
        "--json"
    ],
    'version check': [
        "--interactive"
    ],
    why: [
        "--recursive",
        "--json",
        "--peers"
    ],
    workspace: [],
    'workspaces focus': [
        "--json",
        "--production",
        "--all"
    ],
    'workspaces foreach': [
        "--from",
        "--all",
        "--recursive",
        "--worktree",
        "--verbose",
        "--parallel",
        "--interlaced",
        "--jobs",
        "--topological",
        "--topological-dev",
        "--include",
        "--exclude",
        "--no-private",
        "--since",
        "--dry-run"
    ],
    'workspaces list': [
        "--since",
        "--recursive",
        "--no-private",
        "--verbose",
        "--json"
    ]
};

function readManifest() {
    try {
        return JSON.parse(readFileSync('package.json'));
    } catch {
        return undefined;
    }
}

/**
 * @param {string} completion
 * @returns {void}
 */
function suggestCompletion(completion) {
    if (completion.startsWith(wordInCompletion)) {
        // Bash treats ':' as separator when replacing prefixes with completions.
        if (wordInCompletion.includes(':')) {
            const remainder = completion.substring(wordInCompletion.lastIndexOf(':') + 1);
            console.log(remainder);
        } else {
            console.log(completion);
        }
    }
}

// Completion for Yarn CLI command names.
const completableComands = Object.keys(commandOptions).filter(command => command.startsWith(commandWithArgs));
if (completableComands.length > 0) {
    const commandWithArgsWords = commandWithArgs.split(/\s+/);
    for (const command of completableComands) {
        const commandWords = command.split(' ');
        for (let i = 0; i < commandWords.length; i++) {
            if (commandWithArgsWords[i] !== commandWords[i]) {
                console.log(commandWords.slice(i).join(' '));
                break;
            }
        }
    }
}

// Completion for options of current command.
const currentCommandOptions = Object.keys(commandOptions).filter(command => commandWithArgs.startsWith(command + ' '));
// Sort for example 'config set' before 'config'.
currentCommandOptions.sort((commandA, commandB) => {
    if (commandA.startsWith(commandB)) {
        return -1;
    } else {
        return 1;
    }
});
if (currentCommandOptions.length > 0) {
    const currentCommand = currentCommandOptions[0];
    const inScriptArgs = currentCommand === 'run' && /^run\s+\S+\s$/.test(commandWithArgs);
    if (inScriptArgs) {
        // No need to suggest options to Yarn's 'run' since we are already in the script's arguments.
        return;
    }
    for (const option of commandOptions[currentCommand]) {
        suggestCompletion(option);
    }

    if (currentCommand === 'run') {
        const manifest = readManifest();
        if (manifest?.scripts && typeof (manifest.scripts) === 'object') {
            for (const script of Object.keys(manifest.scripts)) {
                suggestCompletion(script)
            }
        }
    }

    const commandsWithPackageSuggestions = ['dedupe', 'info', 'npm info', 'patch', 'rebuild', 'remove', 'unplug', 'up', 'why'];
    if (commandsWithPackageSuggestions.includes(currentCommand)) {
        const manifest = readManifest();
        for (const key of ['dependencies', 'devDependencies']) {
            if (manifest?.[key] && typeof (manifest[key]) === 'object') {
                for (const packageName of Object.keys(manifest[key])) {
                    suggestCompletion(packageName);
                }
            }
        }
    }
}