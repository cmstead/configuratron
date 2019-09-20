function configReaderFactory(
    fs,
    path
) {

    function buildConfigReader(basePath) {
        function readConfig(filePath) {
            const readPath = path.join(basePath, filePath);

            try{
                return fs.readFileSync(readPath, { encoding: 'utf8' });
            } catch (e) {
                // console.log('An error occurred while reading config file: ', e.message);
                // console.log('Using default configuration.');

                return {};
            }
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