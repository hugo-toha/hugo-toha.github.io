# eslint-plugin-no-jquery release history

## v2.7.0
* New rule: `no-append-html` (#284) (Ed Sanders)
* New config: Allow rules to disable get/set separately, starting with no-html (Ed Sanders)
* Deprecated rule: `no-submit`; use `no-event-shorthand` (Ed Sanders)

—
* Code: Sort ajax events consistently and alphabetically. (Ed Sanders)
* Code: utils.isjQuery: Improve `Identifier` detection (#283) (Ed Sanders)

—
* Docs: Update eslint-docgen to 0.5.1 (#290) (Ed Sanders)
* Docs: Show which rules have options, and which are fixable in README (#289) (Ed Sanders)
* Docs: Fix test links (#280) (Ed Sanders)

—
* Release: Update devDependencies (#278) (Ed Sanders)

## v2.6.0
* New rule: `no-escape-selector` for `$.escapeSelector` util (Ed Sanders)
* New config: `deprecated-3.6` for new jQuery release (Ed Sanders)

—
* Rule fix: Add fixer for `no-on-ready` (Ed Sanders)
* Rule fix: Add fixer for `no-ready-shorthand` (Ed Sanders)
* Rule fix: Add fixer for `no-error` (Ed Sanders)
* Rule fix: Add fixer for `no-parse-xml` (Ed Sanders)
* Rule fix: Add fixer for `no-parse-html-literal` tag style (Ed Sanders)
* Rule fix: `no-now`; recommend `Date.now` rather than `(new Date).getTime()` (Ed Sanders)

—
* Code: Add real arguments to `no-parse-html` tests (Ed Sanders)
* Code: codecov.yaml: Remove extra linebreak (Ed Sanders)
* Release: Update devDependencies (#266) (Ed Sanders)


## v2.5.0

* New config: `recommended` just includes `variable-pattern` rule (Ed Sanders)
* New config: `all` covers all usages of jQuery methods and utils (Ed Sanders)
* New config: Create a `deprecated-X.X` config for every minor release (Ed Sanders)
* Configs: Use 'warn' instead of 'error' in `deprecated-X` and `all` configs (Ed Sanders)
* New rule: `no-jquery-constructor` (Ed Sanders)

—
* Code: Add `reporthtml` coverage script (Ed Sanders)
* Code: Remove unnecessary constants (Ed Sanders)
* Code: Replace `Array#indexOf` with `Array#includes` (Ed Sanders)
* Code: Only assert error message strings (Ed Sanders)
* Code: Introduce eslint-plugin-eslint-plugin (Ed Sanders)
* Code: Add ESLint 7.0.0 support (Ed Sanders)
* Code: Prefer `$("div")` in test cases (Ed Sanders)
* Code: Fix ESLint 2.3.0 support (Ed Sanders)

—
* Docs: Document and test the `slim` config (Ed Sanders)
* Docs: Move docs to docs/rules (Ed Sanders)
* Docs: Suppress more examples with noDoc (no-parse-html-literal) (Ed Sanders)
* Docs: Update to eslint-docgen 0.3.1 (Ed Sanders)
* Docs: Suppress some examples with noDoc in long documentation files (Ed Sanders)
* Docs: Use eslint-docgen (Ed Sanders)
* Docs: Remove noDoc arg from RuleTesterAndDocs, just use RuleTester (Ed Sanders)
* Docs: Fetch 'main' path from package.json (Ed Sanders)
* Docs: Remove extra linebreak from no-parse-html-literal.md (Ed Sanders)
* Docs: Add missing linebreak before rule source section (Ed Sanders)
* Docs: Improvements to doc builder (Ed Sanders)

—
* Release: Update devDependencies (Ed Sanders)

## v2.4.1

* Config fix: Fix override of `no-event-shorthand` in `deprecated-3.5` (Ed Sanders)

—
* Code: Add real test coverage for index.js (Ed Sanders)
* Code: gitignore coverage.lcov (Ed Sanders)

## v2.4.0

* New feature: Add specification of plugin return types to settings (Ed Sanders)

—
* New config: Add new `deprecated-3.5` config (Ed Sanders)

—
* New rule: `no-find-collection`, split out of `no-find` (Ed Sanders)
* New rule: `no-find-util`, split out of `no-find` (Ed Sanders)

—
* Rule fix: Set all rules to type: `suggestion` (Ed Sanders)
* Rule fix: `no-global-selector`; add `allowIds` option to allow global selector by ID (Adam Roses Wight)
* Rule fix: `no-event-shorthand`; add `allowAjaxEvents` option and use in `deprecated-3.3` (Ed Sanders)

—
* Docs: Avoid duplicating name in "Prefer..." sentence (Ed Sanders)
* Docs: Build lists in README.md automatically (Ed Sanders)
* Docs: Consistently use `.methodOrProp` with collections, not `$.methodOrProp` (Ed Sanders)
* Docs: Link to jQuery documentation for each method/util/property (Ed Sanders)
* Docs: Show ruleset information in README (Ed Sanders)

—
* Release: State "MIT license" in LICENSE header (Ed Sanders)
* Release: Update devDependencies (Ed Sanders)

—
* Code: Add `#odd` and `#even` to all methods lists, new in jQuery 3.5 (Ed Sanders)
* Code: Add code coverage checks using Istanbul (Ed Sanders)
* Code: Move index.js to src/ (Ed Sanders)
* Code: Restructure files and folders (Ed Sanders)
* Code: Setup codecov GitHub Action integration (Ed Sanders)


## v2.3.2

* Rule fix: Add fixer for `no-is-function` (Ed Sanders)
* Rule fix: Follow-up #186: Actually merge `no-undelegate` into `no-delegate` (Ed Sanders)

—
* Docs: Soften and make clearer the language for `no-class-state` (James D. Forrester)
* Docs: Explain `no-global-selector` restriction more clearly (James D. Forrester)

—
* Release: Update devDependencies (Ed Sanders)

—
* Code: Remove non-existent $.fn.parse from tests (Ed Sanders)


## v2.3.1
* New feature: Show deprecation message in linting errors (Ed Sanders)

—
* Deprecated rule: `no-die`; use `no-live` (Ed Sanders)
* Deprecated rule: `no-unbind`; use `no-bind` (Ed Sanders)
* Deprecated rule: `no-undelegate`; use `no-delegate` (Ed Sanders)

—
* Rule fix: Remove `load` from `no-event-shorthand` (Ed Sanders)

—
* Docs: Build generic "Prefer" messages for docs when node===true (Ed Sanders)
* Docs: Escape all code snippets (Ed Sanders)
* Docs: Monospace rule names (Ed Sanders)

—
* Release: Add icons to readme section headings (Ed Sanders)
* Release: Fix Changelog markdown list spacing (Ed Sanders)
* Release: Use a limited ruleset for lint-fixing documentation snippets (Ed Sanders)

—
* Code: Add `triggerHandler` to `nonCollectionReturningMethods` (Ed Sanders)
* Code: Check documentation in CI (Ed Sanders)
* Code: Check rules are listed in README.md & index.js (Ed Sanders)
* Code: Migrate from Travis to GitHub Actions (James D. Forrester)
* Code: Remove incorrect TODO comment (Ed Sanders)


## v2.3.0
* New rule: `variable-pattern` (Ed Sanders)
* New rule: `no-parse-xml` (Ed Sanders)
* New rule: `no-visibility` as a group alias for `no-show`, `no-hide`, & `no-toggle` (Ed Sanders)

—
* New config: `slim` as a config for users of the jQuery slim build (Ed Sanders)

—
* Deprecated rule: `no-show` (Ed Sanders)
* Deprecated rule: `no-hide` (Ed Sanders)
* Deprecated rule: `no-toggle` (Ed Sanders)

—
* Rule fix: Add `allowDeep` options to `no-extend` (Ed Sanders)
* Rule fix: Add `hasData` method to `no-data` rule (Ed Sanders)
* Rule fix: Enforce single tag style in `no-parse-html-literal` (Ed Sanders)

—
* New fixer: Add fixer for `no-event-shorthand` and similar (Ed Sanders)
* New fixer: Add fixer for `no-noop` (Ed Sanders)
* New fixer: Add fixer for `no-now` (Ed Sanders)
* New fixer: Add fixer for `no-size` (Ed Sanders)

—
* Docs: Link to each rule's definition (Ed Sanders)
* Docs: Switch `constructorAliases`/`variablePattern` in README (Ed Sanders)
* Docs: Pad fixer examples so they align (Ed Sanders)
* Docs: Output example fixes in documentation (Ed Sanders)

—
* Release: Update LICENSE authors (Ed Sanders)

—
* Code: Add `npm run testpath` for running a single test (Ed Sanders)
* Code: Add a test that automatically captures all rules (Ed Sanders)
* Code: Avoid `key in object` lookup (Ed Sanders)
* Code: Improvements to collection return detection (Ed Sanders)
* Code: More fixes to jQuery method return types (Ed Sanders)
* Code: Rename .eslintrc to .eslintrc.json (Ed Sanders)
* Code: Update eslint-config-wikimedia (Ed Sanders)


## v2.2.1
* Release: Update index.js and README with missing rules (Ed Sanders)


## v2.2.0
* New rule: `no-camel-case` (Christophe Coevoet)
* New rule: `no-constructor-attributes` (Ed Sanders)
* New rule: `no-contains` (Christophe Coevoet)
* New rule: `no-error` (Ed Sanders)
* New rule: `no-is-empty-object` (Ed Sanders)
* New rule: `no-is-plain-object` (Ed Sanders)
* New rule: `no-node-name` (Ed Sanders)

—
* Rule fix: Add `removeAttr` to `no-attr` rule (Ed Sanders)
* Rule fix: Add `removeProp` to `no-remove-prop` rule (Ed Sanders)
* Rule fix: Add ajax method shorthands to `no-ajax-events` and `no-event-shorthand` (Ed Sanders)
* Rule fix: Detect concatenated selectors in `no-sizzle` (Ed Sanders)
* Rule fix: Handle concatenated strings and other methods in `no-parse-html-literal` (Ed Sanders)
* Rule fix: Include the `$.clone` utility in the `no-clone` rule (Ed Sanders)
* Rule fix: Include the `$.css` utility in the `no-css` rule (Ed Sanders)
* Rule fix: Make error message in `no-parse-html-literal` less specific (Ed Sanders)
* Rule fix: Separate out positional sizzle selectors and add to `deprecated-3.4` (Ed Sanders)

—
* New fixer: Add fixer for `no-and-self` (Ed Sanders)
* New fixer: Add fixer for `no-is-array` (Ed Sanders)
* New fixer: Add fixer for `no-parse-json` (Ed Sanders)
* New fixer: Add fixer for `no-unique` (Ed Sanders)

—
* Docs: Build documentation from tests (Ed Sanders)
* Docs: Comment in documentation when rules are fixable (Ed Sanders)
* Docs: Document `npm run doc` (Ed Sanders)
* Docs: Document when rules are included in a deprecation set (Ed Sanders)

—
* Bug: Fix the detection of jQuery collection calls for non-fluent APIs (e.g. `.toArray()`) (Christophe Coevoet)
* Bug: Support arrow functions (Ed Sanders)

—
* Code: Add an EditorConfig config file (Christophe Coevoet)
* Code: Introduce and use createCollectionOrUtilMethodRule (Ed Sanders)
* Code: Update development dependencies (Ed Sanders)

—
* Release: Add `files` list to package.json (Ed Sanders)
* Release: Add global settings for configuring jQuery constructor/variable names (Ed Sanders)
* Release: Update deprecation rulesets (Ed Sanders)

—
* Improve messages' references to methods vs. static methods (Christophe Coevoet)


## v2.1.0
* New rule: `no-class-state` (Ed Sanders)

—
* Docs: Fix plugin name (Maurício Meneghini Fauth)

—
* Code: Upgrade eslint-config-wikimedia to 0.12.0 (James D. Forrester)


## v2.0.0
* New rule options: `[{allowScroll:true}]` in `no-animate` (Ed Sanders)

—
* Renamed repository, rules and documentation to eslint-plugin-no-jquery (Ed Sanders)
* Update eslint dev dependency to 5.14.0 (Ed Sanders)

# Release history as wikimedia/eslint-plugin-jquery


## v1.3.2-wmf.6
* New rule: `no-box-model` (Ed Sanders)
* New rule: `no-browser` (Ed Sanders)
* New rule: `no-context-prop` (Ed Sanders)
* New rule: `no-error-shorthand` (Ed Sanders)
* New rule: `no-fx-interval` (Ed Sanders)
* New rule: `no-hold-ready` (Ed Sanders)
* New rule: `no-is-numeric` (Ed Sanders)
* New rule: `no-load-shorthand` (Ed Sanders)
* New rule: `no-now` (Ed Sanders)
* New rule: `no-on-ready` (Ed Sanders)
* New rule: `no-ready-shorthand` (Ed Sanders)
* New rule: `no-selector-prop` (Ed Sanders)
* New rule: `no-sub` (Ed Sanders)
* New rule: `no-support` (Ed Sanders)
* New rule: `no-unload-shorthand` (Ed Sanders)

—
* Bug: Fix `isjQuery` util to match `$`-prefixed properties (Ed Sanders)
* Bug: Fix `isjQuery` to not match methods of jQuery properties (Ed Sanders)
* Bug: Only catch `toggle(arg)` if `arg` is definitely not a boolean (Ed Sanders)

—
* Code: De-deduplicate rule generation (Ed Sanders)
* Code: Remove useless export of traverse method (Ed Sanders)


## v1.3.2-wmf.5
* New rule: `no-animate-toggle` (Ed Sanders)
* Add "Prefer CSS transitions" to animation rule messages (Ed Sanders)
* Add " or $.trigger" to `no-event-shorthand` warning (Ed Sanders)


## v1.3.2-wmf.4
* Fix typo in config listing (Ed Sanders)


## v1.3.2-wmf.3
* Revert package name, breaking npm package references to instead fix git references (Ed Sanders)


## v1.3.2-wmf.2
* Provide version-specific deprecation configs (James D. Forrester)
* Move 'deprecated' config as a pointer to latest, remove old 'slim' config (Ed Sanders)

—
* New rule: `no-and-self` (Ed Sanders)
* New rule: `no-die` and `no-live` (Ed Sanders)
* New rule: `no-event-shorthand` (Ed Sanders)
* New rule: `no-global-selector` (Ed Sanders)
* New rule: `no-is-window` (Ed Sanders)
* New rule: `no-noop` (Ed Sanders)
* New rule: `no-parse-html-literal` (Ed Sanders)
* New rule: `no-parse-json` (Ed Sanders)
* New rule: `no-type` (Ed Sanders)
* New rule: `no-unbind` (Ed Sanders)
* New rule: `no-undelegate` (Ed Sanders)
* New rule: `no-unique` (Ed Sanders)

—
* Miscellaneous release-related clean-up (James D. Forrester)


## v1.3.2-wmf.1
* New rule: `no-is-array` (Mackie Underdown)
* New rule: `no-is-function` (Brendan Abbott; renamed by Ed Sanders pre-release)
* New rule: `no-extend` (Brendan Abbott)
* New rule: `no-grep` (Ed Sanders)
* New rule: `no-each-collection` (Ed Sanders)
* New rule: `no-each-util` (Ed Sanders)
* New rule: `no-map-collection` (Ed Sanders)
* New rule: `no-map-util` (Ed Sanders)

—
* Deprecated rule: `no-each` (Ed Sanders)
* Deprecated rule: `no-map` (Ed Sanders)

—
* Code: Update development dependencies (David Graham)
* Code: Refactor to use new rule format (Ed Sanders)

—
* README: Note that this is a fork (James D. Forrester)
