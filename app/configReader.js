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

    function getConfigurationString(filePaths) {
        let configurationString = null;
        let filePathsCopy = filePaths.slice(0);

        while (configurationString === null && filePathsCopy.length > 0) {
            const currentFilePathOption = filePathsCopy.shift();
            const currentFilePath = getFilePathFromOption(currentFilePathOption);

            configurationString = readFileOrNull(currentFilePath);
        }

        return configurationString;
    }

    function read(filePaths) {
        let configurationString = getConfigurationString(filePaths);

        if (configurationString === null) {
            throw new Error('Unable to locate configuration file');
        } else {
            return JSON.parse(configurationString);
        }
    }

    return {
        read
    };
}

module.exports = configReader;