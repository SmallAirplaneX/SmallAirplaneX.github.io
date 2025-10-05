declare module "dplayer" {
  interface DPlayerOptions {
    container: HTMLElement;
    video: {
      url: string;
      type?: string;
      customType?: Record<string, (video: any, player: any) => void>;
    };
    autoplay?: boolean;
    theme?: string;
    loop?: boolean;
    lang?: string;
    screenshot?: boolean;
    hotkey?: boolean;
    preload?: string;
    volume?: number;
    mutex?: boolean;
    contextmenu?: Array<{
      text: string;
      link: string;
    }>;
  }

  interface DPlayerEvents {
    loadstart: () => void;
    canplay: () => void;
    error: (error: any) => void;
    loadeddata: () => void;
  }

  class DPlayer {
    constructor(options: DPlayerOptions);
    destroy(): void;
    on<T extends keyof DPlayerEvents>(
      event: T,
      callback: DPlayerEvents[T]
    ): void;
    off<T extends keyof DPlayerEvents>(
      event: T,
      callback: DPlayerEvents[T]
    ): void;
  }

  export default DPlayer;
}
