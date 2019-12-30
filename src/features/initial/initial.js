
import * as initial from '../../lib/initial.js';
import * as shaders from './shader.js';

const main =async () => {
  const webgl = await initial.initialWebgl('#webgl');
  console.log('webgl', webgl);
  const { gl } = webgl;
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

main();
export {
  main
}
