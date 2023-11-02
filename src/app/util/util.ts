// Declare all known DH Parameters
//Structure:
/*
[J1.Alpha,    J1.Theta_offset,      J1.a,      J1.d   ],
[J2.Alpha,    J2.Theta_offset,      J2.a,      J2.d   ],
[J3.Alpha,    J3.Theta_offset,      J3.a,      J3.d   ],
[J4.Alpha,    J4.Theta_offset,      J4.a,      J4.d   ],
.
.
.
[Jn.Alpha,    Jn.Theta,      Jn.a,      Jn.d   ],
*/

const DH_Edscorbot =
[
//    [0,             0,      0,       0          ],
//    [0,             0,      0,       0          ],
    [-Math.PI/2,    0,      50,      358.5      ],
    [0,             0,      300,     -98        ],
    [0,             0,      350,     65         ],
    [Math.PI/2,     0,      220,     0          ]
]

const DH_Robotanno =
[
    [Math.PI/2,     0,          35.6,   369     ],
    [0,             Math.PI/2,  241.5,  0       ],
    [-Math.PI/2,    -Math.PI,   0,      0       ],
    [-Math.PI/2,    0,          0,      288.2   ],
    [Math.PI/2,     Math.PI/2,  0,      0       ],
    [0,             0,          0,      136     ]
]

/* Our kinematic functions. 
    Inputs:
        Coordinates: Array of "NumJoints" positions. It contains the radians values of every joint.
        Robotname: String containing the name of the robot.
    Outputs:
        x_n, y_n, z_n: The values of all of the joints ends.
*/

//export type CinematicFunction = (coordinates: number[], robotname:string) => { x: number, y: number, z: number } //Old function
export type CinematicFunction = (coordinates: number[], robotname:string) => { x: number[], y: number[], z: number[] }

export const cinematicFunctions: Map<string, CinematicFunction> = new Map<string, CinematicFunction>(
    [
        ['RbtAnno', robotPointTo3D_FullJoints],
        //['EDScorbotSim', robotPointTo3D_FullJoints],
        //['RbtAnno', robotPointTo3D],
        ['EDScorbot', robotPointTo3D_FullJoints]

    ]
)

/*  generateDHmatrix: Auto-generates the transformation matrix with the DH parameters for a given joint index. Angles are in radians here
    Inputs: 
        index: Index of current joint.
        angle: Angle of current joint.
        matrix: DH-Parameter matrix to be evaluated.
    Outputs:
        TF_matrix: Current joint's transformation matrix.
*/
function generateDHmatrix(index: number, angle: number, matrix: number[][])
{
    //DH matrix Edscorbot                       
    const Alpha = matrix[index][0]; 
    const Theta_Offset = matrix[index][1];  
    const a = matrix[index][2]; 
    const d = matrix[index][3]; 

    var theta = angle + Theta_Offset;

    var TF_matrix = 
    [
        [Math.cos(theta), -1 * Math.sin(theta) * Math.cos(Alpha), Math.sin(theta) * Math.sin(Alpha), a * Math.cos(theta)],
        [Math.sin(theta), Math.cos(theta) * Math.cos(Alpha), -1 * Math.cos(theta) * Math.sin(Alpha), a * Math.sin(theta)],
        [0, Math.sin(Alpha), Math.cos(Alpha), d],
        [0, 0, 0, 1]
    ]
    
    return TF_matrix;
}

//Simple matrix multiplication function
function matrixMultiplication(matrixA: number[][], matrixB: number[][]) {

    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const colsB = matrixB[0].length;

    if (colsA !== matrixB.length) {
        throw new Error("Matrix dimensions are not compatible for multiplication");
    }

    const result = new Array(rowsA);

    for (let i = 0; i < rowsA; i++) {
        result[i] = new Array(colsB);
        for (let j = 0; j < colsB; j++) {
            result[i][j] = 0;
            for (let k = 0; k < colsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}

/*  robotPointTo3D_FullJoints: The actual kinematic function. 
It will evaluate the robot name before starting the calculations for xyz representation.
In order for the function to work, both the robot name and the DH parameter matrix must be known and declared in this script of code
Angles are given in degrees, and then transformed to radians
    Inputs: 
        coordinates: Array of direct kinematics coordinates.
        robotname: name of controlled robot.
    Outputs:
        x_n: Array of position X of every joint of the robot, starting from joint J1.
        y_n: Array of position Y of every joint of the robot, starting from joint J1.
        z_n: Array of position Z of every joint of the robot, starting from joint J1.
*/
function robotPointTo3D_FullJoints(coordinates: number[], robotname: string) {

    var I_matrix = 
    [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    var TM = I_matrix;
    var x_n = [0,0,0,0,0,0];
    var y_n = [0,0,0,0,0,0];
    var z_n = [0,0,0,0,0,0];


    if (robotname == 'EDScorbot'){
        for (let DOF = 0; DOF < DH_Edscorbot.length; DOF++) {
            TM = generateDHmatrix(DOF, coordinates[DOF]*Math.PI/180, DH_Edscorbot);
            I_matrix = matrixMultiplication(I_matrix,TM);
            x_n[DOF+2]= I_matrix[0][3];
            y_n[DOF+2]= I_matrix[1][3];
            z_n[DOF+2]= I_matrix[2][3];
            //Added +2 offset to represent the edscorbot robot
        }
    } 
    else if (robotname == 'RbtAnno'){
        for (let DOF = 0; DOF < DH_Robotanno.length; DOF++) {
            TM = generateDHmatrix(DOF, coordinates[DOF]*Math.PI/180, DH_Robotanno);
            I_matrix = matrixMultiplication(I_matrix,TM);
            x_n[DOF]= I_matrix[0][3];
            y_n[DOF]= I_matrix[1][3];
            z_n[DOF]= I_matrix[2][3];
        }
    } 


    return { x: x_n, y: y_n, z: z_n };
}

/*//Test the function with example coordinates
//Test robotanno
const coordinates_1 = [0, -90, 90, 0, 180, 0];
const endEffectorPosition_1 = robotPointTo3D(coordinates_1,'RbtAnno');

console.log("Coordinates (radians):", coordinates_1);
console.log("End-Effector Position:");
console.log("X:", endEffectorPosition_1.x);
console.log("Y:", endEffectorPosition_1.y);
console.log("Z:", endEffectorPosition_1.z);

//Test edscorbot
const coordinates_2 = [0, 0, 0, 0, 0, 0];
const endEffectorPosition_2 = robotPointTo3D(coordinates_2,'EDScorbot');

console.log("Coordinates (radians):", coordinates_2);
console.log("End-Effector Position:");
console.log("X:", endEffectorPosition_2.x);
console.log("Y:", endEffectorPosition_2.y);
console.log("Z:", endEffectorPosition_2.z);
*/

function robotPointTo3D(coordinates: number[],robotName:string) {
    const a1 = 50
    const a2 = 300
    const a3 = 350
    const a4 = 220
    const d1 = 358.5
    const d2 = -98
    const d3 = 65

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


    return { x: [x], y: [y], z: [z] }
}




