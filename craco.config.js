const { getLoader } = require('@craco/craco')

module.exports = {
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ context, webpackConfig }) => {
                    const { isFound, match } = getLoader(webpackConfig, rule => rule.type === 'asset/resource')
                    if (!isFound) throw { message: `Can't find file-loader in the ${context.env} webpack config!` }
                    match.loader.exclude.push(/\.ya?ml$/)

                    webpackConfig.module.rules.push({
                        use: 'yaml-loader',
                        test: /\.(ya?ml)$/,
                    })
                    return webpackConfig
                },
            }
        },
    ],
}