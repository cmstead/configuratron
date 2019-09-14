function configReader(
    configParser,
    configLocator,
    pathOptionNormalizer,
    typeHelper
) {

    const { isNull } = typeHelper;
    const { normalizePathOptions } = pathOptionNormalizer;
    const { readAndParseConfiguration } = configParser;
    const { locatePathOption } = configLocator;

    function getPathOption(filePaths) {
        const pathOptions = normalizePathOptions(filePaths);
        return locatePathOption(pathOptions);
    }

    function read(filePaths) {
        const pathOption = getPathOption(filePaths);
        const configurationData = readAndParseConfiguration(pathOption);
        const configurationWasRead = !isNull(configurationData);

        return configurationWasRead ? configurationData : {};
    }

    return {
        read
    };
}

module.exports = configReader;