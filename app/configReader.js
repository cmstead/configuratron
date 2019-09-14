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

    function parseConfiguration(pathOption, configurationString) {
        const parse = pathOption.parser;

        return typeof configurationString === 'string'
            ? parse(configurationString)
            : null;
    }

    function normalizeFileOption(fileOption) {
        return {
            path: getFilePathFromOption(fileOption),
            parser: getConfigParser(fileOption)
        };
    }

    function getConfigurationString(filePaths) {
        let normalizedPathOptions = filePaths.map(normalizeFileOption);
        let lastPathOption;

        while (normalizedPathOptions.length > 0) {
            lastPathOption = normalizedPathOptions.shift();

            if (fs.existsSync(lastPathOption.path)) {
                break;
            }
        }

        const configurationString = readFileOrNull(lastPathOption.path);

        return parseConfiguration(lastPathOption, configurationString);
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