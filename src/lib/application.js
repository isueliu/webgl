import * as initial from './initial.js';

export class Application {
  constructor(gl) {
    this.gl = gl;
    this.programList = [];
  }
  async initial(query, el) {
    const glModel = await initial.initialWebgl(query, el);
    this.gl = glModel.gl;
    return this;
  }
  prepare() {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
  addProgram(...programs) {
    programs.forEach(ele => {
      ele.addToApplication(this.gl);
      this.programList.push(ele);
    });
  }
  async start() {
    const started = await Promise.all(this.programList.map(ele => {
      return ele.start();
    }));
    return started;
  }
  async stop() {
  }
  render() {
    const rendered = this.programList.map(ele => {
      return ele.render();
    });
    return rendered;
  }
  async play() {
    const started = await this.start();
    const played = await Promise.all(this.programList.map(ele => {
      return ele.play();
    }));
    return played;
  }
}
