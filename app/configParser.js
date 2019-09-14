function configParser(
    fs,
    typeHelper
) {

    const { isNull, isString } = typeHelper;

    function readConfigFileFromDisk(pathOption) {
        try {
            return fs.readFileSync(pathOption.path, { encoding: 'utf8' });
        } catch (e) {
            return {};
        }
    }

    function readConfigFile(pathOption) {
        return !isNull(pathOption)
            ? readConfigFileFromDisk(pathOption)
            : null;
    }

    function parseConfiguration(pathOption, configurationString) {
        return isString(configurationString)
            ? pathOption.parser(configurationString)
            : null;
    }

    function readAndParseConfiguration(pathOption) {
        const configString = readConfigFile(pathOption);

        return parseConfiguration(pathOption, configString);
    }

    return {
        readAndParseConfiguration
    };
}

module.exports = configParser;
