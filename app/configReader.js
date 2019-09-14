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
        const optionHasNoParser = typeof filePathOption === 'string'
            || typeof filePathOption.parser !== 'function';

        return optionHasNoParser
            ? defaultParser
            : filePathOption.parser;
    }

    function getConfigurationString(filePaths) {
        let configurationString = null;
        let filePathsCopy = filePaths.slice(0);
        let currentFilePathOption;

        while (configurationString === null && filePathsCopy.length > 0) {
            currentFilePathOption = filePathsCopy.shift();
            const currentFilePath = getFilePathFromOption(currentFilePathOption);

            configurationString = readFileOrNull(currentFilePath);
        }

        const parse = getConfigParser(currentFilePathOption);

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