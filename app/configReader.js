function configReader(fs) {

    function readFileOrNull(filePath) {
        return fs.readFileSync(filePath, { encoding: 'utf8' });
    }

    function getFilePathFromOption(currentFilePathOption) {
        return isString(currentFilePathOption)
            ? currentFilePathOption
            : currentFilePathOption.path;
    }

    function defaultParser(configString) {
        return JSON.parse(configString);
    }

    function getConfigParser(filePathOption) {
        const optionHasNoParser = isString(filePathOption)
            || !isFunction(filePathOption.parser);

        return optionHasNoParser
            ? defaultParser
            : filePathOption.parser;
    }

    function parseConfiguration(pathOption, configurationString) {
        const parse = pathOption.parser;

        return parse(configurationString);
    }

    function normalizeFileOption(fileOption) {
        return {
            path: getFilePathFromOption(fileOption),
            parser: getConfigParser(fileOption)
        };
    }

    function isType(typeString) {
        return function (value) {
            return typeof value === typeString;
        }
    }

    const isString = isType('string');
    const isFunction = isType('function');

    function getConfigurationString(filePaths) {
        let normalizedPathOptions = filePaths.map(normalizeFileOption);
        let lastPathOption;

        while (normalizedPathOptions.length > 0) {
            lastPathOption = normalizedPathOptions.shift();

            if (fs.existsSync(lastPathOption.path)) {
                break;
            }
        }

        const configurationString = readFileOrNull(lastPathOption.path);

        return isString(configurationString)
            ? parseConfiguration(lastPathOption, configurationString)
            : null;
    }

    function read(filePaths) {
        let configurationData = getConfigurationString(filePaths);

        if (configurationData === null) {
            throw new Error('Unable to locate configuration file');
        } else {
            return configurationData;
        }
    }

    return {
        read
    };
}

module.exports = configReader;