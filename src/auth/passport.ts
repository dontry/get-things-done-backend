import { Container } from "typedi";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../api/services";
import { User } from "../api/models";
import { Strategy } from "passport-strategy";
import { PUBLIC_KEY } from "./index";

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
          /*
            The done() callback sends the authenticated user’s data to the authenticated routes,
            which receive these data via the req.user object.
          */
          return done(null, false);
        } catch (error) {
          return done(error.message);
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
      secretOrKey: PUBLIC_KEY,
      algorithms: ["RS256"]
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
