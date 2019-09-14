function configLocator (
    fs,
    typeHelper
) {
    
    const { isNull } = typeHelper;

    function doesFileExist(pathOption) {
        return fs.existsSync(pathOption.path);
    }

    function getLastPathOption(lastPathOption, pathOption) {
        return isNull(lastPathOption) && doesFileExist(pathOption)
            ? pathOption
            : lastPathOption;
    }

    function locatePathOption(pathOptions) {
        let lastPathOption = null;

        pathOptions.forEach(function (pathOption) {
            lastPathOption = getLastPathOption(lastPathOption, pathOption);
        });

        return lastPathOption;
    }

    return {
        locatePathOption
    };
}

module.exports = configLocator;