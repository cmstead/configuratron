function configWriter(
    fs,
    process
) {

    function writeConfig(filePath, fileContent) {
        fs.writeFileSync(filePath, fileContent);
    }

    return {
        writeConfig
    };
}

module.exports = configWriter;