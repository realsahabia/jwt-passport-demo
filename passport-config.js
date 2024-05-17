import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const initializePassport = (users) => {
    passport.use(new Strategy(opts, (jwt_payload, done) => {
        const user = users.find(u => u.username === jwt_payload.username);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }));
    return passport;
};

export default initializePassport;