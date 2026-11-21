(() => {
  const canvas = document.getElementById('bitter-object');
  const wrap = document.getElementById('object-wrap');
  if (!canvas || !wrap) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return;
  const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 rotation;
    uniform vec3 color;
    mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
    float box(vec3 p, vec3 b, float r){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
    float model(vec3 p){
      p.xz=rot(rotation.x)*p.xz; p.yz=rot(rotation.y)*p.yz;
      float body=box(p,vec3(.68,.68,.19),.27);
      float bite=length(p-vec3(.70,.70,.30))-.46;
      return max(body,-bite);
    }
    vec3 normalAt(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(model(p+e.xyy)-model(p-e.xyy),model(p+e.yxy)-model(p-e.yxy),model(p+e.yyx)-model(p-e.yyx)));}
    void main(){
      vec2 uv=(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
      vec3 ro=vec3(0.,0.,4.5), rd=normalize(vec3(uv*1.38,-1.8));
      float t=0.;float d=0.;bool hit=false;
      for(int i=0;i<90;i++){vec3 p=ro+rd*t;d=model(p);if(d<.0015){hit=true;break;}t+=d*.8;if(t>8.)break;}
      if(!hit){gl_FragColor=vec4(0.);return;}
      vec3 p=ro+rd*t;vec3 n=normalAt(p);vec3 light=normalize(vec3(-.65,1.,1.6));vec3 light2=normalize(vec3(.9,-.3,.8));
      float diffuse=max(dot(n,light),0.);float fill=max(dot(n,light2),0.);
      vec3 h=normalize(light-rd);float spec=pow(max(dot(n,h),0.),32.);float rim=pow(1.-max(dot(n,-rd),0.),2.);
      vec3 col=color*(.35+.65*diffuse+.19*fill)+vec3(1.,.88,.98)*spec*.42+vec3(.62,.42,.58)*rim*.22;
      gl_FragColor=vec4(col,1.);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return;
  const program = gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,'resolution'), rotation=gl.getUniformLocation(program,'rotation'), color=gl.getUniformLocation(program,'color');
  const colors=[[.51,.27,.42],[.71,.42,.31],[.47,.59,.38]];
  let selected=0, rx=-.45, ry=.24, targetX=rx, targetY=ry, dragging=false, lastX=0, lastY=0, visible=true, frame=0, raf=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  function size(){const rect=canvas.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,1.5);const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
  function draw(){size();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(res,canvas.width,canvas.height);gl.uniform2f(rotation,rx,ry);gl.uniform3fv(color,colors[selected]);gl.drawArrays(gl.TRIANGLES,0,6)}
  function tick(){raf=0;if(!visible||document.hidden)return; if(!reduce.matches){if(!dragging) targetX+=.0025;rx+=(targetX-rx)*.065;ry+=(targetY-ry)*.065;frame++;draw();raf=requestAnimationFrame(tick)}else draw()}
  function start(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(dragging){targetX+=(e.clientX-lastX)*.012;targetY=Math.max(-.9,Math.min(.9,targetY+(e.clientY-lastY)*.012));lastX=e.clientX;lastY=e.clientY;if(reduce.matches){rx=targetX;ry=targetY;draw()}} else if(e.pointerType==='mouse'&&!reduce.matches){const r=canvas.getBoundingClientRect();targetY=((e.clientY-r.top)/r.height-.5)*.45;} });
  function release(){dragging=false}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  document.querySelectorAll('.color-choice').forEach(button=>button.addEventListener('click',()=>{selected=Number(button.dataset.color);document.querySelectorAll('.color-choice').forEach(b=>{let active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});draw()}));
  window.addEventListener('resize',draw);document.addEventListener('visibilitychange',()=>{if(!document.hidden)start()});reduce.addEventListener?.('change',()=>{if(reduce.matches){if(raf)cancelAnimationFrame(raf);raf=0;draw()}else start()});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0}},{threshold:.05}).observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(raf)cancelAnimationFrame(raf);wrap.classList.remove('webgl-ready')});
  wrap.classList.add('webgl-ready');draw();start();
})();

