function configReader(fs) {

    function readFileOrNull(filePath) {
        try {
            return fs.readFileSync(filePath, { encoding: 'utf8' });
        } catch (e) {
            return null;
        }
    }

    function getFilePathFromOption(currentFilePathOption) {
        return typeof currentFilePathOption === 'string'
            ? currentFilePathOption
            : currentFilePathOption.path;
    }

    function defaultParser(configString) {
        return JSON.parse(configString);
    }

    function getConfigParser(filePathOption) {
        return typeof filePathOption === 'string'
            || typeof filePathOption.parser !== 'function'
            ? defaultParser
            : filePathOption.parser;
    }

    function getConfigurationString(filePaths) {
        let configurationString = null;
        let filePathsCopy = filePaths.slice(0);
        let parse = defaultParser;

        while (configurationString === null && filePathsCopy.length > 0) {
            const currentFilePathOption = filePathsCopy.shift();
            const currentFilePath = getFilePathFromOption(currentFilePathOption);
            parse = getConfigParser(currentFilePathOption);

            configurationString = readFileOrNull(currentFilePath);
        }

        return typeof configurationString === 'string'
            ? parse(configurationString)
            : null;
    }

    function read(filePaths) {
        let configurationData = getConfigurationString(filePaths);

        if (configurationData === null) {
            throw new Error('Unable to locate configuration file');
        } else {
            return configurationData;
        }
    }

    return {
        read
    };
}

module.exports = configReader;