// ตัวดูภาพ 360 องศาด้วย WebGL ภาพเก็บเป็น data URI ในไฟล์ .js เพราะเบราว์เซอร์ห้ามอ่านภาพ file:// เข้า WebGL โดยตรง
export function install(root) {
  const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p;gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;varying vec2 v;uniform sampler2D t;uniform vec2 a;uniform float f;uniform float r;
  void main(){
    float k=tan(f*.5);
    vec3 d=normalize(vec3(v.x*k*r,v.y*k,-1.));
    float cp=cos(a.y),sp=sin(a.y);d=vec3(d.x,cp*d.y-sp*d.z,sp*d.y+cp*d.z);
    float cy=cos(a.x),sy=sin(a.x);d=vec3(cy*d.x-sy*d.z,d.y,sy*d.x+cy*d.z);
    float lon=atan(d.x,-d.z),lat=asin(clamp(d.y,-1.,1.));
    gl_FragColor=texture2D(t,vec2(lon/6.2831853+.5,.5-lat/3.1415927));
  }`;

  function loadData(name) {
    // เวอร์ชัน Next.js เสิร์ฟผ่าน http จึงโหลด .jpg ตรงได้ ไม่ต้องใช้ data URI
    return Promise.resolve(`/assets/pano/${name}.jpg`);
  }

  function createViewer(host, name, onStatus) {
    const canvas = document.createElement('canvas');
    canvas.className = 'pano-canvas';
    canvas.setAttribute('aria-label', 'ภาพ 360 องศา ลากเพื่อหมุนมุมมอง');
    canvas.tabIndex = 0;
    host.appendChild(canvas);
    const st = { yaw: 0, pitch: -0.05, fov: 1.45, vy: 0, vp: 0, auto: true, drag: false, dead: false };
    let gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false }) || canvas.getContext('experimental-webgl'); } catch (e) { gl = null; }
    if (!gl) { onStatus('nogl'); return fallback(host, name, onStatus, canvas); }

    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uA = gl.getUniformLocation(prog, 'a'), uF = gl.getUniformLocation(prog, 'f'), uR = gl.getUniformLocation(prog, 'r');
    let ready = false, raf = 0;

    loadData(name).then((src) => {
      const img = new Image();
      img.onload = () => {
        if (st.dead) return;
        const tx = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        ready = true;
        onStatus('ready');
      };
      img.onerror = () => onStatus('error');
      img.src = src;
    }).catch(() => onStatus('error'));

    function frame() {
      if (st.dead) return;
      raf = requestAnimationFrame(frame);
      const dpr = Math.min(root.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      if (!ready || !w || !h) return;
      if (!st.drag) {
        st.yaw += st.vy; st.pitch += st.vp; st.vy *= 0.93; st.vp *= 0.9;
        if (st.auto) st.yaw += 0.0012;
      }
      st.pitch = Math.max(-1.35, Math.min(1.35, st.pitch));
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uA, st.yaw, st.pitch);
      gl.uniform1f(uF, st.fov);
      gl.uniform1f(uR, w / h);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    frame();

    // การลาก หมุน ซูม
    const ptrs = new Map();
    let pinch = 0;
    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      st.drag = true; st.auto = false; st.vy = 0; st.vp = 0; pinch = 0;
    });
    canvas.addEventListener('pointermove', (e) => {
      const p = ptrs.get(e.pointerId);
      if (!p) return;
      if (ptrs.size === 1) {
        const k = st.fov / Math.max(1, canvas.clientHeight);
        const dx = (e.clientX - p.x) * k, dy = (e.clientY - p.y) * k;
        st.yaw -= dx; st.pitch += dy; st.vy = -dx * 0.6; st.vp = dy * 0.6;
      }
      p.x = e.clientX; p.y = e.clientY;
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) setFov(st.fov * (pinch / d));
        pinch = d;
      }
    });
    const up = (e) => { ptrs.delete(e.pointerId); if (!ptrs.size) st.drag = false; pinch = 0; };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    function setFov(v) { st.fov = Math.max(0.6, Math.min(1.9, v)); }
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); setFov(st.fov * (1 + Math.sign(e.deltaY) * 0.08)); st.auto = false; }, { passive: false });
    canvas.addEventListener('keydown', (e) => {
      const m = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, 0.1], ArrowDown: [0, -0.1] }[e.key];
      if (m) { e.preventDefault(); st.auto = false; st.yaw += m[0]; st.pitch += m[1]; }
    });

    return {
      state: st,
      zoom: (d) => setFov(st.fov + d),
      toggleAuto: () => { st.auto = !st.auto; return st.auto; },
      destroy() {
        st.dead = true; cancelAnimationFrame(raf);
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        canvas.remove();
      },
    };
  }

  // เครื่องที่ไม่มี WebGL: ใช้ภาพแบนเลื่อนซ้ายขวาแทน
  function fallback(host, name, onStatus, canvas) {
    canvas.remove();
    const d = document.createElement('div');
    d.className = 'pano-flat';
    d.style.backgroundImage = `url(/assets/pano/${name}.jpg)`;
    host.appendChild(d);
    let x = 0, last = null;
    d.addEventListener('pointerdown', (e) => { last = e.clientX; d.setPointerCapture(e.pointerId); });
    d.addEventListener('pointermove', (e) => { if (last === null) return; x += e.clientX - last; last = e.clientX; d.style.backgroundPositionX = x + 'px'; });
    d.addEventListener('pointerup', () => { last = null; });
    onStatus('ready');
    return { zoom() {}, toggleAuto() { return false; }, destroy() { d.remove(); }, state: {} };
  }

  root.PANO = { createViewer };
}
