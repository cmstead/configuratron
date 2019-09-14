function configReader(
    configHydrator,
    fs,
    pathOptionNormalizer,
    typeHelper
) {

    const { isNull } = typeHelper;
    const { normalizePathOptions } = pathOptionNormalizer;
    const { readAndParseConfiguration } = configHydrator;

    function doesFileExist(pathOption) {
        return fs.existsSync(pathOption.path);
    }

    function getLastPathOption(lastPathOption, pathOption) {
        return isNull(lastPathOption) && doesFileExist(pathOption)
            ? pathOption
            : lastPathOption;
    }

    function getConfigurationPathOption(pathOptions) {
        let lastPathOption = null;

        pathOptions.forEach(function (pathOption) {
            lastPathOption = getLastPathOption(lastPathOption, pathOption);
        });

        return lastPathOption;
    }

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