# yarn-autocomplete-bash

Provides completion in Bash when calling `yarn`.

Works by registering a Bash completion to suggest arguments to `yarn`. See https://www.gnu.org/software/bash/manual/html_node/Programmable-Completion.html for details.

## Try out
```
complete -C /your-checkout/yarn-autocomplete-bash.js yarn

yarn <TAB><TAB>
yarn run <TAB><TAB>
```

## Install

Add `complete -C /your-checkout/yarn-autocomplete-bash.js yarn` to your `~/.bashrc`.
