const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User")

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_BASE_URL 
  : process.env.BASE_URL;

passport.use(
     new GoogleStrategy(
          {
               clientID: process.env.GOOGLE_CLIENT_ID,
               clientSecret: process.env.GOOGLE_CLIENT_SECRET,
               callbackURL: `${BASE_URL}/auth/google/callback`,
          },
          async (accessToken, refreshToken, profile, done) => {
               try {
                    let user = await User.findOne({ googleId: profile.id })

                    if (!user) {
                         user = await User.findOne({
                              email: profile.emails[0].value,
                         })

                         if (user) {
                              user.googleId = profile.id
                              await user.save()
                         } else {
                              user = await User.create({
                                   googleId: profile.id,
                                   name: profile.displayName,
                                   email: profile.emails[0].value,
                              })
                         }
                    }

                    return done(null, user)
               } catch (err) {
                    return done(err, null)
               }
          }
     )
)

// Serialize user
passport.serializeUser((user, done) => done(null, user.id))

// Deserialize user
passport.deserializeUser(async (id, done) => {
     try {
          const user = await User.findById(id)
          done(null, user)
     } catch (err) {
          done(err, null)
     }
})
