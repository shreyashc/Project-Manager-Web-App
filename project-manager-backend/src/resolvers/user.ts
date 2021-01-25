import { User } from "../entities/";
import { MyContext } from "../types";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  InputType,
  Query,
} from "type-graphql";
import { env } from "../env";

/**
 * Input type for user signup
 */
@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

/**
 * error type
 */
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

/**
 * structure of user response
 */
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

/**
 * user resolver
 */
@Resolver(User)
export class UserResolver {
  /**
   * Me query (session)
   */
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

  /**
   *
   * @param {RegisterInput} options (eamil, usersname, password)
   *
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const { email, username, password: plainPassword } = options;

      //hash password
      const password = await argon2.hash(plainPassword);

      const user = await User.create({
        email,
        username,
        password,
      });
      await user.save();

      // login user
      req.session.userId = user.id;
      return { user };
    } catch (error) {
      console.log(error);
      return {
        errors: [
          {
            field: "username",
            message: "username already taken",
          },
        ],
      };
    }
  }

  /**
   * Mutation: Login user
   * @param {string} email
   * @param {string} password
   *
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ email: email });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Email not registered",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    //login user
    req.session.userId = user.id;

    return {
      user,
    };
  }

  /**
   * Mutation: Log out current user
   */
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(env.app.cookieName);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
