function configReader(fs) {

    function isTypeOf(typeString) {
        return function (value) {
            return typeof value === typeString;
        }
    }

    const isString = isTypeOf('string');
    const isFunction = isTypeOf('function');


    function defaultParser(configString) {
        return JSON.parse(configString);
    }

    function getFilePathFromOption(currentFilePathOption) {
        return isString(currentFilePathOption)
            ? currentFilePathOption
            : currentFilePathOption.path;
    }

    function getConfigParser(filePathOption) {
        const optionHasNoParser = isString(filePathOption)
            || !isFunction(filePathOption.parser);

        return optionHasNoParser
            ? defaultParser
            : filePathOption.parser;
    }

    function normalizeFileOption(fileOption) {
        return {
            path: getFilePathFromOption(fileOption),
            parser: getConfigParser(fileOption)
        };
    }

    function readConfigFile(pathOption) {
        return pathOption !== null
            ? fs.readFileSync(pathOption.path, { encoding: 'utf8' })
            : null;
    }

    function parseConfiguration(pathOption, configurationString) {
        return isString(configurationString)
            ? pathOption.parser(configurationString)
            : null;
    }

    function normalizeFilePathOptions(filePaths) {
        return filePaths.map(normalizeFileOption);
    }

    function getConfigurationPathOption(filePaths) {
        let normalizedPathOptions = normalizeFilePathOptions(filePaths);
        let lastPathOption = null;

        for (let i = 0; i < normalizedPathOptions.length; i++) {
            const pathOption = normalizedPathOptions[i];

            if (fs.existsSync(pathOption.path)) {
                lastPathOption = pathOption;
                break;
            }
        }

        return lastPathOption;
    }

    function getConfigurationString(filePaths) {
        const pathOption = getConfigurationPathOption(filePaths);
        const configurationString = readConfigFile(pathOption);

        return parseConfiguration(pathOption, configurationString);
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