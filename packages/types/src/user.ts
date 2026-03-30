import type { User, Session } from "better-auth";

export interface MeResponse {
  user: User;
  session: Session;
}
