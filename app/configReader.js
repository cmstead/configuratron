function configReader(fs) {

    function getConfigurationString(filePaths) {
        let configurationString = null;
        let filePathsCopy = filePaths.slice(0);

        while (configurationString === null && filePathsCopy.length > 0) {
            const filePath = filePathsCopy.shift();

            try {
                configurationString = fs.readFileSync(filePath, { encoding: 'utf8' });
            } catch (e) {
                // continue
            }
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