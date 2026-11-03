export type Session = {
  uid?: string;
  name: string;
  email: string;
};

export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; message: string };
