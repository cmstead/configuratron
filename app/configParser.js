function configParser(
    fs,
    typeHelper
) {

    const { isString } = typeHelper;

    function parseConfiguration(pathOption, configurationString) {
        return isString(configurationString)
            ? pathOption.parser(configurationString)
            : null;
    }

    function readAndParseConfiguration(configString, pathOption) {
        return parseConfiguration(pathOption, configString);
    }

    return {
        readAndParseConfiguration
    };
}

module.exports = configParser;
