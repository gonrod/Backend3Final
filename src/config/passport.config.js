import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserModel from '../dao/models/User.js';
import { createHash, isValidPassword } from '../utils/passwordUtils.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, emailArg, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await UserModel.findOne({ email });
                if (user) {
                    console.log('User already exists');
                    return done(null, false);
                }
                let newUser = {
                    first_name, 
                    last_name,
                    email, 
                    age,
                    password: createHash(password)
                };

                const userCreated = await UserModel.create(newUser);
                return done(null, userCreated);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user.id);
    });

    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, 
        async (req, email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    console.warn('User doesn’t exist');
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                if (!isValidPassword(password, process.env.JWT_SECRET)) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.tokenCookie;
    }
    return token;
};

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

export { initializePassport };
