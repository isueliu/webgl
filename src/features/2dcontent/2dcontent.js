import { Application, Program } from '../../lib/index.js';
import * as shader from './shader.js';

const initialClear = (glModel) => {
  glModel.gl.clearColor(0,0,0,1);
  glModel.gl.clear(glModel.gl.COLOR_BUFFER_BIT);
};

class Content2d extends Program {
  initialBuffers() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0
    ]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.positionBuffer = positionBuffer;
  }
}

const main = async () => {
  const app = await new Application().initial('#webgl');
  app.prepare();
  const content1 = new Content2d(shader.vertexShader, shader.fragmentShader, [0, 0, -10]);
  const content2 = new Content2d(shader.vertexShader, shader.fragmentShader, [2, 2, -10]);
  console.log(content1, content2);
  app.addProgram(content1, content2);
  app.play();
};

main();

export {
  main,
}
