import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#2196F3", // Синий (как у Material Design)
          secondary: "#FF9800",
          error: "#FF5252",
        },
      },
      dark: {
        colors: {
          primary: "#90CAF9", // Светло-синий для темной темы
        },
      },
    },
  },
});
