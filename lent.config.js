const { defineLentConfig } = require('lent');
const { lentLeetCodePlugin } = require('lentleetcodeplugin')

module.exports = defineLentConfig({
    root: './src',
    plugin(i) {
        lentLeetCodePlugin(i);
    }
});
