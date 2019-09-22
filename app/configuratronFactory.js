function configuratronFactory(
    configLocator,
    configParserFactory,
    configReaderFactory,
    configSerializerFactory,
    configSettingsService,
    configWriterFactory
) {

    const defaultSerializer = value => JSON.stringify(value, null, 4);
    const defaultParser = (value) => JSON.parse(value);

    function buildConfiguratron({
        basePath = process.cwd(),
        filePath,
        serializer = defaultSerializer,
        parser = defaultParser,
        defaultConfig = {}
    }) {

        const configReader = configReaderFactory.buildConfigReader(basePath);
        const configParser = configParserFactory.buildConfigParser(parser);
        const configWriter = configWriterFactory.buildConfigWriter(basePath);
        const configSerializer = configSerializerFactory.buildConfigSerializer(serializer);

        let currentConfig = null;

        function readConfig() {
            const configString = configReader.readConfig(filePath);
            const parsedConfig = configParser.parseConfiguration(configString);

            return configSettingsService
                .mergeConfigSettings(parsedConfig, defaultConfig);
        }

        function getConfig() {
            if (currentConfig === null) {
                currentConfig = readConfig();
            }

            return currentConfig;
        }

        function setConfig(config) {
            currentConfig = config;
        }

        function writeConfig() {
            const serializedConfig = configSerializer
                .serializeConfiguration(currentConfig);

            configWriter.writeConfig(filePath, serializedConfig);
        }

        return {
            getConfig,
            setConfig,

            readConfig,
            writeConfig
        };

    }

    return {
        findReadPath: configLocator.findReadPath,
        buildConfiguratron: buildConfiguratron
    };

}

module.exports = configuratronFactory;