import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import {jwtConfig} from "@config/jwt.config";
import {User} from "@/user/models/user.model";

// Local Strategy for Login
passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select('+password');

                if (!user) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                if (!user.isActive) {
                    return done(null, false, { message: 'Account is deactivated' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// JWT Strategy for Protected Routes
passport.use(
    'jwt',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.secret,
        },
        async (payload, done) => {
            try {
                const user = await User.findById(payload.userId);

                if (!user || !user.isActive) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

/*passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id); // must return full IUser
        done(null, user); // attaches user to req.user
    } catch (err) {
        done(err);
    }
});*/

export const initializePassport = () => {
    return passport.initialize();
};