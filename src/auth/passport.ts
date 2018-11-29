import { Container } from "typedi";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../api/services";

export class Passport {
  /**
   * useLocalStrategy
   */
  public static useLocalStrategy() {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        console.log("username:", username);
        console.log("password:", password);
        const userService = Container.get(UserService);
        try {
          const user = await userService.findOne({ username, password });
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      })
    );
  }

  /**
   * useJWTStrategy
   */
  public static useJWTStrategy() {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "token"
    };
    const userService = Container.get(UserService);
    passport.use(
      new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
          const user = await userService.findById(jwtPayload.id);
          return done(null, user);
        } catch (error) {
          return done(null, false);
        }
      })
    );
  }
}
