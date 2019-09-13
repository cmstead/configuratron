function configReader(fs) {

    function readFileOrNull(filePath) {
        try {
            return fs.readFileSync(filePath, { encoding: 'utf8' });
        } catch (e) {
            return null;
        }
    }

    function getConfigurationString(filePaths) {
        let configurationString = null;
        let filePathsCopy = filePaths.slice(0);

        while (configurationString === null && filePathsCopy.length > 0) {
            const currentFilePath = filePathsCopy.shift();

            configurationString = readFileOrNull(currentFilePath);
        }

        return configurationString;
    }

    function read(filePaths) {
        let configurationString = getConfigurationString(filePaths);

        return JSON.parse(configurationString);
    }

    return {
        read
    };
}

module.exports = configReader;