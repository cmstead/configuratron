function pathOptionNormalizer (
    path,
    process,
    typeHelper
) {
    
    const { isString, isFunction } = typeHelper;

    function defaultParser(configString) {
        return JSON.parse(configString);
    }

    function getFilePathFromOption(currentFilePathOption) {
        return isString(currentFilePathOption)
            ? currentFilePathOption
            : currentFilePathOption.path;
    }

    function getConfigParser(filePathOption) {
        const optionHasNoParser = isString(filePathOption)
            || !isFunction(filePathOption.parser);

        return optionHasNoParser
            ? defaultParser
            : filePathOption.parser;
    }

    function normalizePathOption(fileOption) {
        const optionPath = getFilePathFromOption(fileOption);

        return {
            path: path.join(process.cwd(), optionPath),
            parser: getConfigParser(fileOption)
        };
    }

    function normalizePathOptions(filePaths) {
        return filePaths.map(normalizePathOption);
    }

    return {
        normalizePathOptions
    };
}

module.exports = pathOptionNormalizer;