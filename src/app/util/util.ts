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
    [-Math.PI/2,    0,      5,      35.85   ],
    [0,             0,      30,     -9.8    ],
    [0,             0,      35,     6.5     ],
    [Math.PI/2,     0,      22,     0       ]
]

const DH_Robotanno =
[
    [Math.PI/2,     0,          35.6,   369     ],
    [0,             Math.PI/2,  241.5,  0       ],
    [-Math.PI/2,    -Math.PI,   0,      0       ],
    [-Math.PI/2,     0,          0,      288.2  ],
    [Math.PI/2,     Math.PI/2,  0,      0       ],
    [0,             0,          0,      136     ]
]

/* Our kinematic functions. 
    Inputs:
        Coordinates: Array of "NumJoints" positions. It contains the radians values of every joint.
        Robotname: String containing the name of the robot.
    Outputs:
        x, y, z: The values of the end-effector's coordinates.
*/
export type CinematicFunction = (coordinates: number[], robotname:string) => { x: number, y: number, z: number }

export const cinematicFunctions: Map<string, CinematicFunction> = new Map<string, CinematicFunction>(
    [
        ['EDScorbot', robotPointTo3D],
        ['EDScorbotSim', robotPointTo3D],
        ['Rbtanno', robotPointTo3D]

    ]
)


//Auto-generates the transformation matrix with the DH parameters for a given joint index
//Angles are in radians here
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

/*The actual kinematic function. It will evaluate the robot name before starting the calculations for xyz representation.
In order for the function to work, both the robot name and the DH parameter matrix must be known and declared in this script of code
Angles are given in degrees, and then transformed to radians
*/
function robotPointTo3D(coordinates: number[], robotname: string) {

    var I_matrix = 
    [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    var TM = I_matrix;

    if (robotname == 'EDScorbot' || robotname == 'EDScorbotSim'){
        for (let DOF = 0; DOF < 4; DOF++) {
            TM = generateDHmatrix(DOF, coordinates[DOF]*Math.PI/180, DH_Edscorbot);
            I_matrix = matrixMultiplication(I_matrix,TM);
        }
    } 
    else if (robotname == 'RbtAnno'){
        for (let DOF = 0; DOF < 6; DOF++) {
            TM = generateDHmatrix(DOF, coordinates[DOF]*Math.PI/180, DH_Robotanno);
            I_matrix = matrixMultiplication(I_matrix,TM);
        }
    }  

    return { x: I_matrix[0][3], y: I_matrix[1][3], z: I_matrix[2][3] };
}


/*//Test the function with example coordinates
//Test robotanno
const coordinates_1 = [0, -90, 90, 0, 180, 0];
const endEffectorPosition_1 = robotPointTo3D(coordinates_1,'Rbtanno');

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



