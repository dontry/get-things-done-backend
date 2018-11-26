import { Container } from "typedi";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserService } from "../api/services";

export class Passport {
  /**
   * useLocalStrategy
   */
  public static useLocalStrategy() {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
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
}
