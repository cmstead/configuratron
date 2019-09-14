function configReader(
    configFileReader,
    configLocator,
    configParser,
    pathOptionNormalizer,
    typeHelper
) {

    const { isNull } = typeHelper;
    const { locatePathOption } = configLocator;
    const { normalizePathOptions } = pathOptionNormalizer;
    const { parseConfiguration } = configParser;
    const { readConfigFile } = configFileReader;

    function getPathOption(filePaths) {
        const pathOptions = normalizePathOptions(filePaths);
        return locatePathOption(pathOptions);
    }

    function read(filePaths) {
        const pathOption = getPathOption(filePaths);
        const configString = readConfigFile(pathOption);
        const configurationData = parseConfiguration(configString, pathOption);
        const configurationWasRead = !isNull(configurationData);

        return configurationWasRead ? configurationData : {};
    }

    return {
        read
    };
}

module.exports = configReader;