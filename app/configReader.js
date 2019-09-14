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

    function readConfigFile(filePath) {
        return fs.readFileSync(filePath, { encoding: 'utf8' });
    }

    function parseConfiguration(pathOption, configurationString) {
        return pathOption.parser(configurationString);
    }

    function getConfigurationPathOption(filePaths) {
        let normalizedPathOptions = filePaths.map(normalizeFileOption);
        let lastPathOption;

        while (normalizedPathOptions.length > 0) {
            const pathOption = normalizedPathOptions.shift();

            if (fs.existsSync(pathOption.path)) {
                lastPathOption = pathOption;
                break;
            }
        }

        return lastPathOption;
    }

    function getConfigurationString(filePaths) {
        const pathOption = getConfigurationPathOption(filePaths);
        const configurationString = readConfigFile(pathOption.path);

        return isString(configurationString)
            ? parseConfiguration(pathOption, configurationString)
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