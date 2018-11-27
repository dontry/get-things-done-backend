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
          console.log("user:", user);
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
      secretOrKey: "getthingsdone"
    };
    passport.use(
      new JwtStrategy(opts, (jwtPayload, done) => {
        const userService = Container.get(UserService);
        try {
          const user = userService.findById(jwtPayload.id);
          return done(null, user);
        } catch (error) {
          return done(null, false);
        }
      })
    );
  }
}
