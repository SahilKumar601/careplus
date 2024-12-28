"use server";
import { ID, Query } from "node-appwrite";
import { User } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await User.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log(newUser);
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const docs = await User.list([Query.equal("email", [user.email])]);
      return docs?.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};
export const getUser = async (userId: string) => {
  try {
    const user = await User.get(userId);
    return parseStringify(user);
  }catch (error) {
    console.log(error);
  }
};
