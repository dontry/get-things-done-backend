import { Container } from "typedi";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../api/services";
import { User } from "../api/models";
import { Strategy } from "passport-strategy";

export class Passport {
  /**
   * useLocalStrategy
   */
  public static useLocalStrategy(): void {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        const userService: UserService = Container.get(UserService);
        try {
          const user: User | undefined = await userService.findOne({
            username
          });
          if (user instanceof User) {
            const equal: boolean = await User.comparePassword(user, password);
            return equal ? done(null, user) : done("Password incorrect");
          }
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      })
    );
  }

  /**
   * useJWTStrategy
   */
  public static useJWTStrategy(): void {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "token"
    };
    const userService: UserService = Container.get(UserService);
    passport.use(
      new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
          const user: User | undefined = await userService.findById(
            jwtPayload.id
          );
          return done(null, user);
        } catch (error) {
          return done(null, false);
        }
      })
    );
  }

  public static useStrategy(strategies: string[]) {
    strategies.forEach(strategy => {
      if (strategy === "local") {
        this.useLocalStrategy();
      }
      if (strategy === "jwt") {
        this.useJWTStrategy();
      }
    });
  }
}
