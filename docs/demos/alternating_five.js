// This code constructs an object alternating_five whose fields and methods
// encode information about the alternating group on five letters and its
// representation as a subgroup of SO(3).

var alternating_five = {};

alternating_five.init = function() {
 var x2 = [2,1,4,3,5];
 var y2 = [3,4,1,2,5];
 var z2 = [1,3,2,5,4];
 var x3 = [2,3,1,4,5];
 var x5 = [3,5,4,2,1];
 var y5 = [2,3,4,5,1];

 var id = [1,2,3,4,5];
 
 var o = function(u,v) {
  return [u[v[0]-1],u[v[1]-1],u[v[2]-1],u[v[3]-1],u[v[4]-1]];
 };
 
 var oo = function(...args) {
  var nargs = args.length;
  if (nargs == 0) { return(id); }
  if (nargs == 1) { return(args[0]); }
  if (nargs == 2) { return(o(args[0],args[1])); }
  var a = args.shift();
  return(o(a,oo(...args)));
 };
 
 var inv = function(g) {
  var gi = {};
  for (i = 1; i <= 5; i++) { gi[g[i-1]] = i; }
  return [gi[1],gi[2],gi[3],gi[4],gi[5]];
 };

 var eq = function(g,h) {
  return (g[0] == h[0] && g[1] == h[1] && g[2] == h[2] && g[3] == h[3] && g[4] == h[4]);
 }
 
 this.id  = id;
 this.o   = o;
 this.oo  = oo;
 this.inv = inv;
 this.eq  = eq;
 
 this.x2 = x2;
 this.y2 = y2;
 this.z2 = z2;
 this.x3 = x3;
 this.x5 = x5;
 this.y5 = y5;

 this.H = {};
 
 this.H[ 1] = [id];
 this.H[ 2] = [id,x2];
 this.H[ 3] = [id,x3,o(x3,x3)];
 this.H[ 4] = [id,x2,y2,o(x2,y2)];
 this.H[ 5] = [id,x5,o(x5,x5),oo(x5,x5,x5),oo(x5,x5,x5,x5)];

 this.H[ 6] = [];
 for (var h of this.H[3]) {
  this.H[ 6].push(h);
  this.H[ 6].push(o(z2,h));
 }

 this.H[10] = [];
 for (var h of this.H[5]) {
  for (var g of this.H[2]) {
   this.H[10].push(o(g,h));
  }
 }

 this.H[12] = [];
 for (var h of this.H[3]) {
  for (var g of this.H[4]) {
   this.H[12].push(o(g,h));
  }
 }

 this.H[60] = [];
 for (var h of this.H[5]) {
  for (var g of this.H[12]) {
   this.H[60].push(o(g,h));
  }
 }

 var E = this.H[60];
 this.elements = E;
 
 this.element_index = {};
 for (var i = 1; i <= 60; i++) {
  this.element_index[E[i-1]] = i; 
 }

 this.gens_rule = {
  'X2' : x2, 'Y2' : y2, 'Z2' : z2, 'X3' : x3, 'X5' : x5, 'Y5' : y5
 };

 this.words_a =[
  [],['X2'],['Y2'],['X2','Y2'],['X2','Z2','Y2','Z2','X2','Z2'],['Z2','Y2','Z2','X2','Z2'],
  ['Z2','Y2','Z2','X2','Z2','X2'],['Y2','Z2','Y2','Z2','X2','Z2'],['Y2','Z2','X2','Z2','Y2','Z2'],
  ['Z2','X2','Z2','Y2','Z2','Y2'],['Z2','X2','Z2','Y2','Z2'],['X2','Z2','X2','Z2','Y2','Z2'],
  ['X2','Y2','Z2','Y2'],['Y2','Z2','Y2'],['X2','Z2','Y2'],
  ['Z2','Y2'],['X2','Y2','Z2','Y2','Z2','X2','Y2'],['Y2','Z2','Y2','Z2','X2','Y2'],
  ['X2','Z2','Y2','Z2','X2','Y2'],['Z2','Y2','Z2','X2','Y2'],['X2','Y2','Z2','X2','Z2'],
  ['Y2','Z2','X2','Z2'],['X2','Z2','X2','Z2'],['Z2','X2','Z2'],['X2','Y2','Z2','X2','Z2','Y2'],
  ['Y2','Z2','X2','Z2','Y2'],['X2','Z2','X2','Z2','Y2'],['Z2','X2','Z2','Y2'],['X2','Y2','Z2'],
  ['Y2','Z2'],['X2','Z2'],['Z2'],['X2','Y2','Z2','Y2','Z2','X2'],['Y2','Z2','Y2','Z2','X2'],
  ['X2','Z2','Y2','Z2','X2'],['Z2','Y2','Z2','X2'],['Z2','Y2','Z2','Y2','Z2','X2','Z2'],
  ['X2','Z2','Y2','Z2','Y2','Z2','X2','Z2'],['Z2','X2','Z2','X2','Y2'],
  ['X2','Z2','X2','Z2','X2','Y2'],['Z2','X2'],['X2','Z2','X2'],['Y2','Z2','X2'],
  ['X2','Y2','Z2','X2'],['X2','Z2','Y2','Z2'],['Z2','Y2','Z2'],['X2','Y2','Z2','Y2','Z2'],
  ['Y2','Z2','Y2','Z2'],['Y2','Z2','X2','Y2'],['Z2','X2','Y2','Z2'],['Z2','X2','Y2'],
  ['X2','Z2','X2','Y2'],['Z2','Y2','Z2','Y2'],['X2','Z2','Y2','Z2','Y2'],
  ['Y2','Z2','Y2','Z2','Y2'],['X2','Y2','Z2','Y2','Z2','Y2'],['X2','Z2','X2','Z2','X2'],
  ['Z2','X2','Z2','X2'],['X2','Y2','Z2','X2','Z2','X2'],['Y2','Z2','X2','Z2','X2']
 ];

 this.words_b = [];
 var xx5 = [];
 for (var l = 0; l < 5; l++) {
  var xx3 = [];
  for (var k = 0; k < 3; k++) {
   var yy2 = [];
   for (var j = 0; j < 2; j++) {
    var xx2 = [];
    for (var i = 0; i < 2; i++) {
     this.words_b.push([].concat(xx2,yy2,xx3,xx5));
     xx2.push('X2');
    }
    yy2.push('Y2');
   }
   xx3.push('X3');
  }
  xx5.push('X5');
 }
 
 this.rels = [
  ['X2','X2'],['Y2','Y2'],['Z2','Z2'],['X3','X3','X3'],['X5','X5','X5','X5','X5'],
  ['Y5','Y5','Y5','Y5','Y5'],['X2','Y2','X2','Y2'],['X2','Y2','Z2','X2','Y2','Z2','X2','Y2','Z2'],
  ['Z2','X2','Z2','Y2','Z2','X2','Z2','Y2','Z2','X2','Z2','Y2'],
  ['X2','Z2','X2','Z2','X2','Z2','X2','Z2','X2','Z2'],
  ['Y2','Z2','Y2','Z2','Y2','Z2','Y2','Z2','Y2','Z2'],['X3','Y2','Z2','X2','Z2','Y2','Z2'],
  ['Y5','Y2','Z2','X2','Z2','X2'],['X5','Y2','X5','X5','X5','X3','X3']];

 this.element_order = {};

 for (var g of E) {
  var h = g;
  var i = 1;
  while (! eq(h,id)) { i++; h = o(g,h); }
  this.element_order[g] = i;
 }
  
 var t0 = (Math.sqrt(5.)+1)/2;
 var t1 = (Math.sqrt(5.)-1)/2;
 var s0 = Math.sqrt(2./(5. + Math.sqrt(5.)));
 var s1 = Math.sqrt(2./(5. - Math.sqrt(5.)));
 var r0 = 1/Math.sqrt(3.);
 var r1 = 1/Math.sqrt(2.);
 
 var idm = [[1,0,0],[0,1,0],[0,0,1]];
 var om = function(u,v) {
  return [
   [ u[0][0] * v[0][0] + u[0][1] * v[1][0] + u[0][2] * v[2][0],
     u[0][0] * v[0][1] + u[0][1] * v[1][1] + u[0][2] * v[2][1],
     u[0][0] * v[0][2] + u[0][1] * v[1][2] + u[0][2] * v[2][2] ],
   [ u[1][0] * v[0][0] + u[1][1] * v[1][0] + u[1][2] * v[2][0],
     u[1][0] * v[0][1] + u[1][1] * v[1][1] + u[1][2] * v[2][1],
     u[1][0] * v[0][2] + u[1][1] * v[1][2] + u[1][2] * v[2][2] ],
   [ u[2][0] * v[0][0] + u[2][1] * v[1][0] + u[2][2] * v[2][0],
     u[2][0] * v[0][1] + u[2][1] * v[1][1] + u[2][2] * v[2][1],
     u[2][0] * v[0][2] + u[2][1] * v[1][2] + u[2][2] * v[2][2] ]
  ];
 }

 var oom = function(...args) {
  var nargs = args.length;
  if (nargs == 0) { return(idm); }
  if (nargs == 1) { return(args[0]); }
  if (nargs == 2) { return(om(args[0],args[1])); }
  var a = args.shift();
  return(om(a,oom(...args)));
 };

 this.idm = idm;
 this.om  = om;
 this.oom = oom;
 
 this.matrix_gens_rule = {
  'X1' : [[ 1,0,0],[0, 1,0],[0,0, 1]],
  'X2' : [[ 1,0,0],[0,-1,0],[0,0,-1]],
  'Y2' : [[-1,0,0],[0,-1,0],[0,0, 1]],
  'Z2' : [[ t1/2,-t0/2, -1/2],[-t0/2, -1/2, t1/2],[ -1/2, t1/2,-t0/2]],
  'X3' : [[0,0,1],[1,0,0],[0,1,0]],
  'X5' : [[ t1/2,-t0/2,  1/2],[ t0/2,  1/2, t1/2],[ -1/2, t1/2, t0/2]],
  'Y5' : [[ t0/2,  1/2,-t1/2],[ -1/2, t1/2,-t0/2],[-t1/2, t0/2,  1/2]]
 };

 this.all_poles = [[0,0,0],
  //  1 -  6
  [1, 0, 0], [-1, 0, 0], [0, -1, 0], [0, 0, -1], [0, 0, 1], [0, 1, 0],
  //  7 - 14
  [ r0, r0, r0], [ r0, r0,-r0], [ r0,-r0, r0], [ r0,-r0,-r0],
  [-r0, r0, r0], [-r0, r0,-r0], [-r0,-r0, r0], [-r0,-r0,-r0],
  // 15 - 26
  [  0, s0, s1], [  0, s0,-s1], [  0,-s0, s1], [  0,-s0,-s1], 
  [ s1,  0, s0], [-s1,  0, s0], [ s1,  0,-s0], [-s1,  0,-s0],
  [ s0, s1,  0], [ s0,-s1,  0], [-s0, s1,  0], [-s0,-s1,  0],
  // 27 - 38		   
  [     0, r0*t0, r0*t1], [     0,-r0*t0, r0*t1], [     0, r0*t0,-r0*t1], [     0,-r0*t0,-r0*t1], 
  [ r0*t1,     0, r0*t0], [ r0*t1,     0,-r0*t0], [-r0*t1,     0, r0*t0], [-r0*t1,     0,-r0*t0],
  [ r0*t0, r0*t1,     0], [-r0*t0, r0*t1,     0], [ r0*t0,-r0*t1,     0], [-r0*t0,-r0*t1,     0], 
  // 39 - 62
  [  1/2, t1/2, t0/2], [  1/2, t1/2,-t0/2], [  1/2,-t1/2, t0/2], [  1/2,-t1/2,-t0/2], 
  [ -1/2, t1/2, t0/2], [ -1/2, t1/2,-t0/2], [ -1/2,-t1/2, t0/2], [ -1/2,-t1/2,-t0/2],
  [ t0/2,  1/2, t1/2], [-t0/2,  1/2, t1/2], [ t0/2,  1/2,-t1/2], [-t0/2,  1/2,-t1/2],
  [ t0/2, -1/2, t1/2], [-t0/2, -1/2, t1/2], [ t0/2, -1/2,-t1/2], [-t0/2, -1/2,-t1/2],
  [ t1/2, t0/2,  1/2], [ t1/2,-t0/2,  1/2], [-t1/2, t0/2,  1/2], [-t1/2,-t0/2,  1/2],
  [ t1/2, t0/2, -1/2], [ t1/2,-t0/2, -1/2], [-t1/2, t0/2, -1/2], [-t1/2,-t0/2, -1/2],
  // 63 - 74 (These are poles for S4, not for A5)		   
  [  0, r1, r1], [  0, r1,-r1], [  0,-r1, r1], [  0,-r1,-r1], 
  [ r1,  0, r1], [-r1,  0, r1], [ r1,  0,-r1], [-r1,  0,-r1],
  [ r1, r1,  0], [ r1,-r1,  0], [-r1, r1,  0], [-r1,-r1,  0]
 ];

 this.pole_neg =
  [ 0,
     2, 1, 6, 5, 4, 3,
    14,13,12,11,10, 9, 8, 7,
    18,17,16,15,22,21,20,19,26,25,24,23,
    30,29,28,27,34,33,32,31,38,37,36,35,
    46,45,44,43,42,41,40,39,54,53,52,51,50,49,48,47,62,61,60,59,58,57,56,55,
    66,65,64,63,70,69,68,67,74,73,72,71
  ];
 
 this.matrix         = {};
 this.axis_index     = {};
 this.axis_neg_index = {};
 this.axis           = {};
 this.angle          = {};

 for (i = 1; i <= 60; i++) {
  var g = E[i-1];
  var w = this.words_b[i-1];
  var wm = w.map(k => this.matrix_gens_rule[k]);
  var M = oom(...wm);
  this.matrix[g] = M;
  if (i == 1) {
   this.angle[g] = 0;
  } else {
   this.angle[g] = Math.acos((M[0][0] + M[1][1] + M[2][2] - 1)/2);
  }

  for (var j = 1; j < this.all_poles.length; j++) {
   var u0 = this.all_poles[j];
   if (vec.dd(vec.mmul(M,u0),u0) < 0.0001) {
    this.axis_index[g] = j;
    this.axis_neg_index[g] = this.pole_neg[j];
    this.axis[g] = u0;
    break;
   }
  }
 }  
}

alternating_five.init();
