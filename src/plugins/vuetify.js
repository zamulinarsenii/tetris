import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#2196F3",
          secondary: "#FF9800",
          error: "#FF5252",
        },
      },
      dark: {
        colors: {
          primary: "#90CAF9",
        },
      },
    },
  },
});
