
class WebglError extends Error {
  constructor(name, query, message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = name;
    this.desc = `the query is: ${query}. result is:${message}`;
  }
}

const initialWebgl = async (query, el) => {
  const canvas = (el || document).querySelector(query);
  if (!canvas) throw new WebglError('canvasLoss', query, 'no found');
  let gl = canvas.getContext('webgl2');
  if (!gl) {
    gl = canvas.getContext('webgl');
  }
  if (!gl) {
    throw new WebglError('notSupport', 'webgl', 'not support webgl');
  }
  return {
    gl
  };
};
const loadShader = async (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new WebglError('shaderError', `${type}`, source);
    return null;
  }
  return shader;
};
const initialShaderProgram = async (model, vsource, fsource) => {
  if (!model.gl) throw new WebglError('webglLoss', 'model.gl', 'no found');
  const { gl } = model;
  const ret = { ...model };
  if(!ret.program) {
    ret.program = gl.createProgram();
  };
  const [vshader, fshader] = await Promise.all([loadShader(gl, gl.VERTEX_SHADER, vsource), loadShader(gl, gl.FRAGMENT_SHADER, fsource)]);
  gl.attachShader(ret.program, vshader);
  gl.attachShader(ret.program, fshader);
  gl.linkProgram(ret.program);
  return ret;
};

export {
  initialWebgl,
  initialShaderProgram
}

