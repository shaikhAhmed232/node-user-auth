import {Request, Response, NextFunction} from 'express'
const notFoundMiddleware = (req:Request, res:Response) => res.status(404).json({message: "Route Not Found"}) 

export default notFoundMiddleware;