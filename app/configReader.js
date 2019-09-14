function configReader(
    fs,
    pathOptionNormalizer,
    typeHelper
) {

    const { isString } = typeHelper;

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

    function doesFileExist(pathOption) {
        return fs.existsSync(pathOption.path);
    }

    function getLastPathOption(lastPathOption, pathOption) {
        return doesFileExist(pathOption) ? pathOption : lastPathOption;
    }

    function getConfigurationPathOption(pathOptions) {
        let lastPathOption = null;

        for (let i = 0; i < pathOptions.length; i++) {
            const pathOption = pathOptions[i];

            lastPathOption = getLastPathOption(lastPathOption, pathOption);

            if (lastPathOption !== null) {
                break;
            }
        }

        return lastPathOption;
    }

    function readAndParseConfiguration(pathOption) {
        const configString = readConfigFile(pathOption);

        return parseConfiguration(pathOption, configString);
    }

    function getConfigurationString(filePaths) {
        const pathOptions = pathOptionNormalizer.normalizePathOptions(filePaths);
        const pathOption = getConfigurationPathOption(pathOptions);

        return readAndParseConfiguration(pathOption);
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