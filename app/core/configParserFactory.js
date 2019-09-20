function configParserFactory(
    typeHelper
) {

    const { isString } = typeHelper;

    function defaultParser (value) {
        return JSON.parse(value);
    }

    function buildConfigParser(parse = defaultParser) {

        function parseConfiguration(configurationValue) {
            return isString(configurationValue)
                ? parse(configurationValue)
                : {};
        }

        return {
            parseConfiguration
        }

    }

    return {
        buildConfigParser
    };
}

module.exports = configParserFactory;
