function configReader(
    configParser,
    configLocator,
    pathOptionNormalizer,
    typeHelper
) {

    const { isNull } = typeHelper;
    const { normalizePathOptions } = pathOptionNormalizer;
    const { readAndParseConfiguration } = configParser;
    const {getConfigurationPathOption} = configLocator;

    function getConfigurationString(filePaths) {
        const pathOptions = normalizePathOptions(filePaths);
        const pathOption = getConfigurationPathOption(pathOptions);

        return readAndParseConfiguration(pathOption);
    }

    function read(filePaths) {
        const configurationData = getConfigurationString(filePaths);
        const configurationWasRead = !isNull(configurationData);

        return configurationWasRead ? configurationData : {};
    }

    return {
        read
    };
}

module.exports = configReader;