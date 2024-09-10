import bcrypt from 'bcrypt'
export const hashPassword=({password,saltRound=8})=>{

    return bcrypt.hashSync(password,saltRound)

}

export const comparPassword =({password,hashPassword})=>{
    return bcrypt.compareSync(password,hashPassword)

}