function configReader(
    fs,
    pathOptionNormalizer,
    typeHelper
) {

    const { isString, isFunction } = typeHelper;

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

    function normalizePathOption(fileOption) {
        return {
            path: getFilePathFromOption(fileOption),
            parser: getConfigParser(fileOption)
        };
    }

    function normalizePathOptions(filePaths) {
        return filePaths.map(normalizePathOption);
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

    function getConfigurationPathOption(filePaths) {
        let normalizedPathOptions = pathOptionNormalizer.normalizePathOptions(filePaths);
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
        const configurationData = getConfigurationString(filePaths);
        const configurationWasRead = configurationData !== null;

        return configurationWasRead ? configurationData : {};
    }

    return {
        read
    };
}

module.exports = configReader;