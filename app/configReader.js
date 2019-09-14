function configReader(
    configFileReader,
    configLocator,
    configParser,
    pathOptionNormalizer
) {

    const { locatePathOption } = configLocator;
    const { normalizePathOptions } = pathOptionNormalizer;
    const { parseConfiguration } = configParser;
    const { readConfigFile } = configFileReader;

    function read(filePaths) {
        const pathOptions = normalizePathOptions(filePaths)
        const pathOption = locatePathOption(pathOptions);
        const configString = readConfigFile(pathOption);

        return parseConfiguration(configString, pathOption);
    }

    return {
        read
    };
}

module.exports = configReader;