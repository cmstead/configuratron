function configFileReader (
    fs,
    typeHelper
) {

    const { isNull } = typeHelper;

    function readConfigFileFromDisk(pathOption) {
        try {
            return fs.readFileSync(pathOption.path, { encoding: 'utf8' });
        } catch (e) {
            return {};
        }
    }

    function readConfigFile(pathOption) {
        return !isNull(pathOption)
            ? readConfigFileFromDisk(pathOption)
            : null;
    }


    function readConfigFileFromDisk(pathOption) {
        try {
            return fs.readFileSync(pathOption.path, { encoding: 'utf8' });
        } catch (e) {
            return {};
        }
    }

    function readConfigFile(pathOption) {
        return !isNull(pathOption)
            ? readConfigFileFromDisk(pathOption)
            : null;
    }

    return {
        readConfigFile
    };
}

module.exports = configFileReader;