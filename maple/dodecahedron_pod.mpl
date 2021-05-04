with(plots): 
with(plottools): 
with(LinearAlgebra):

unprotect('norm'):

norm := (a) -> sqrt(add(a[i]^2,i=1..3)):
dist := (a,b) -> sqrt(add((a[i]-b[i])^2,i=1..3)):
normalise := (a) -> a / norm(a):
dot := (a,b) -> a[1]*b[1] + a[2]*b[2] + a[3]*b[3]:
cross := (a,b) -> <a[2]*b[3] - a[3]*b[2],a[3]*b[1] - a[1]*b[3],a[1]*b[2] - a[2]*b[1]>:

id := <<1|0|0>,<0|1|0>,<0|0|1>>:
g2a := <<1|0|0>,<0|-1|0>,<0|0|-1>>:
g2b := <<-1|0|0>,<0|1|0>,<0|0|-1>>:
g2c := <<-1|0|0>,<0|-1|0>,<0|0|1>>:
g3 := <<0|1|0>,<0|0|1>,<1|0|0>>:
g5 := <<sqrt(5)-1|-2|sqrt(5)+1>,<2|sqrt(5)+1|sqrt(5)-1>,<-sqrt(5)-1|sqrt(5)-1|2>>/4:

# axes of rotation for g3 and g5
a3 := -<1,1,1>/sqrt(3):
a5 := <0,-(5+sqrt(5))/(sqrt(50+10*sqrt(5))),-(2*sqrt(5))/(sqrt(50+10*sqrt(5)))>:

H3 := [id,g3,g3.g3]:
H4 := [id,g2a,g2b,g2c]:
H5 := map(x -> map(expand,x),[id,g5,g5^2,g5^3,g5^4]):
H60 := [seq(seq(seq(map(expand,H3[i].H4[j].H5[k]),i=1..3),j=1..4),k=1..5)]:

H60L := map(convert,H60,listlist):

act := proc(g,x)
 if type(x,specfunc(anything,PLOT3D)) or 
    type(x,specfunc(anything,POLYGONS)) or
    type(x,list(list)) then
  return(map2(act,g,x));
 fi;
 if type(x,[numeric$3]) then
  return(evalf(convert(g . Vector(x),list)));
 fi;
 return(x);
end:

proj := proc(x,p,q)
 if type(x,specfunc(anything,PLOT3D)) then
  return(PLOT(op(map(proj,x,p,q)))); 
 elif type(x,specfunc(anything,POLYGONS)) or
      type(x,specfunc(anything,CURVES)) or
      type(x,list(list)) then
  return(map(proj,x,p,q));
 elif type(x,[numeric$3]) then
  return(evalf([dot(x,p),dot(x,q)]));
 fi;
 return(x);
end:

closed_curves := proc()
 local aa,a,i;
 aa := NULL;
 for a in args do
  if type(a,list) and nops(a) > 0 then
   aa := aa,[op(a),a[1]]:
  else
   aa := aa,a;
  fi;
 od:
 return(CURVES(aa));
end:

mark_distance := proc(p,q,o_)
 local m,n,d,o;
 n := evalf(q -~ p);
 d := sqrt(n[1]^2+n[2]^2);
 n := n /~ d;
 o := `if`(nargs > 2,o_,0.1);
 m := (p +~ q)/2 + o *~ [-n[2],n[1]];
 return(textplot([m[1],m[2],round(1000*d)]));
end:

mark_angle := proc(p,q,r,o_)
 local m,n,d,o,l,theta;
 m := q -~ p;
 n := r -~ p;
 m := m /~ sqrt(m[1]^2+m[2]^2);
 n := n /~ sqrt(n[1]^2+n[2]^2);
 theta := round(evalf(arccos(m[1]*n[1] + m[2]*n[2]) * 180/Pi));
 o := `if`(nargs > 2,o_,0.1);
 l := m +~ n;
 l := p +~ o *~ l /~ sqrt(l[1]^2+l[2]^2);
 return(textplot([l[1],l[2],theta],color=red));
end:

al := 1/2 + 1/sqrt(5):
bt := 1/4 + 3*sqrt(5)/20:

v[ 0] := <  0, -al, -bt>:
v[ 1] := <-bt,   0, -al>: 
v[ 2] := <-al, -bt,   0>: 
v[ 3] := < bt,   0, -al>: 
v[ 4] := < al, -bt,   0>: 
v[ 5] := <  0,  al, -bt>: 
v[ 6] := <-al,  bt,   0>: 
v[ 7] := < al,  bt,   0>: 
v[ 8] := <  0, -al,  bt>: 
v[ 9] := <-bt,   0,  al>: 
v[10] := < bt,   0,  al>: 
v[11] := <  0,  al,  bt>:

v_faces := [
 [ 0, 1, 2],
 [ 0, 1, 3],
 [ 0, 2, 8],
 [ 0, 3, 4],
 [ 0, 4, 8],
 [ 1, 2, 6],
 [ 1, 3, 5],
 [ 1, 5, 6],
 [ 2, 6, 9],
 [ 2, 8, 9],
 [ 3, 4, 7],
 [ 3, 5, 7],
 [ 4, 7,10],
 [ 4, 8,10],
 [ 5, 6,11],
 [ 5, 7,11],
 [ 6, 9,11],
 [ 7,10,11],
 [ 8, 9,10],
 [ 9,10,11]]:

v_edges := 
  [[ 0, 1], [ 0, 2], [ 0, 3], [ 0, 4], [ 0, 8], [ 1, 2],
   [ 1, 3], [ 1, 5], [ 1, 6], [ 2, 6], [ 2, 8], [ 2, 9],
   [ 3, 4], [ 3, 5], [ 3, 7], [ 4, 7], [ 4, 8], [ 4,10], 
   [ 5, 6], [ 5, 7], [ 5,11], [ 6, 9], [ 6,11], [ 7,10],
   [ 7,11], [ 8, 9], [ 8,10], [ 9,10], [ 9,11], [10,11]]:

for i from 0 to 19 do
 f := v_faces[i+1];
 w[i] := (v[f[1]] + v[f[2]] + v[f[3]])*(7*sqrt(15)-15*sqrt(3))/3;
 w[i] := map(simplify,map(expand,w[i]));
od:

a := map(expand,simplify(map(rationalize,normalise(w[0] +~ w[1])))):
b := map(expand,simplify(map(rationalize,normalise(w[1] -~ w[0])))):
c := map(expand,cross(a,b)):
d := <sqrt(5)-1,2,-sqrt(5)-1>/4:

p := (3 - sqrt(5))/2:

x_vals := {
 x[0] = 0.6,    # controls overall size of pod
 x[1] = 0.032,  # long side of cross section of bar
 x[2] = 0.018,  # short side of cross section of bar
 x[3] = 0.03,   # controls size of vertex plates
 x[4] = 0.01,   # thickness of plates
 x[5] = 0.01,   # thickness of pentagons
 x[6] = 0.060,  # long side of cross section of large bar
 x[7] = 0.038,  # short side of cross section of large bar
 x[8] = 0.008   # short dimension of block
}:

F := proc(x)
 if type(x,Matrix) then
  return(evalf(subs(x_vals,convert(x,listlist))));
 elif type(x,Vector) then
  return(evalf(subs(x_vals,convert(x,list))));
 elif type(x,list) then
  return(map(F,x));
 else
  return(evalf(x));
 fi;
end:

t[ 0] := x[0]*(a - p*b):
t[ 1] := t[0] + x[2]*c/2 + x[2]*(sqrt(5)-1)/4 * b:
t[ 2] := t[0] - x[2]*c/2 + x[2]*(sqrt(5)-1)/4 * b:
t[ 3] := x[0]*(a + p*b):
t[ 4] := t[3] + x[2]*c/2 - x[2]*(sqrt(5)-1)/4 * b:
t[ 5] := t[3] - x[2]*c/2 - x[2]*(sqrt(5)-1)/4 * b:
t[ 6] := map(expand,t[0] + x[1]*t[0]/x[0]):
t[ 7] := map(expand,t[6] + x[2]*c/2 + x[2]*(sqrt(5)-1)/4 * b):
t[ 8] := map(expand,t[6] - x[2]*c/2 + x[2]*(sqrt(5)-1)/4 * b):
t[ 9] := map(expand,t[3] + x[1]*t[3]/x[0]):
t[10] := map(expand,t[9] + x[2]*c/2 - x[2]*(sqrt(5)-1)/4 * b):
t[11] := map(expand,t[9] - x[2]*c/2 - x[2]*(sqrt(5)-1)/4 * b):

t[12] := t[ 7] + x[3]*b:
t[13] := t[ 8] + x[3]*b:
t[14] := t[ 7] - x[3]*(2*a-3*b+sqrt(5)*b)/6:
t[15] := t[ 8] - x[3]*(2*a-3*b+sqrt(5)*b)/6:
t[16] := t[ 6] + ((1-sqrt(5))*x[2]-4*x[3])*a/12 + ((sqrt(5)-2)*x[2] + (3-sqrt(5))*x[3])*b/6:
t[17] := t[10] - x[3]*b:
t[18] := t[11] - x[3]*b:
t[19] := t[10] - x[3]*(2*a+3*b-sqrt(5)*b)/6:
t[20] := t[11] - x[3]*(2*a+3*b-sqrt(5)*b)/6:
t[21] := t[ 9] + ((1-sqrt(5))*x[2]-4*x[3])*a/12 - ((sqrt(5)-2)*x[2] + (3-sqrt(5))*x[3])*b/6:

for i from 0 to 21 do 
 T[i] := F(t[i]):
od:

n := map(expand,sqrt(3)*(sqrt(5)-1)*a/12 + sqrt(3)*(sqrt(5)+1)*b/12 + sqrt(3)*c/2):

u[0] := t[14]:
#u[1] := t[12]:
#u[2] := t[12]    + (x[2] - sqrt(3)*(sqrt(5)+1)*x[3]/12)*n:
#u[3] := g3.t[13] + (x[2] - sqrt(3)*(sqrt(5)+1)*x[3]/12)*n:
#u[4] := g3.t[13]:

u[1] := u[0] + ((sqrt(5)-1) * a + (sqrt(5)+1) * b) * x[6]/6:
u[4] := u[0] - ((sqrt(5)-1) * a + (sqrt(5)+1) * b - 6*c) * x[6]/12:
u[2] := u[1] + ((sqrt(5)-1) * a + (sqrt(5)+1) * b + 6*c) * sqrt(3)*x[8]/12:
u[3] := u[4] + ((sqrt(5)-1) * a + (sqrt(5)+1) * b + 6*c) * sqrt(3)*x[8]/12:

for i from 0 to 4 do
 u[i+5] := u[i] + x[7]*(sqrt(5)-1)/2*<1,1,1>:
od:

for i from 0 to 9 do 
 U[i] := F(u[i]):
od:

s[0] := u[2]:
s[1] := u[3]:
s[2] := g3.u[2]:
s[3] := g3.u[3]:
s[4] := g3.g3.u[2]:
s[5] := g3.g3.u[3]:

for i from 0 to 5 do
 s[i+6] := s[i] - x[4]*<1,1,1>/sqrt(3):
od:


for i from 0 to 11 do
 S[i] := F(s[i]):
od:

r[0] := map(expand,t[12] - (-x[2]*sqrt(3)*sqrt(5)+x[2]*sqrt(3)+x[3])*b):
r[1] := map(expand,g3.(r[0] - x[2]*c)):
r[10] := map(expand,r[0] + x[5] * sqrt(50+10*sqrt(5))/(5+3*sqrt(5))* <1,1,1>):
r[11] := map(expand,g3 . (r[10] - x[2]*c)):
for i from 1 to 4 do
 r[2*i  ] := map(expand,g5 . r[2*i-2]):
 r[2*i+1] := map(expand,g5 . r[2*i-1]):
 r[2*i+10] := map(expand,g5 . r[2*i+8]):
 r[2*i+11] := map(expand,g5 . r[2*i+9]):
od:

bar := display(
 polygon(F([t[0],t[1],t[4],t[3],t[5],t[2]])),
 polygon(F([t[6],t[7],t[10],t[9],t[11],t[8]])),
 polygon(F([t[0],t[1],t[7],t[6]])),
 polygon(F([t[1],t[4],t[10],t[7]])),
 polygon(F([t[4],t[3],t[9],t[10]])),
 polygon(F([t[3],t[5],t[11],t[9]])),
 polygon(F([t[5],t[2],t[8],t[11]])),
 polygon(F([t[2],t[0],t[6],t[8]])),
 scaling=constrained
):

flattened_bar := display(
 polygon(F([t[0],t[1],t[4],t[3],t[5],t[2]])),
 polygon(F([t[16],t[14],t[12],t[13],t[15]])),
 polygon(F([t[12],t[13],t[18],t[17]])),
 polygon(F([t[21],t[19],t[17],t[18],t[20]])),
 polygon(F([t[0],t[1],t[14],t[16]])),
 polygon(F([t[0],t[2],t[15],t[16]])),
 polygon(F([t[3],t[4],t[19],t[21]])),
 polygon(F([t[3],t[5],t[20],t[21]])),
 polygon(F([t[1],t[4],t[19],t[17],t[12],t[14]])),
 polygon(F([t[2],t[5],t[20],t[18],t[13],t[15]])),
 scaling=constrained
):

block := display(
 polygon(F([u[0],u[1],u[2],u[3],u[4]])),
 polygon(F([u[5],u[6],u[7],u[8],u[9]])),
 polygon(F([u[0],u[1],u[6],u[5]])),
 polygon(F([u[1],u[2],u[7],u[6]])),
 polygon(F([u[2],u[3],u[8],u[7]])),
 polygon(F([u[3],u[4],u[9],u[8]])),
 polygon(F([u[4],u[0],u[5],u[9]])),
 scaling=constrained
):

plate := display(
 polygon(F([s[0],s[1],s[2],s[3],s[4],s[5]])),
 polygon(F([s[6],s[7],s[8],s[9],s[10],s[11]])),
 seq(polygon(F([s[i],s[i+1],s[i+7],s[i+6]])),i=0..4),
 polygon(F([s[5],s[0],s[6],s[11]])),
 scaling=constrained
):

pentagon := display(
 polygon(F([seq(r[i],i=0..9)])),
 polygon(F([seq(r[i],i=10..19)])),
 seq(polygon(F([r[i],r[i+1],r[i+11],r[i+10]])),i=0..8),
 polygon(F([r[9],r[0],r[10],r[19]]))
):

for i from 0 to 21 do
 tt0[i] := proj(F(t[i]),b,a);
 tt1[i] := proj(F(t[i]),b,c);
 tt2[i] := proj(F(t[i]),cross(c,a3),c);
od:

flattened_bar_side :=
 display(
  eval(subs(POLYGONS=closed_curves,proj(flattened_bar,b,a))),
  mark_distance(tt0[12],tt0[17],0.01),
  mark_distance(tt0[2],tt0[5],-0.01),
  line(tt0[16],tt0[21],linestyle=dot),
  mark_distance(tt0[16],tt0[21],0.01),
  mark_angle(tt0[13],tt0[18],tt0[15],0.007),
  mark_angle(tt0[15],tt0[13],tt0[2],0.007),
  mark_angle(tt0[2],tt0[15],tt0[5],0.007),
  axes=none
 ):

flattened_bar_top :=
 display(
  eval(subs(POLYGONS=closed_curves,proj(flattened_bar,b,c))),
  mark_distance(tt1[12],tt1[17],0.005),
  mark_distance(tt1[2],tt1[5],-0.005),
  mark_distance(tt1[12],tt1[13],-0.005),
  line(tt1[16],tt1[21],linestyle=dot),
  mark_distance(tt1[16],tt1[21],0.005),
  axes=none
 ):

flattened_bar_slant :=
 display(
  eval(subs(POLYGONS=closed_curves,proj(flattened_bar,cross(c,a3),c))),
  mark_distance(tt2[12],tt2[14],-0.002),
  mark_distance(tt2[14],tt2[16],-0.002),
  mark_distance(tt2[12],tt2[13],0.002),
  line(tt2[16],(tt2[12]+~tt2[13])/2,linestyle=dot),
  mark_distance(tt2[16],(tt2[12]+~tt2[13])/2,0.002),
  mark_angle(tt2[14],tt2[12],tt2[16],0.002),
  mark_angle(tt2[16],tt2[14],tt2[15],0.002),
  axes=none,
  view=[-0.01 .. 1.1*tt2[12][1],1.2*tt2[13][2] .. 1.2*tt2[12][2]],
  scaling=constrained
 ):

for i from 0 to 9 do
 uu[i] := proj(F(u[i]),d,cross(d,a3));
od:

block_top := 
 display(
  eval(subs(POLYGONS=closed_curves,proj(block,d,cross(d,a3)))),
  mark_distance(uu[0],uu[1],0.004),
  mark_distance(uu[1],uu[2],0.004),
  mark_distance(uu[2],uu[3],0.004),
  line(uu[0],(uu[2] +~ uu[3])/~2,linestyle=dot),
  mark_distance(uu[0],(uu[2] +~ uu[3])/~2,0.004),
  mark_angle(uu[1],uu[0],uu[2],0.004),
  mark_angle(uu[0],uu[4],uu[1],0.004),
  axes=none
 ):

for i from 0 to 11 do
 ss[i] := proj(F(s[i]),d,cross(d,a3));
od:

plate_top := 
 display(
  eval(subs(POLYGONS=closed_curves,proj(plate,d,cross(d,a3)))),
  mark_distance(ss[0],ss[1],0.004),
  mark_distance(ss[1],ss[2],0.004),
  line((ss[0]+~ss[1])/~2,(ss[3]+~ss[4])/2,linestyle=dot),
  mark_distance((ss[0]+~ss[1])/~2,(ss[3]+~ss[4])/2,0.004),
  line(ss[2],ss[5],linestyle=dot),
  mark_distance(ss[2],ss[5],-0.004),
  mark_angle(ss[1],ss[0],ss[2],0.006),
  mark_angle(ss[0],ss[5],ss[1],0.006),
  axes=none
 ):

plate_offset_x := evalf(subs(x_vals,x[6]/2+3*x[2]/2+3*sqrt(3)*x[8]/2)):
plate_offset_y := evalf(subs(x_vals,(1/6)*x[6]*sqrt(3)-(1/2)*x[8]-(1/6)*x[2]*sqrt(3))):
plate_offset_u := evalf(subs(x_vals,-x[6]/2-x[2]/2-sqrt(3)*x[8]/2)):
plate_offset_v := evalf(subs(x_vals,(1/2)*x[6]*sqrt(3)+(3/2)*x[8]+(1/2)*x[2]*sqrt(3))):

plate_grid := 
 display(
  seq(
   seq(
    closed_curves([seq([1,(-1)^k] *~ ss[i] +~
                       [k*plate_offset_x,(1-(-1)^k)*plate_offset_y/2] +
                        m *~ [plate_offset_u,plate_offset_v],i=0..5)]),
    k=0..6),
   m=0..3),
  scaling=constrained,axes=none
 ):

for i from 0 to 19 do
 rr[i] := proj(F(r[i]),b,cross(a5,b)):
od:

pentagon_top := 
 display(
  curve([seq(rr[i],i=0..9),rr[0]]),
  mark_distance(rr[0],rr[1],0.03),
  mark_distance(rr[1],rr[2],0.03),
  seq(line([-0.4,rr[i][2]],[0.4,rr[i][2]],linestyle=dot),i=0..4),
  seq(textplot([0.45,rr[i][2],round(1000*(rr[i][2]-rr[0][2]))]),i=0..4),
  seq(line([rr[i][1],-0.4],[rr[i][1],0.4],linestyle=dot),i=0..9),
  textplot([rr[5][1],0.43,round(1000*rr[5][1])]),
  textplot([rr[9][1],0.43,round(1000*rr[9][1])]),
  textplot([rr[8][1],0.43,round(1000*rr[8][1])]),
  textplot([rr[6][1],0.43,round(1000*rr[6][1])]),
  textplot([rr[7][1],0.43,round(1000*rr[7][1])]),
  mark_angle(rr[1],rr[0],rr[2],0.03),
  mark_angle(rr[0],rr[9],rr[1],0.03),
  mark_angle(rr[9],rr[8],rr[9]+~[1,0],0.03),
  mark_angle(rr[8],rr[7],rr[8]+~[1,0],0.03),
  mark_angle(rr[7],rr[6],rr[7]+~[1,0],0.03),
  mark_angle(rr[6],rr[5],rr[6]+~[1,0],0.03),
  axes=none,
  scaling=constrained
 ):

pentagon_bottom := 
 display(
  curve([seq(rr[i],i=10..19),rr[10]]),
  mark_distance(rr[10],rr[11],0.03),
  mark_distance(rr[11],rr[12],0.03),
  seq(line([-0.4,rr[i][2]],[0.4,rr[i][2]],linestyle=dot),i=10..14),
  seq(textplot([0.45,rr[i][2],round(1000*(rr[i][2]-rr[10][2]))]),i=10..14),
  seq(line([rr[i][1],-0.4],[rr[i][1],0.4],linestyle=dot),i=10..19),
  textplot([rr[15][1],0.43,round(1000*rr[15][1])]),
  textplot([rr[19][1],0.43,round(1000*rr[19][1])]),
  textplot([rr[18][1],0.43,round(1000*rr[18][1])]),
  textplot([rr[16][1],0.43,round(1000*rr[16][1])]),
  textplot([rr[17][1],0.43,round(1000*rr[17][1])]),
  axes=none,
  scaling=constrained
 ):

np[0] := simplify(normalise(map(factor,map(expand,cross(r[1] - r[0],r[10] - r[0]))))) assuming x[2]>0 and x[5]>0:
np[1] := map(factor,map(expand,cross(r[2] - r[1],r[11] - r[1]))/((4*x[2]*sqrt(3)*sqrt(5)+4*x[2]*sqrt(3)+x[2]+x[2]*sqrt(5)-4*x[0]-4*x[1])*x[5])):
np[1] := simplify(normalise(np[1])):

pentagon_short_edge_angle := 
 round(evalf(arccos(abs(simplify(dot(np[0],a5)))) * 180/Pi)):

pentagon_long_edge_angle := 
 round(evalf(arccos(abs(simplify(dot(np[1],a5)))) * 180/Pi)):


