var plato = {};

plato.owl3 = null;

plato.pole_colours = {
 2 : [0,1,0],
 3 : [1,0,0],
 4 : [1,0,1],
 5 : [0,0,1]
};

plato.solid = {};

plato.solid.find_vertex_index = function(u) {
 var d_min = 0.001;
 var i_min = 0;
 var i,d;

 for (i = 1; i <= this.num_vertices; i++) {
  d = vec.dd(this.embedding[i],u);
  if (d < d_min) {
   d_min = d;
   i_min = i;
  }
 }

 return(i_min);
}

plato.solid.plot = function(o,opts) {
 opts = opts || {};
 var scale = opts.scale || 1;
 var n = this.num_facets;
 var cols = {};
 if (opts.cols) {
  cols = opts.cols;
 } else {
  for (var i = 0; i < n; i++) {
   cols[i] = opts.col || owl.standard_colour(i);
  }
 }

 this.facet_cols = cols;
 
 this.facet_plots = [];
 for (var i = 0; i < n; i++) {
  var f = this.oriented_facets[i];
  var m = f.length;
  var g = new BABYLON.VertexData();
  g.positions = owl.flat(f.map(i => vec.smul(scale,this.embedding[i])));
  var jj = [];
  for (j = 1; j < m - 1; j++) {
   jj.push([0,j,j+1])
  }
  g.indices = owl.flat(jj);
  var mesh = new BABYLON.Mesh(null,o.scene);
  g.applyToMesh(mesh);
  o.set_colour(mesh,cols[i]);
  this.facet_plots.push(mesh);
 }
}

plato.solid.grey_plot = function(o,opts) {
 opts = {} || opts;
 opts.col = [0.7,0.7,0.7];
 this.plot(o,opts);
}

plato.solid.wireframe_plot = function(o,opts) {
 opts = opts || {};
 var scale = opts.scale || 1;
 var col = opts.col || [0.7,0.7,0.7];

 this.short_edge_plots = [];

 for (var e of this.short_edges) {
  this.short_edge_plots.push(
   o.make_thin_line(vec.smul(scale,this.embedding[e[0]]),
		    vec.smul(scale,this.embedding[e[1]]),
		    col)
  );
 }
}

plato.solid.thick_wireframe_plot = function(o,opts) {
 opts = opts || {};
 var scale  = opts.scale || 1;
 var col    = opts.col || [0.7,0.7,0.7];
 var radius = opts.radius || 0.01;

 this.short_edge_plots = [];

 for (var e of this.short_edges) {
  var l = Object.create(o.line);
  l.owner = o;
  l.radius = radius;
  l.a = vec.smul(scale,this.embedding[e[0]]);
  l.b = vec.smul(scale,this.embedding[e[1]]);
  l.set_colour(col);
  l.make_mesh();
  this.short_edge_plots.push(l);
 }
}

plato.solid.sphere_wireframe_plot = function(o,opts) {
 opts = opts || {};
 var scale = opts.scale || 1;
 var col = opts.col || [0.7,0.7,0.7];
 var r = scale / this.vertex_radius;

 this.short_edge_plots = [];

 for (var e of this.short_edges) {
  var a = Object.create(o.sphere_arc);
  a.owner = o;
  a.radius = 0.01;
  a.set_ends(vec.smul(r,this.embedding[e[0]]),
	     vec.smul(r,this.embedding[e[1]]));
  a.set_colour(col);
  a.make_mesh();
  this.short_edge_plots.push(a);
 }
}

plato.solid.all_poles_plot = function(o) {
 this.pole_plots = {2 : [], 3 : [], 4 : [], 5 : []};

 for (var d of [2,3,4,5]) {
  var r = this.pole_length[d];
  var c = plato.pole_colours[d];
  for (var i of this.poles[d]) {
   var u = alternating_five.all_poles[i];
   var m = o.make_thin_line(vec.smul( r,u),vec.smul(-r,u),c);
   this.pole_plots[d].push(m);
  }
 }
}

plato.solid.all_unit_poles_plot = function(o) {
 this.unit_pole_plots = {2 : [], 3 : [], 4 : [], 5 : []};

 for (var d of [2,3,4,5]) {
  var r = 1.1;
  var c = plato.pole_colours[d];
  for (var i of this.poles[d]) {
   var u = alternating_five.all_poles[i];
   var m = o.make_line(vec.smul( r,u),vec.smul(-r,u),c,0.03);
   m.make_mesh();
   this.unit_pole_plots[d].push(m);
  }
 }
}

plato.solid.sample_poles_plot = function(o) {
 this.pole_plots = {2 : [], 3 : [], 4 : [], 5 : []};

 for (var d of [2,3,4,5]) {
  var r = this.pole_length[d];
  var c = plato.pole_colours[d];
  if (this.poles[d].length) {
   var i = this.poles[d][0];
   var u = alternating_five.all_poles[i];
   var m = o.make_line(vec.smul( r,u),vec.smul(-r,u),c,0.02 * this.vertex_radius);
   m.make_mesh();
   this.pole_plots[d].push(m);
  }
 }
}

plato.solid.dual_plot = function(o) {
 this.wireframe_plot(o);
 this.dual.plot(o,{scale : -1/this.dual_factor});
}

//////////////////////////////////////////////////////////////////////

plato.init = function() {
 var p,n,r,i,j,k;
 
 var IC = Object.create(plato.solid);
 var OC = Object.create(plato.solid);
 var TC = Object.create(plato.solid);
 var CC = Object.create(plato.solid);
 var DC = Object.create(plato.solid);

 var AC = [{},IC,OC,TC,CC,DC];

 this.icosahedron_complex  = IC;
 this.octahedron_complex   = OC;
 this.tetrahedron_complex  = TC;
 this.cube_complex         = CC;
 this.dodecahedron_complex = DC;
 this.platonic_complexes   = AC;

 var t0 = (Math.sqrt(5.) + 1)/2;
 var t1 = t0 - 1;
 var t2 = t1 * t1;
 var s0 = Math.sqrt(2./(5. + Math.sqrt(5.)));
 var s1 = Math.sqrt(2./(5. - Math.sqrt(5.)));

 var range = function(k) {
  var r = [];
  for (var i = 1; i <= k; i++) { r.push(i); }
  return r;
 }
 
 var AV = [
 [],
 [
  [  0, t2, t1],[  0, t2,-t1],[  0,-t2, t1],[  0,-t2,-t1],
  [ t1,  0, t2],[-t1,  0, t2],[ t1,  0,-t2],[-t1,  0,-t2],
  [ t2, t1,  0],[ t2,-t1,  0],[-t2, t1,  0],[-t2,-t1,  0]
 ],
 [
  [ 1, 0, 0],[ 0, 1, 0],[ 0, 0, 1],
  [ 0, 0,-1],[ 0,-1, 0],[-1, 0, 0]
 ],
 [
  [ 1, 1, 1],[ 1,-1,-1],[-1, 1,-1],[-1,-1, 1]
 ],
 [
  [ 1, 1, 1],[ 1,-1,-1],[-1, 1,-1],[-1,-1, 1],
  [-1, 1, 1],[ 1,-1, 1],[ 1, 1,-1],[-1,-1,-1]
 ],
 [
  [  1,  1,  1],[  1, -1, -1],[ -1,  1, -1],[ -1, -1,  1],
  [  0, t0, t1],[  0, t0,-t1],[  0,-t0, t1],[  0,-t0,-t1],
  [ t1,  0, t0],[-t1,  0, t0],[ t1,  0,-t0],[-t1,  0,-t0],
  [ t0, t1,  0],[ t0,-t1,  0],[-t0, t1,  0],[-t0,-t1,  0],
  [ -1,  1,  1],[  1, -1,  1],[  1,  1, -1],[ -1, -1, -1]
 ]];

 for (p = 1; p <= 5; p++) {
  n = AV[p].length;
  AC[p].num_vertices = n;
  AC[p].vertices = range(n);
  AC[p].vertex_radius = vec.nm(AV[p][1]);
  AC[p].embedding = {};
  AC[p].normalised_embedding = {};
  for (i = 1; i <= n ; i++) {
   u = AV[p][i - 1];
   r = vec.nm(u);
   AC[p].embedding[i] = u;
   AC[p].normalised_embedding[i] = vec.hat(u);
  }
 }

 for (p = 1; p <= 5; p++) {
  q = 6 - p;
  u = AC[p].embedding;
  v = AC[q].embedding;
  n = AC[p].num_vertices;
  m = AC[q].num_vertices;
  k = 'faces';
  if (p == 4) { k = 'squares'; }
  if (p == 5) { k = 'pentagons'; }
  AC[p][k] = [];
  for (j = 1; j <= m; j++) {
   var f = [];
   for (i = 1; i <= n; i++) {
    if (Math.abs(vec.dp(u[i],v[j]) + 1) < 0.0001) {
     f.push(i);
    }
   }
   AC[p][k].push(f);
  }

  AC[p]['oriented_' + k] =
   AC[p][k].map(f => vec.orient_face(f,u));

  AC[p]['facets'] = AC[p][k];
  AC[p]['oriented_facets'] = AC[p]['oriented_' + k];
  AC[p]['num_' + k] = m;
  AC[p]['num_facets'] = m;
 }

 CC.faces = [
  [1,2,6],[1,2,7],[1,3,5],[1,3,7],
  [1,4,5],[1,4,6],[2,6,8],[2,7,8],
  [3,5,8],[3,7,8],[4,5,8],[4,6,8]
 ];

 DC.faces = [
  [ 1, 5, 6],[ 1, 5,17],[ 1, 6,19],[ 1, 9,10],[ 1, 9,18],[ 1,10,17],
  [ 1,13,14],[ 1,13,19],[ 1,14,18],[ 2, 7, 8],[ 2, 7,18],[ 2, 8,20],
  [ 2,11,12],[ 2,11,19],[ 2,12,20],[ 2,13,14],[ 2,13,19],[ 2,14,18],
  [ 3, 5, 6],[ 3, 5,17],[ 3, 6,19],[ 3,11,12],[ 3,11,19],[ 3,12,20],
  [ 3,15,16],[ 3,15,17],[ 3,16,20],[ 4, 7, 8],[ 4, 7,18],[ 4, 8,20],
  [ 4, 9,10],[ 4, 9,18],[ 4,10,17],[ 4,15,16],[ 4,15,17],[ 4,16,20]
 ];
 
 var L = [0,3.-Math.sqrt(5.), Math.sqrt(2.), 2*Math.sqrt(2.), 2., Math.sqrt(5.)-1];
 
 for (p = 1; p <= 5; p++) {
  u = AC[p].embedding;
  AC[p].short_edge_length = L[p];

  var n = AC[p].num_vertices;
  var ET = {};
  for (i = 1; i <= n; i++) {
   ET[i] = {};
   for (var j = i+1; j <= n; j++) {
    ET[i][j] = 0;
   }
  }
  
  for (f of AC[p].faces) {
   ET[f[0]][f[1]] = 1;
   ET[f[0]][f[2]] = 1;
   ET[f[1]][f[2]] = 1;
  }

  AC[p].edges = [];  
  AC[p].short_edges = [];
  AC[p].long_edges = [];

  for (i = 1; i <= n; i++) {
   for (var j = i+1; j <= n; j++) {
    if (ET[i][j]) {
     AC[p].edges.push([i,j]);
     if (vec.dd(u[i],u[j]) < L[p] + 0.0001) {
      AC[p].short_edges.push([i,j]);
     } else {
      AC[p].long_edges.push([i,j]);
     }
    }
   }
  }
 }

 var A5 = alternating_five;

 for (var p = 1; p <= 5; p++) {
  u = AV[p];
  AC[p].rotation_group = [];
  AC[p].vertex_permutation = {};
  for (var g of A5.elements) {
   var M = A5.matrix[g];
   var ok = 1;
   var s = [];
   for (var x of u) {
    var i = AC[p].find_vertex_index(vec.mmul(M,x));
    if (i) {
     s.push(i);
    } else {
     ok = 0;
     break;
    }
   }

   if (ok) {
    AC[p].rotation_group.push(g);
    AC[p].vertex_permutation[g] = s;
   }
  }
 }

 for (var p = 2; p <= 4; p++) {
  AC[p].poles = {2 : [], 3 : [], 4 : [], 5 : []};

  for (var g of AC[p].rotation_group) {
   if (A5.eq(g,A5.id)) { continue; }
   var d = A5.element_order[g];
   var i = A5.axis_index[g];
   var j = A5.axis_neg_index[g];
   AC[p].poles[d].push(i); 
   AC[p].poles[d].push(j);
  }

  for (var d of [2,3,4,5]) {
   var S = new Set(AC[p].poles[d]);
   AC[p].poles[d] = Array.from(S).sort();
  }
 }

 TC.poles = {};
 TC.poles[2] = [ 1, 2, 3, 4, 5, 6];
 TC.poles[3] = [ 7, 8, 9,10,11,12,13,14];
 TC.poles[4] = [];
 TC.poles[5] = [];
 
 OC.poles = {};
 OC.poles[2] = [63,64,65,66,67,68,69,70,71,72,73,74];
 OC.poles[3] = [ 7, 8, 9,10,11,12,13,14];
 OC.poles[4] = [ 1, 2, 3, 4, 5, 6];
 OC.poles[5] = [];

 CC.poles = Object.assign({},OC.poles);
 
 IC.poles = {};
 
 IC.poles[2] = [1,2,3,4,5,6,
		39,40,41,42,43,44,
		45,46,47,48,49,50,
		51,52,53,54,55,56,
		57,58,59,60,61,62];

 IC.poles[3] = [ 7, 8, 9,10,11,12,13,14,
		 27,28,29,30,31,32,33,34,35,36,37,38];

 IC.poles[4] = [];
 
 IC.poles[5] = [15,16,17,18,19,20,21,22,23,24,25,26];

 DC.poles = Object.assign({},IC.poles);

 DC.short_edges = [
  [ 1, 5], [ 1, 9], [ 1,13], [ 2, 8], [ 2,11], [ 2,14],
  [ 3, 6], [ 3,12], [ 3,15], [ 4, 7], [ 4,10], [ 4,16],
  [ 5, 6], [ 5,17], [ 6,19], [ 7, 8], [ 7,18], [ 8,20],
  [ 9,10], [ 9,18], [10,17], [11,12], [11,19], [12,20],
  [13,14], [13,19], [14,18], [15,16], [15,17], [16,20]
 ];
 
 DC.long_edges_a = [
  [ 1, 6], [ 1,10], [ 1,14], [ 2, 7], [ 2,12], [ 2,13],
  [ 3, 5], [ 3,11], [ 3,16], [ 4, 8], [ 4, 9], [ 4,15]
 ];

 DC.long_edges_b = [
  [ 1,17], [ 1,18], [ 1,19], [ 2,18], [ 2,19], [ 2,20],
  [ 3,17], [ 3,19], [ 3,20], [ 4,17], [ 4,18], [ 4,20]
 ];
 
 DC.faces_a = [
  [ 1, 5, 6], [ 1, 9,10], [ 1,13,14], [ 2, 7, 8], [ 2,11,12], [ 2,13,14],
  [ 3, 5, 6], [ 3,11,12], [ 3,15,16], [ 4, 7, 8], [ 4, 9,10], [ 4,15,16]
 ];

 DC.faces_b = [
  [ 1, 5,17], [ 1, 9,18], [ 1,13,19], [ 2, 8,20], [ 2,11,19], [ 2,14,18],
  [ 3, 6,19], [ 3,12,20], [ 3,15,17], [ 4, 7,18], [ 4,10,17], [ 4,16,20]
 ];

 DC.faces_c = [
  [ 1, 6,19], [ 1,10,17], [ 1,14,18], [ 2, 7,18], [ 2,12,20], [ 2,13,19],
  [ 3, 5,17], [ 3,11,19], [ 3,16,20], [ 4, 8,20], [ 4, 9,18], [ 4,15,17]
 ];

 DC.inscribed_cubes = [
  [ 3, 5, 8, 10, 11, 13, 16, 18], 
  [ 4, 5, 8,  9, 12, 14, 15, 19],
  [ 2, 6, 7,  9, 12, 13, 16, 17], 
  [ 1, 6, 7, 10, 11, 14, 15, 20], 
  [ 1, 2, 3,  4, 17, 18, 19, 20] 
 ];

 IC.pole_length = {2 : 0.8, 3 : 0.8, 5 : 0.9};
 OC.pole_length = {2 : 1.2, 3 : 0.8, 5 : 0.9};
 TC.pole_length = {2 : 1.3, 3 : 1.2, 5 : 0.9};
 CC.pole_length = {2 : 1.3, 3 : 2.0, 5 : 0.9};
 DC.pole_length = {2 : 2.0, 3 : 2.0, 5 : 1.7};

 IC.dual_factor = 3;
 OC.dual_factor = 3;
 TC.dual_factor = 3;
 CC.dual_factor = 1;
 DC.dual_factor = 5 - 2 * Math.sqrt(5.);

 for (p = 1; p <= 5; p++) { AC[p].dual = AC[6-p]; }
 
 DC.all_edges_plot = function(o) {
  this.all_edges_plots = [];
  for (var e of this.short_edges) {
   this.all_edges_plots.push(
    o.make_thin_line(this.embedding[e[0]],
		     this.embedding[e[1]],
		     [0.0,0.0,1.0])
   );
  }

  for (var e of this.long_edges_a) {
   this.all_edges_plots.push(
    o.make_thin_line(this.embedding[e[0]],
		     this.embedding[e[1]],
		     [1.0,0.0,0.0])
   );
  }

  for (var e of this.long_edges_b) {
   this.all_edges_plots.push(
    o.make_thin_line(this.embedding[e[0]],
		     this.embedding[e[1]],
		     [0.0,1.0,0.0])
   );
  }
 }

 DC.triangle_plot = function(o) {
  this.triangle_plots = [];

  var v = this.embedding;
  
  for (f of this.faces_a) {
   this.triangle_plots.push(o.make_polygon([v[f[0]],v[f[1]],v[f[2]]],[0,0,1]));
  }

  for (f of this.faces_b) {
   this.triangle_plots.push(o.make_polygon([v[f[0]],v[f[1]],v[f[2]]],[1,0,0]));
  }

  for (f of this.faces_c) {
   this.triangle_plots.push(o.make_polygon([v[f[0]],v[f[1]],v[f[2]]],[0,1,0]));
  }

  for (var e of this.short_edges) {
   o.make_thin_line(this.embedding[e[0]],
		    this.embedding[e[1]],
		    [0.9,0.9,0.9]);
  }
 }

 DC.inscribed_cubes_plot = function(o) {
  this.inscribed_cube_plots = [];
  var v = this.embedding;

  var cols = [
   new BABYLON.Color4(0,0,0,1),
   new BABYLON.Color4(1,0,0,1),
   new BABYLON.Color4(0,1,0,1),
   new BABYLON.Color4(0,0,1,1),
   new BABYLON.Color4(1,0,1,1),
   new BABYLON.Color4(0,1,1,1)
  ];
  
  for (var i = 1; i <= 5; i++) {
   var C0 = this.inscribed_cubes[i-1];
   var CP0 = [];
   for (j = 0; j < 8; j++) {
    for (k = 0 + 1; k < 8; k++) {
     if (Math.abs(vec.dd(v[C0[j]],v[C0[k]]) - 2) < 0.0001) {
      var l = Object.create(o.line);
      l.owner = o;
      l.a = v[C0[j]];
      l.b = v[C0[k]];
      l.radius = 0.02;
      l.colour = cols[i];
      l.make_mesh();
      CP0.push(l);
     }
    }
   }
   this.inscribed_cube_plots.push(CP0);
  }
 }

 CC.long_axes_plot = function(o) {
  this.long_axis_plots = [];

  var cols = [
   new BABYLON.Color4(1,0,0),
   new BABYLON.Color4(0,1,0),
   new BABYLON.Color4(1,0,1),
   new BABYLON.Color4(0,1,1)
  ];

  var uu = [[1,1,1],[1,-1,1],[-1,1,1],[-1,-1,1]];

  for (var i = 0; i < 4; i++) {
   var u = uu[i];
   var l = Object.create(owl3.line);
   l.owner = o;
   l.a = vec.smul(-1.3,u);
   l.b = vec.smul( 1.3,u);
   l.radius = 0.03;
   l.colour = cols[i];
   l.make_mesh();
   this.long_axis_plots.push(l);
  }
 }
};


plato.init();
