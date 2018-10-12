import { configure } from "@storybook/react";

function loadStories() {
  require("../src/pages/dev-shopping-page/stories.tsx");
  // You can require as many stories as you need.
}

configure(loadStories, module);
