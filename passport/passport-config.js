const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User")

passport.use(
     new GoogleStrategy(
          {
               clientID: process.env.GOOGLE_CLIENT_ID,
               clientSecret: process.env.GOOGLE_CLIENT_SECRET,
               callbackURL: "//google/callback",
               scope: ["email", "profile"],
          },
          async (accessToken, refreshToken, profile, done) => {
               try {
                    let user = await User.findOne({ googleId: profile.id })
                    if (!user) {
                         user = await User.create({
                              googleId: profile.id,
                              name: profile.displayName,
                              email: profile.emails[0].value,
                         })
                    }
                    return done(null, user)
               } catch (err) {
                    return done(err, null)
               }
          }
     )
)

// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
     try {
          const user = await User.findById(id)
          done(null, user)
     } catch (err) {
          done(err, null)
     }
})
