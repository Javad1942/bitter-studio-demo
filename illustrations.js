'use strict';

// Original spot illustrations drawn in a common 240 × 150 coordinate system.
function drawIllustration(host, kind) {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 450;
  canvas.setAttribute('aria-hidden', 'true');
  host.replaceChildren(canvas);
  const g = canvas.getContext('2d');
  if (!g) return;
  g.scale(3, 3);
  g.strokeStyle = '#211c34';
  g.lineWidth = 2.6;
  g.lineCap = g.lineJoin = 'round';
  const white = '#fffdf7', blue = '#89d8ff', pink = '#ff95c8', green = '#beef8e', yellow = '#ffdb68', violet = '#b8a1ff';
  function shape(color) { g.fillStyle = color; g.fill(); g.stroke(); }
  function rect(x,y,w,h,r,color) { g.beginPath(); g.roundRect(x,y,w,h,r); shape(color); }
  function circle(x,y,r,color) { g.beginPath(); g.arc(x,y,r,0,Math.PI*2); shape(color); }
  function path(points, color) {
    g.beginPath(); g.moveTo(...points[0]);
    for (const point of points.slice(1)) g.lineTo(...point);
    if (color) { g.closePath(); shape(color); } else g.stroke();
  }
  function tilt(x,y,deg,draw) { g.save(); g.translate(x,y); g.rotate(deg*Math.PI/180); draw(); g.restore(); }
  function spark(x,y,r,color) {
    path([[x,y-r],[x+r*.22,y-r*.22],[x+r,y],[x+r*.22,y+r*.22],[x,y+r],[x-r*.22,y+r*.22],[x-r,y],[x-r*.22,y-r*.22]],color);
  }
  function browser() {
    rect(-57,-38,114,76,8,white); path([[-56,-23],[56,-23]]);
    for (let i=0;i<3;i++) circle(-47+i*8,-30,1.3,'#262238');
    rect(-46,-12,35,38,4,blue); rect(-3,-12,46,12,3,pink);
    path([[-2,10],[35,10]]); path([[-2,18],[23,18]]);
  }
  function photo(color) {
    rect(-34,-35,68,70,7,white); rect(-27,-27,54,50,3,color);
    circle(12,-15,5,yellow); path([[-25,16],[-10,-7],[0,6],[9,-2],[25,17]],violet);
  }
  switch(kind) {
    case 'lock':
      tilt(109,71,-4,browser);
      tilt(153,89,6,()=>{
        g.beginPath();g.arc(0,-7,13,Math.PI,2*Math.PI);g.stroke();
        rect(-20,-7,40,33,5,pink);circle(0,6,3,yellow);path([[0,9],[0,14]]);
      });break;
    case 'calendar':
      tilt(112,73,-5,()=>{
        rect(-49,-36,98,73,7,white);rect(-49,-36,98,18,5,pink);
        for(let col=0;col<4;col++)rect(-37+col*20,-5,12,12,3,[blue,violet,yellow,green][col]);
        path([[-37,21],[7,21]]);path([[-29,-44],[-29,-28]]);path([[30,-44],[30,-28]]);
      });
      tilt(165,94,8,()=>{circle(0,0,16,green);path([[-8,1],[-2,7],[9,-6]])});break;
    case 'film':
      tilt(115,70,-5,()=>{
        rect(-54,-35,108,68,7,white);rect(-48,-28,96,47,3,pink);
        path([[-8,-19],[14,-5],[-8,9]],yellow);path([[-41,26],[35,26]]);
        circle(-4,26,4,blue);
      });break;
    case 'window':
      tilt(111,77,-7,browser);
      tilt(155,96,-9,()=>path([[-9,-13],[14,3],[4,6],[9,17],[2,20],[-3,8],[-10,15]],yellow));
      break;
    case 'devices':
      tilt(103,70,4,browser);
      tilt(163,85,-7,()=>{rect(-18,-35,36,70,7,white);rect(-13,-26,26,44,3,green);circle(0,26,2,pink)});
      break;
    case 'swatches':
      [violet,green,white].forEach((c,i)=>tilt(117+i*9,82,14-i*17,()=>{rect(-28,-44,58,87,7,c);rect(-20,-35,42,39,4,[pink,blue,yellow][i]);path([[-14,15],[14,15]]);circle(-12,29,3,white)}));
      break;
    case 'photos':
      tilt(95,79,-12,()=>photo(pink));tilt(141,70,9,()=>photo(blue));break;
    case 'shop':
      tilt(104,75,-7,()=>{rect(-43,-29,88,65,5,white);rect(-32,1,27,32,2,blue);rect(4,-2,29,18,3,pink);
        for(let i=0;i<5;i++){path([[-48+i*19,-37],[-29+i*19,-37],[-23+i*19,-15],[-44+i*19,-15]],i%2?white:violet)}});
      tilt(161,98,9,()=>{rect(-21,-15,42,36,4,yellow);g.beginPath();g.arc(0,-12,9,Math.PI,2*Math.PI);g.stroke()});break;
    case 'server':
      tilt(117,75,-5,()=>{for(let i=0;i<3;i++){rect(-50,-36+27*i,100,21,6,white);circle(-38,-25+27*i,4,[green,pink,blue][i]);path([[-26,-25+i*27],[17,-25+i*27]])}});
      tilt(163,91,8,()=>{path([[0,-19],[18,-12],[16,7],[0,22],[-16,7],[-18,-12]],yellow);path([[-8,0],[-2,6],[9,-6]])});break;
    case 'box':
      tilt(117,87,-4,()=>{rect(-44,-8,88,40,4,blue);path([[-43,-8],[-57,-24],[-12,-26],[0,-8]],green);path([[0,-8],[15,-28],[57,-26],[43,-8]],pink);path([[0,-8],[0,31]])});
      tilt(114,51,-9,()=>{rect(-27,-20,54,38,4,white);rect(-19,-12,21,16,2,violet);path([[8,-5],[18,-5]])});break;
    case 'tag':
      tilt(116,73,-13,()=>{path([[-52,0],[-28,-27],[48,-27],[48,28],[-28,28]],white);circle(-29,0,4,pink);rect(-10,-12,42,8,3,green);path([[-10,9],[22,9]])});
      tilt(159,100,2,()=>{for(let i=0;i<3;i++)rect(-16,-i*5,32,7,4,yellow)});break;
    case 'launch':
      tilt(118,75,24,()=>{path([[-14,16],[-22,32],[-9,28],[0,45],[8,28],[19,32],[13,15]],yellow);path([[-18,-8],[-34,16],[-12,13]],pink);path([[18,-8],[34,16],[12,13]],pink);
        g.beginPath();g.moveTo(0,-49);g.bezierCurveTo(19,-34,24,-7,14,16);g.lineTo(-14,16);g.bezierCurveTo(-24,-7,-19,-34,0,-49);shape(white);circle(0,-16,9,blue)});break;
  }
  g.lineWidth=1.4; spark(45,48,6,violet);spark(188,47,8,yellow);spark(61,112,4,pink);
}
document.querySelectorAll('[data-art]').forEach(host => drawIllustration(host, host.dataset.art));
