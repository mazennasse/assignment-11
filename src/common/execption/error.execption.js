export const ApplicationException=({
    message="error",
    option={
        cause:{
            status:400
        }
    }
})=>{
    throw new Error(message,option)
}

export const conflictException=(message="conflict",issues={})=>{
    return ApplicationException({message,option:{
        cause:{
            status:409,
            issues
        }
    }})
}


export const tooManyRequestException=(message="Too many requests",issues={})=>{
    return ApplicationException({message,option:{
        cause:{
            status:429,
            issues
        }
    }})
}


export const BadExecption=(message="BadRequest",issues=undefined)=>{
    return ApplicationException({message,option:{
        cause:{
            status:400,
            issues
        }
    }})
}




export const notFoundException=(message="Notfound",issues={})=>{
    return ApplicationException({message,option:{
        cause:{
            status:404,
            issues
        }
    }})
}

export const unauthorizedException=(message="Unauthorized",issues={})=>{
    return ApplicationException({message,option:{
        cause:{
            status:401,
            issues
        }
    }})
}



export const forbiddenException=(message="Forbidden",issues={})=>{
    return ApplicationException({message,option:{
        cause:{
            status:403,
            issues
        }
    }})
}


