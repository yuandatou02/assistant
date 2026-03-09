import { createMainWindows } from "./utils/createWindows";
import { configInit } from "@/background/utils/config.ts";

class Background {
  init = async () => {
    await createMainWindows();
    configInit();
  };
}

await new Background().init();
