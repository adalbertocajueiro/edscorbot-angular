export type MetaInfoObject = {
    signal: number
    name: string
    joints: JointInfo[];
}

export type JointInfo = {
    minimum: number
    maximum: number
}