const toml = require('@ltd/j-toml');

module.exports = function(eleventyConfig) {
    eleventyConfig.setFrontMatterParsingOptions({
        bigint: false,
        engines: {
            toml: {
                parse: function(str, opts) {
                    const ret = toml.parse(str, opts);
                    return Object.assign({}, ret);
                },
                stringify: toml.stringify.bind(toml) 
            }
        },
    });

    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    };
};