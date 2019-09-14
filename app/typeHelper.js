function typeHelper () {
    
    function isTypeOf(typeString) {
        return function (value) {
            return typeof value === typeString;
        }
    }

    const isString = isTypeOf('string');
    const isFunction = isTypeOf('function');

    return {
        isFunction,
        isString,
        isTypeOf
    };
}

module.exports = typeHelper;