const React = require("react");
const { ThemeProvider } = require("theme-ui");
const { deep } = require("@theme-ui/presets");

const theme = {
  ...deep,
  sizes: { container: 1024 },
};

const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>{element}</ThemeProvider>
);

module.exports = wrapRootElement;
