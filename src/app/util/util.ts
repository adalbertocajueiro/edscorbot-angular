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

export type CinematicFunction = (coordinates: number[]) => { x: number, y: number, z: number }

export const cinematicFunctions: Map<string, CinematicFunction> = new Map<string, CinematicFunction>(
    [
        ['EDScorbot', robotPointTo3D],
        ['EDScorbotSim', robotPointTo3D]
    ]
)

function robotPointTo3D2(coordinates: number[]) {
    return { x: 10, y: 10, z: 10 }
}

function robotPointTo3D3(coordinates: number[]) {
    return { x: 100, y: 50, z: 30 }
}

//ANGLES ARE IN RADIANS ??? by the values it seems to be in degrees
function robotPointTo3D(coordinates: number[]) {
    const a1 = 5.0
    const a2 = 30
    const a3 = 35
    const a4 = 22
    const d1 = 35.85
    const d2 = -9.8
    const d3 = 6.5

    var q1 = coordinates[0]
    var q2 = coordinates[1]
    var q3 = coordinates[2]
    var q4 = coordinates[3]

    var x =
        a1 * Math.cos(q1)
        + a2 * Math.cos(q1) * Math.cos(q2)
        - a3 * Math.sin(q2) * Math.sin(q3) * Math.cos(q1)
        + a3 * Math.cos(q1) * Math.cos(q2) * Math.cos(q3)
        + a4 * (- Math.sin(q2) * Math.sin(q3) * Math.cos(q1) + Math.cos(q1) * Math.cos(q2) * Math.cos(q3)) * Math.cos(q4)
        + a4 * (- Math.sin(q2) * Math.cos(q1) * Math.cos(q3) - Math.sin(q3) * Math.cos(q1) * Math.cos(q2)) * Math.sin(q4)
        - d2 * Math.sin(q1) - d3 * Math.sin(q1)

    var y =
        a1 * Math.sin(q1)
        + a2 * Math.sin(q1) * Math.cos(q2)
        - a3 * Math.sin(q1) * Math.sin(q2) * Math.sin(q3)
        + a3 * Math.sin(q1) * Math.cos(q2) * Math.cos(q3)
        + a4 * (-Math.sin(q1) * Math.sin(q2) * Math.sin(q3) + Math.sin(q1) * Math.cos(q2) * Math.cos(q3)) * Math.cos(q4)
        + a4 * (-Math.sin(q1) * Math.sin(q2) * Math.cos(q3) - Math.sin(q1) * Math.sin(q3) * Math.cos(q2)) * Math.sin(q4)
        + d2 * Math.cos(q1)
        + d3 * Math.cos(q1)

    var z =
        - a2 * Math.sin(q2)
        - a3 * Math.sin(q2) * Math.cos(q3)
        - a3 * Math.sin(q3) * Math.cos(q2)
        + a4 * (Math.sin(q2) * Math.sin(q3) - Math.cos(q2) * Math.cos(q3)) * Math.sin(q4)
        + a4 * (-Math.sin(q2) * Math.cos(q3) - Math.sin(q3) * Math.cos(q2)) * Math.cos(q4)
        + d1


    return { x: x, y: y, z: z }
}