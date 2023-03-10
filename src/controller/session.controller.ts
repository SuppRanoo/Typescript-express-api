import { Request, Response } from "express";
import { validateCredentials } from "../service/user.service";
import { createAccessToken, createSession, updateSession, findSessions } from "../service/session.service";
import { UserDocument } from "../model/user.model";
import { SessionDocument } from "../model/session.model";
import { LeanDocument } from "mongoose";
import { get } from "lodash"
import { sign } from "../utils/jwt.utils";
import config from "config";

type typeUser = Omit<UserDocument, "password"> | LeanDocument<Omit<UserDocument, "password">>;
type typeSession = Omit<SessionDocument, "password"> | LeanDocument<Omit<SessionDocument, "password">>;

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  let user = await validateCredentials(req.body) as typeUser;

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // Create a session
  let session = await createSession(user._id, req.get("user-agent") || "") as typeSession;

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(req: Request, res: Response){
  const sessionId = get(req, "user.session");
  await updateSession({_id: sessionId}, {valid: false});
  return res.sendStatus(200);
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const sessions = await findSessions({ user: userId, valid: true});
  return res.send(sessions);
}