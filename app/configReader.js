function configReader(
    fs,
    pathOptionNormalizer,
    typeHelper
) {

    const { isString, isNull } = typeHelper;
    const { normalizePathOptions } = pathOptionNormalizer;

    function readConfigFileFromDisk(fs, pathOption) {
        try {
            return fs.readFileSync(pathOption.path, { encoding: 'utf8' });
        } catch (e) {
            return {};
        }
    }

    function readConfigFile(pathOption) {
        return !isNull(pathOption)
            ? readConfigFileFromDisk(fs, pathOption)
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

    function readAndParseConfiguration(pathOption) {
        const configString = readConfigFile(pathOption);

        return parseConfiguration(pathOption, configString);
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