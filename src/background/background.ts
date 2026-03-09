import { createMainWindows } from './utils/createWindows';

class Background {
  init = async () => {
    await createMainWindows();
  };
}

await new Background().init();
