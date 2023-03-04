/**
 * function to convert robot joints into spatial (3D = x,y,z)
 */

/**
 * ([q1,q2,q3,q4] --> [x,y,z]):
 

def direcKin(q1,q2,q3,q4):
    a1 = 5.0
    a2 = 30
    a3 = 35
    a4 = 22
    d1 = 35.85
    d2 = -9.8
    d3 = 6.5
    x= a1*np.cos(q1) + a2*np.cos(q1)*np.cos(q2) - a3*np.sin(q2)*np.sin(q3)*np.cos(q1) + a3*np.cos(q1)*np.cos(q2)*np.cos(q3) + a4*(-np.sin(q2)*np.sin(q3)*np.cos(q1) + np.cos(q1)*np.cos(q2)*np.cos(q3))*np.cos(q4) + a4*(-np.sin(q2)*np.cos(q1)*np.cos(q3) - np.sin(q3)*np.cos(q1)*np.cos(q2))*np.sin(q4) - d2*np.sin(q1) - d3*np.sin(q1)

 


    y= a1*np.sin(q1) + a2*np.sin(q1)*np.cos(q2) - a3*np.sin(q1)*np.sin(q2)*np.sin(q3) + a3*np.sin(q1)*np.cos(q2)*np.cos(q3) + a4*(-np.sin(q1)*np.sin(q2)*np.sin(q3) + np.sin(q1)*np.cos(q2)*np.cos(q3))*np.cos(q4) + a4*(-np.sin(q1)*np.sin(q2)*np.cos(q3) - np.sin(q1)*np.sin(q3)*np.cos(q2))*np.sin(q4) + d2*np.cos(q1) + d3*np.cos(q1)

 


    z= -a2*np.sin(q2) - a3*np.sin(q2)*np.cos(q3) - a3*np.sin(q3)*np.cos(q2) + a4*(np.sin(q2)*np.sin(q3) - np.cos(q2)*np.cos(q3))*np.sin(q4) + a4*(-np.sin(q2)*np.cos(q3) - np.sin(q3)*np.cos(q2))*np.cos(q4) + d1

 

    return x,y,z
 * 
 */

function robotPointTo3D(coordinates:number[]){
    return {x:0,y:0,z:0}
}