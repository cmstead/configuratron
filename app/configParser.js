function configParser(
    typeHelper
) {

    const { isString } = typeHelper;

    function parseConfiguration(configString, pathOption) {
        return isString(configString)
            ? pathOption.parser(configString)
            : null;
    }

    return {
        parseConfiguration
    };
}

module.exports = configParser;
