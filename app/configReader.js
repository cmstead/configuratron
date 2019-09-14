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

    function parseConfiguration(currentFilePathOption, configurationString) {
        const parse = getConfigParser(currentFilePathOption);

        return typeof configurationString === 'string'
            ? parse(configurationString)
            : null;
    }

    function statFile(filePath) {
        try{
            return fs.lstat(filePath).isFile()
        } catch(e) {
            return false;
        }
    }

    function getConfigurationString(filePaths) {
        let filePathsCopy = filePaths.slice(0);
        let currentFilePathOption;
        let currentFilePath;

        while (filePathsCopy.length > 0) {
            currentFilePathOption = filePathsCopy.shift();
            currentFilePath = getFilePathFromOption(currentFilePathOption);
            
            
            if(fs.existsSync(currentFilePath)) {
                break;
            }
        }
        
        const configurationString = readFileOrNull(currentFilePath);

        return parseConfiguration(currentFilePathOption, configurationString);
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