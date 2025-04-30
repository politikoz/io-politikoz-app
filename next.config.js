const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@meshsdk/core",
    "@meshsdk/core-cst",
    "@meshsdk/react"
  ],

  // Configuração de imagens com remotePatterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/avatars/**", // Ajusta o caminho de acordo com o uso de imagens
      },
    ],
  },

  reactStrictMode: true,

  webpack: function (config, { isServer }) {
    // Adiciona suporte a experimentos do Webpack
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    // Ignora avisos específicos do WebAssembly
    config.ignoreWarnings = [
      (warning) =>
        warning.message.includes(
          "The generated code contains 'async/await' because this module is using 'asyncWebAssembly'"
        ) &&
        warning.module?.resource?.includes("sidan_csl_rs_bg.wasm"),
    ];

    // Desativa o carregamento de WebAssembly no lado do servidor
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@sidan-lab/sidan-csl-rs-browser");
    }

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
