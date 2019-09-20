function configWriterFactory(
    fs,
    path,
    process
) {

    function buildConfigWriter(basePath) {
        function writeConfig(filePath, fileContent) {
            const writePath = path.join(basePath, filePath);
            fs.writeFileSync(writePath, fileContent);
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