function configReaderFactory(
    fs,
    path
) {

    function buildConfigReader(basePath) {
        function readConfig(filePath) {
            const readPath = path.join(basePath, filePath);

            return fs.readFileSync(readPath, { encoding: 'utf8' });
        }

        return {
            readConfig
        };
    }

    return {
        buildConfigReader
    };
}

module.exports = configReaderFactory;