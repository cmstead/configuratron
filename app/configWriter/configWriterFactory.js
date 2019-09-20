function configWriterFactory(
    fs,
    path,
    process
) {

    function buildConfigWriter(basePath) {
        const defaultSerializer = (content) => content;

        function writeConfig(filePath, fileContent, serialize = defaultSerializer) {
            const writePath = path.join(basePath, filePath);
            fs.writeFileSync(writePath, serialize(fileContent));
        }
    
        return {
            writeConfig
        };    
    }

    return {
        buildConfigWriter
    };

}

module.exports = configWriterFactory;