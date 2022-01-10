const toml = require('@ltd/j-toml');

module.exports = function(eleventyConfig) {
    eleventyConfig.setFrontMatterParsingOptions({
        bigint: false,

        language: 'toml',
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

    eleventyConfig.addPassthroughCopy("src/static");

    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    };
};