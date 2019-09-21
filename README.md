# Configuratron #

Configuratron is a cybernetic JavaScript software implant designed to simplify the process of creating, storing, retrieving, and modifying configuration files. Rather than building a bunch of file and merge logic into the core of your application, Configuratron makes it easy to set it and forget it.

## Installation ##

Use npm to install Configuratron:

`npm i configuratron`

## Usage ##

Configuratron is built to be simple to use and integrate. By default, Configuratron is designed to read and write to the current working directory, and read/write JSON.  Below is an example of the most common usage:

```javascript
const configuratron = require('configuratron')
    .buildConfiguratron({ filePath: 'myConfig.json' });
```
