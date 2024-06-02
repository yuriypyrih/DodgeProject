module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 120,
    overrides: [
        {
            files: ['*/.css', '*/.scss'],
            options: {
                singleQuote: false,
            },
        },
    ],
};