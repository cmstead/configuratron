function configSerializerFactory () {
    
    const defaultSerializer = value => value;

    function buildConfigurationSerializer(serialize = defaultSerializer) {

        function serializeConfiguration(configuration) {
            return serialize(configuration);
        }

        return {
            serializeConfiguration
        };
    }

    return {
        buildConfigSerializer: buildConfigurationSerializer
    };
}

module.exports = configSerializerFactory;