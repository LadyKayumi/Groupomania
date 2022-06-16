const bcrypt = require('bcrypt')
const cookie = require('cookie')
const zxcvbn = require('zxcvbn')
const crypto = require('crypto')
const User = require('../schemas/user-schema')
const { createAccessToken, createRefreshToken, verifyToken, getUserId } = require('../middleware/auth')

exports.userRegister = async (req, res, next) => {
  const { email, username, password, firstName, lastName } = req.body

  if (!(email && username && password && firstName && lastName)) {
    return res.status(400).json({ error: new Error('Bad request.'), message: 'Fields can\'t be empty.' })
  }

  const mailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  if (!email.match(mailRegex)) {
    return res.status(400).json({ error: new Error('Email entered is not a valid email address.'), message: 'Email entered is not a valid email address.' })
  }

  if (username.length < 5) {
    return res.status(400).json({ error: new Error('Username should be at least 5 characters long.'), message: 'Username should be at least 5 characters long.' })
  }

  if (zxcvbn(password, [email, username, firstName, lastName]).score < 2) {
    return res.status(400).json({ error: new Error('Password is not strong enough.'), message: 'Password is not strong enough.' })
  }

  const pfp = `${req.protocol}://${req.get('host')}/media/pfp/ProfileImage.png`

  bcrypt.hash(password, 10).then(async hash => {
    try {
      const user = await User.build({
        email,
        username,
        password: hash,
        firstName,
        lastName,
        pfp
      })
      await user.save()
      return res.status(201).json({ message: 'Account created.' })
    }
    catch(error) {
      if (error?.original?.errno === 1062) { // code: 'ER_DUP_ENTRY'
        const errorParam = error.fields.email || error.fields.username
        return res.status(401).json({ error, message: `${errorParam} already exists.` })
      }
      if (error.errors) {
        return res.status(400).json({ error, message: 'Email entered is not a valid email address.' })
      }
      return res.status(500).json({ error, message: error.message })
    }
  })
  .catch(error => {
    res.status(500).json({ error, message: error.message })
  })
}

exports.userLogin = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')

  if (!Object.entries(cookies).length) {
    if (req.body.autoLogin) {
      return res.end()
    }
    const { email, password } = req.body
    if (!(email && password)) {
      return res.status(400).json({ error: new Error('Bad request.'), message: 'Email or password can\'t be empty.' })
    }
    const user = await User.findOne({
      where: {
        email
      },
      raw: true
    })
    if (!user) {
      return res.status(401).json({ error: new Error('Incorrect email or password.'), message: 'Incorrect email or password.' })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: new Error('Incorrect email or password.'), message: 'Incorrect email or password.' })
    }

    const accessToken = createAccessToken(user.userid)
    const refreshToken = createRefreshToken(user.userid)
    res.setHeader('Set-Cookie', [
      cookie.serialize(
        'access', accessToken.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: accessToken.expiration,
          sameSite: 'strict',
          path: '/'
        }
      ),
      cookie.serialize(
        'refresh', refreshToken.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: refreshToken.expiration,
          sameSite: 'strict',
          path: '/'
        }
      )
    ])
    return res.status(200).json({ user, message: 'Login successful.' })
  }
  else {
    const { access, refresh } = cookies
    const userid = getUserId(access) || getUserId(refresh)
    if (!userid) {
      return res.status(401).json({ error: new Error('Bad request.'), message: 'Missing id.' })
    }

    const user = await User.findOne({
      where: {
        userid
      },
      raw: true
    })

    try {
      if (!verifyToken(userid, access)) {
        throw 'Wrong id.'
      }
      return res.status(200).json({ user, message: 'Login successful.' })
    }
    catch {
      try {
        if (!verifyToken(userid, refresh)) {
          throw 'Wrong id.'
        }
        else {
          const newToken = createAccessToken(userid)
          res.setHeader('Set-Cookie', [
            cookie.serialize(
              'access', newToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: newToken.expiration,
                sameSite: 'strict',
                path: '/'
              }
            )
          ])
          return res.status(200).json({ user, message: 'Login successful.' })
        }
      }
      catch {
        return res.status(401).json({ error: new Error('Bad request.'), message: 'Missing id.' })
      }
    }
  }
}

exports.userLogout = async (req, res, next) => {
  res.setHeader('Set-Cookie', [
    cookie.serialize(
      'access', '0', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 0,
        sameSite: 'strict',
        path: '/'
      }
    ),
    cookie.serialize(
      'refresh', '0', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 0,
        sameSite: 'strict',
        path: '/'
      }
    )
  ])
  return res.status(200).json({ message: 'Logout successful.' })
}