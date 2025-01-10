import { compare, hash } from "bcrypt";

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 3);
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
