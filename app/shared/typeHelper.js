function typeHelper () {
    
    function isTypeOf(typeString) {
        return function (value) {
            return typeof value === typeString;
        }
    }

    const isString = isTypeOf('string');
    const isFunction = isTypeOf('function');

    function isNull(value) {
        return value === null;
    }

    return {
        isFunction,
        isNull,
        isString,
        isTypeOf
    };
}

module.exports = typeHelper;