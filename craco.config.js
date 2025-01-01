module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.(mp3)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash].[ext]',
                },
              },
            ],
          },
        ],
      },
    },
  },
}; 