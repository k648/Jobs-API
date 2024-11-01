
const User = require('../model/User')

const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
   throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

/*const register = async (req,res) => {
const {name, email , password } = req.body
const salt = bcrypt.genSaltSync(10);
const hashPassword = await bcrypt.hash(password,salt)
const tempUser = {name, email , password : hashPassword}
const user = await User.create({...tempUser})
const token  = jwt.sign({userId: user._id,name: user.name},process.env.JWT_SECRET,{
    expiresIn : '1d'
})
    res.status(StatusCodes.CREATED).json({user: { name: user.name }, token })
}



const login = async (req,res) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
     // compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    const token  = jwt.sign({userId: user._id,name: user.name},process.env.JWT_SECRET,{
      expiresIn : '1d'
  })
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}*/


module.exports = {
    register,
    login,
}