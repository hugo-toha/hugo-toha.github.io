<!-- This file is built by build-readme.js. Do not edit it directly; edit README.md.template instead. -->
# eslint-plugin-no-jquery

Disallow jQuery functions, with suggestions for native equivalents where possible.

Originally a fork of [eslint-plugin-jquery](https://github.com/dgraham/eslint-plugin-jquery/).

## ⬇️ Installation

You'll first need to install [ESLint](http://eslint.org):

```sh
npm install eslint --save-dev
```

Next, install `eslint-plugin-no-jquery`:

```sh
npm install eslint-plugin-no-jquery --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-no-jquery` globally.

## 🛠️ Usage

Add `no-jquery` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "extends": "plugin:no-jquery/deprecated",
  "plugins": [
    "no-jquery"
  ]
}
```

## 📋 Configs

The config **`plugin:no-jquery/recommended`** includes the recommended rule [`no-jquery/variable-pattern`](docs/rules/variable-pattern.md) which is required for method rules to work correctly.

The config **`plugin:no-jquery/deprecated`** includes all known deprecated and removed code, and is updated as new releases of jQuery come out. You can instead use configs targeting specific versions of jQuery if you know the environment in which your code will operate. There is a config for all minor versions from 1.0 to 3.6 (`deprecated-1.0`, ..., `deprecated-3.6`). Deprecation configs are cumulative, so they include all the rules for jQuery versions below them.

The config **`plugin:no-jquery/slim`** includes all features excluded from the official "slim" build of jQuery, specifically the [ajax](https://api.jquery.com/category/ajax/) and [effects](https://api.jquery.com/category/effects/) modules.

The config **`plugin:no-jquery/all`** includes all methods and utilies and should be used when you are aiming to remove all jQuery usage from your code.

Alternatively, you can pick out rules individually (see below).

## ⚙️ Settings

The following global settings can be used under the `no-jquery` property to configure the linter:

* `constructorAliases` - An array of aliases for the jQuery constructor. Defaults to `[ "$", "jQuery" ]`.
* `variablePattern` - Regular expression pattern for matching jQuery variables. Defaults to `"^\\$."`. This pattern can be enforced with the [`no-jquery/variable-pattern`](docs/rules/variable-pattern.md) rule.
* `collectionReturningPlugins` - An object describing the return types of jQuery plugins. Keys are plugin method names, and values can be one of:
  * `'always'` a plugin which always returns a jQuery collection.
    * e.g. `$bar = $foo.stop()`
  * `'accessor'` a plugin which only returns a jQuery collection when an argument is given.
    * e.g. `w = $foo.width()`, `$bar = $foo.width( 200 )`
  * `'valueAccessor'` a plugin which only returns a jQuery collection when more than one argument is given.
    * e.g. `w = $foo.css( 'width' )`, `$bar = $foo.css( 'width', '1em' )`
  * `'never'` (default) a plugin which never returns a jQuery collection.
    * e.g. `arr = $foo.toArray()`

```json
{
  "settings": {
    "no-jquery": {
        "constructorAliases": [ "$", "jQuery" ],
        "variablePattern": "^\\$.|^element$",
        "collectionReturningPlugins": {
          "datePicker": "always"
        }
    }
  },
  "plugins": [
    "no-jquery"
  ]
}
```

## 📖 Rules

Rules with options are indicated with ⚙️. Rules which are fixable are indicated with 🔧.

Where rules are included in the configs `recommended`, `slim`, `all` or `deprecated-X.X` it is indicated below. Where rules are included in a config with non-default options this is indicated with a `†`.

* [`no-jquery/no-ajax`](docs/rules/no-ajax.md) `slim`, `all`
* [`no-jquery/no-ajax-events`](docs/rules/no-ajax-events.md) `slim`
* [`no-jquery/no-and-self`](docs/rules/no-and-self.md) 🔧 `1.8`
* [`no-jquery/no-animate`](docs/rules/no-animate.md) ⚙️ `slim`, `all`
* [`no-jquery/no-animate-toggle`](docs/rules/no-animate-toggle.md) `slim`
* [`no-jquery/no-append-html`](docs/rules/no-append-html.md)
* [`no-jquery/no-attr`](docs/rules/no-attr.md) `all`
* [`no-jquery/no-bind`](docs/rules/no-bind.md) `3.0`, `all`
* [`no-jquery/no-box-model`](docs/rules/no-box-model.md) `1.3`
* [`no-jquery/no-browser`](docs/rules/no-browser.md) `1.3`
* [`no-jquery/no-camel-case`](docs/rules/no-camel-case.md) `3.3`, `all`
* [`no-jquery/no-class`](docs/rules/no-class.md) `all`
* [`no-jquery/no-class-state`](docs/rules/no-class-state.md)
* [`no-jquery/no-clone`](docs/rules/no-clone.md) `all`
* [`no-jquery/no-closest`](docs/rules/no-closest.md) `all`
* [`no-jquery/no-constructor-attributes`](docs/rules/no-constructor-attributes.md)
* [`no-jquery/no-contains`](docs/rules/no-contains.md) `all`
* [`no-jquery/no-context-prop`](docs/rules/no-context-prop.md) `1.10`
* [`no-jquery/no-css`](docs/rules/no-css.md) `all`
* [`no-jquery/no-data`](docs/rules/no-data.md) `all`
* [`no-jquery/no-deferred`](docs/rules/no-deferred.md) `all`
* [`no-jquery/no-delegate`](docs/rules/no-delegate.md) `3.0`, `all`
* [`no-jquery/no-each`](docs/rules/no-each.md)
* [`no-jquery/no-each-collection`](docs/rules/no-each-collection.md) `all`
* [`no-jquery/no-each-util`](docs/rules/no-each-util.md) `all`
* [`no-jquery/no-error`](docs/rules/no-error.md) 🔧 `all`
* [`no-jquery/no-error-shorthand`](docs/rules/no-error-shorthand.md) 🔧 `1.8`
* [`no-jquery/no-escape-selector`](docs/rules/no-escape-selector.md) 🔧 `all`
* [`no-jquery/no-event-shorthand`](docs/rules/no-event-shorthand.md) ⚙️ 🔧 `3.5`, `3.3†`, `all`
* [`no-jquery/no-extend`](docs/rules/no-extend.md) ⚙️ `all`
* [`no-jquery/no-fade`](docs/rules/no-fade.md) `slim`, `all`
* [`no-jquery/no-filter`](docs/rules/no-filter.md) `all`
* [`no-jquery/no-find`](docs/rules/no-find.md)
* [`no-jquery/no-find-collection`](docs/rules/no-find-collection.md) `all`
* [`no-jquery/no-find-util`](docs/rules/no-find-util.md) `all`
* [`no-jquery/no-fx-interval`](docs/rules/no-fx-interval.md) `3.0`
* [`no-jquery/no-global-eval`](docs/rules/no-global-eval.md) `all`
* [`no-jquery/no-global-selector`](docs/rules/no-global-selector.md) ⚙️
* [`no-jquery/no-grep`](docs/rules/no-grep.md) `all`
* [`no-jquery/no-has`](docs/rules/no-has.md) `all`
* [`no-jquery/no-hold-ready`](docs/rules/no-hold-ready.md) `3.2`, `all`
* [`no-jquery/no-html`](docs/rules/no-html.md) ⚙️ `all`
* [`no-jquery/no-in-array`](docs/rules/no-in-array.md) `all`
* [`no-jquery/no-is`](docs/rules/no-is.md) `all`
* [`no-jquery/no-is-array`](docs/rules/no-is-array.md) 🔧 `3.2`, `all`
* [`no-jquery/no-is-empty-object`](docs/rules/no-is-empty-object.md) `all`
* [`no-jquery/no-is-function`](docs/rules/no-is-function.md) 🔧 `3.3`, `all`
* [`no-jquery/no-is-numeric`](docs/rules/no-is-numeric.md) `3.3`, `all`
* [`no-jquery/no-is-plain-object`](docs/rules/no-is-plain-object.md) `all`
* [`no-jquery/no-is-window`](docs/rules/no-is-window.md) `3.3`, `all`
* [`no-jquery/no-jquery-constructor`](docs/rules/no-jquery-constructor.md) `all`
* [`no-jquery/no-live`](docs/rules/no-live.md) `1.7`, `all`
* [`no-jquery/no-load`](docs/rules/no-load.md) `slim`, `all`
* [`no-jquery/no-load-shorthand`](docs/rules/no-load-shorthand.md) 🔧 `1.8`
* [`no-jquery/no-map`](docs/rules/no-map.md)
* [`no-jquery/no-map-collection`](docs/rules/no-map-collection.md) `all`
* [`no-jquery/no-map-util`](docs/rules/no-map-util.md) `all`
* [`no-jquery/no-merge`](docs/rules/no-merge.md) `all`
* [`no-jquery/no-node-name`](docs/rules/no-node-name.md) `3.2`, `all`
* [`no-jquery/no-noop`](docs/rules/no-noop.md) 🔧 `all`
* [`no-jquery/no-now`](docs/rules/no-now.md) 🔧 `3.3`, `all`
* [`no-jquery/no-on-ready`](docs/rules/no-on-ready.md) 🔧 `1.8`
* [`no-jquery/no-other-methods`](docs/rules/no-other-methods.md) `all`
* [`no-jquery/no-other-utils`](docs/rules/no-other-utils.md) `all`
* [`no-jquery/no-param`](docs/rules/no-param.md) `all`
* [`no-jquery/no-parent`](docs/rules/no-parent.md) `all`
* [`no-jquery/no-parents`](docs/rules/no-parents.md) `all`
* [`no-jquery/no-parse-html`](docs/rules/no-parse-html.md) `all`
* [`no-jquery/no-parse-html-literal`](docs/rules/no-parse-html-literal.md) ⚙️ 🔧
* [`no-jquery/no-parse-json`](docs/rules/no-parse-json.md) 🔧 `3.0`, `all`
* [`no-jquery/no-parse-xml`](docs/rules/no-parse-xml.md) 🔧 `slim`, `all`
* [`no-jquery/no-prop`](docs/rules/no-prop.md) `all`
* [`no-jquery/no-proxy`](docs/rules/no-proxy.md) 🔧 `3.3`, `all`
* [`no-jquery/no-ready`](docs/rules/no-ready.md)
* [`no-jquery/no-ready-shorthand`](docs/rules/no-ready-shorthand.md) 🔧 `3.0`, `all`
* [`no-jquery/no-selector-prop`](docs/rules/no-selector-prop.md) `1.7`
* [`no-jquery/no-serialize`](docs/rules/no-serialize.md) `all`
* [`no-jquery/no-size`](docs/rules/no-size.md) 🔧 `1.8`, `all`
* [`no-jquery/no-sizzle`](docs/rules/no-sizzle.md) ⚙️ `3.4†`
* [`no-jquery/no-slide`](docs/rules/no-slide.md) `slim`, `all`
* [`no-jquery/no-sub`](docs/rules/no-sub.md) `1.7`, `all`
* [`no-jquery/no-support`](docs/rules/no-support.md) `1.9`
* [`no-jquery/no-text`](docs/rules/no-text.md) `all`
* [`no-jquery/no-trigger`](docs/rules/no-trigger.md) `all`
* [`no-jquery/no-trim`](docs/rules/no-trim.md) `3.5`, `all`
* [`no-jquery/no-type`](docs/rules/no-type.md) `3.3`, `all`
* [`no-jquery/no-unique`](docs/rules/no-unique.md) 🔧 `3.0`, `all`
* [`no-jquery/no-unload-shorthand`](docs/rules/no-unload-shorthand.md) 🔧 `1.8`
* [`no-jquery/no-val`](docs/rules/no-val.md) `all`
* [`no-jquery/no-visibility`](docs/rules/no-visibility.md) `all`
* [`no-jquery/no-when`](docs/rules/no-when.md) `all`
* [`no-jquery/no-wrap`](docs/rules/no-wrap.md) `all`
* [`no-jquery/variable-pattern`](docs/rules/variable-pattern.md) `recommended`

### ⚠️ Deprecated

* [`no-jquery/no-die`](docs/rules/no-die.md) (use [`no-jquery/no-live`](docs/rules/no-live.md))
* [`no-jquery/no-hide`](docs/rules/no-hide.md) (use [`no-jquery/no-visibility`](docs/rules/no-visibility.md))
* [`no-jquery/no-show`](docs/rules/no-show.md) (use [`no-jquery/no-visibility`](docs/rules/no-visibility.md))
* [`no-jquery/no-submit`](docs/rules/no-submit.md) (use [`no-jquery/no-event-shorthand`](docs/rules/no-event-shorthand.md))
* [`no-jquery/no-toggle`](docs/rules/no-toggle.md) (use [`no-jquery/no-visibility`](docs/rules/no-visibility.md))
* [`no-jquery/no-unbind`](docs/rules/no-unbind.md) (use [`no-jquery/no-bind`](docs/rules/no-bind.md))
* [`no-jquery/no-undelegate`](docs/rules/no-undelegate.md) (use [`no-jquery/no-delegate`](docs/rules/no-delegate.md))

## 🤖 Development

```sh
npm install
npm test
```

To update documentation after modifying a rule or its tests, use

```sh
npm run doc
```

To run a specific test or tests:

```sh
npm run testpath tests/rules/no-ajax
```

## ⚖️ License

Distributed under the MIT license. See LICENSE for details.
