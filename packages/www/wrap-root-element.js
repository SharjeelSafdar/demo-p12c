const React = require("react");
const { ThemeProvider } = require("theme-ui");
const { deep } = require("@theme-ui/presets");

const { Provider } = require("./identity-context");

const theme = {
  ...deep,
  sizes: { container: 1024 },
};

const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <Provider>{element}</Provider>
  </ThemeProvider>
);

module.exports = wrapRootElement;
