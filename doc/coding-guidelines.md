# Coding Guidelines
## Beginning a new Node project
To make sure you follow the coding guidelines, you need to add a linter that uses the global eslint config.

To do this, add the following lines to your package.json:

```json
{
    ...
    "scripts": {
        ...
        "lint": "eslint -f unix -c ../.eslint.js ."
    }
    ...
}
```

You may need to change the path to the eslint config file depending on how deep your project is in the hierarchy.

## General guidelines
For more details follow these urls:

* [Google JS style guide](https://google.github.io/styleguide/jsguide.html)

* [Ainbnb](https://github.com/airbnb/javascript)

* [Coding Conventions Wiki](https://en.wikipedia.org/wiki/Coding_conventions)

Note: _These coding guidelines are for general coding and doesn't focus on any particular programming language._

1. Follow KISS principle. The code should be as simple as possible.
2. DRY. You should not repeat yourself. If you find repeating yourself, try to separate that into different functionality.
3. The code should be as modular as possible.
4. The code should be well documented.
    - The file header should contain a brief description of what the file is trying to achieve.
    - The method should have multiline comments before its implementation.
      ```javascript
      /*
      brief method description.
      @param x - param 1
      @param y - param 2
      @returns z value
      */
      ```
    - Trailing single line comments for complex logic
    const x = 1; // Declare a constant x with value 1
5. Follow naming conventions.
    - camelCase for variable names
    - kebab-case for file names
    - `snake_case` in all-caps for global constants
    - The method names should be meaningful and give a hint of what the method is about.
6. The code should be properly indented.
    - Braces are required for all control structures ( if, else, while, for)
    - No line break before the opening brace.
    - Line break after the opening brace.
    - Line break before the closing brace.
    - Use `const` and `let` instead of `var`.
    - Each time a new block or block-like construct is opened, the indent increases by two spaces.
7. Always destruct object to fetch a property.

    ```javascript
    const x = a.b.x; // wrong
    const { x } = a.b; // right
    const { x: y } = a.b; // right, y as alias of x
    const { x = 1 } = a.b; // right, default value of y
    ```
8. The lines should be wrapped at 120 chars.
