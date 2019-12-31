import * as initial from './initial.js';
import '/node_modules/gl-matrix/gl-matrix.js';
import { Application } from './application.js';
const mat4 = self.glMatrix.mat4;

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new initial.WebglError('shaderError', `${type}`, source);
    return null;
  }
  return shader;
};

export class Program {
  constructor(vertexShader, fragmentShader, trans=[0, 0, -6]) {
    this.source = {
      vertexShader, fragmentShader
    };
    this.started = false;
    this.translate = trans;
    this.data={};
    this.dataIndex = 1;
  }
  addToApplication(gl) {
    this.gl = gl;
    return this;
  }
  addVertex(vertex, step, stride=0) {
    const vertexData = {
      vertex,
      step,
      sort: this.dataIndx,
      stride,
      size:vertex.length,
    };
    this.data[this.dataIndex++] = vertexData;
    this.refineData();
    return vertexData;
  }
  refineData () {
    this.dataArray = Object.values(this.data).sort((a, b) => {
      return a.sort - b.sort;
    });
    return this.dataArray;
  }
  removeVertex(index) {
    delete(this.data[index]);
    this.refineData();
  }
  async loadShader(type, source) {
    return loadShader(this.gl, type, source);
  }
  async start() {
    if(!this.started) {
      if (!this.gl) throw new initial.WebglError('webglLoss', 'model.gl', 'no found');
      this.started = true;
      const { gl } = this;
      if (!this.program) {
        this.program = gl.createProgram();
      }
      const loadVertex = this.loadShader(gl.VERTEX_SHADER, this.source.vertexShader);
      const loadFragment = this.loadShader(gl.FRAGMENT_SHADER, this.source.fragmentShader);
      const [vshader, fshader] = await Promise.all([loadVertex, loadFragment]);
      gl.attachShader(this.program, vshader);
      gl.attachShader(this.program, fshader);
      gl.linkProgram(this.program);
      this.vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPosition');
      this.modelViewMatrix = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
      this.projectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
      gl.clearColor(0, 0, 0, 1);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    return this;
  }
  play() {
    this.render();
  }
  render() {
    this.gl.useProgram(this.program);
    this.drawScene();
  }
  drawScene() {
    const gl = this.gl;
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, this.translate);
    const type = gl.FLOAT;
    const normalize = false;
    let offset = 0;
    this.dataArray.forEach(ele => {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(this.vertexPosition, ele.step, type, normalize, ele.stride, offset);
      gl.enableVertexAttribArray(this.vertexPosition);
      offset += ele.size;
    });
    gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(this.modelViewMatrix, false, modelViewMatrix);
    const drawOffset = 0;
    const drawVertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, drawOffset, drawVertexCount);
  }  
}
