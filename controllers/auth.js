const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })
  //console.log(user)
  if (!user) {
    throw new UnauthenticatedError('credential are wrong')
  }
  const isHashPassword = await user.checkPassword(password)
  if (!isHashPassword) {
    throw new UnauthenticatedError('creadential are wrongs')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

const register = async (req, res) => {
  const user = await User.create({
    ...req.body,
  })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

module.exports = { login, register }
