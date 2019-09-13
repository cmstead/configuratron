function configReader (fs) {
    
    function read(filePaths) {
        const configurationString = fs.readFileSync(filePaths[0], { encoding: 'utf8' });

        return JSON.parse(configurationString);
    }

    return {
        read
    };
}

module.exports = configReader;