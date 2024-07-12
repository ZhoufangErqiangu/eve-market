export interface TimerParam {
  interval?: number;
  cb?: (time: number) => void;
  autoStart?: boolean;
}

/**
 * Timer
 *
 * every interval, callback will be called
 */
export class Timer {
  public readonly interval: number;
  public callback?: (time: number) => void;
  private hasRequestAnimationFrame = false;
  private isStop = true;

  constructor(param: TimerParam = {}) {
    const { interval = 1000, cb, autoStart = true } = param;
    this.interval = interval;
    if (cb) this.callback = cb;
    if (autoStart) this.start();
  }

  protected run(time = 0) {
    if (this.isStop) return;
    if (!this.hasRequestAnimationFrame) {
      this.hasRequestAnimationFrame = true;
      setTimeout(() => {
        this.hasRequestAnimationFrame = false;
      }, this.interval);
      this.callback?.(time);
    }
    requestAnimationFrame((time) => {
      this.run(time);
    });
  }

  /**
   * start timer
   */
  public start() {
    if (!this.isStop) return;
    this.isStop = false;
    this.run(0);
  }

  /**
   * stop timer
   */
  public stop() {
    this.isStop = true;
  }
}
