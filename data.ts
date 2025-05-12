import { generateUUID } from "./utils/generateUUID";

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export class DataBase {
  private users: { [key: string]: User } = {};
  getAllUsers() {
    return this.users;
  }

  getUser(id: string): User | undefined {
    return this.users[id];
  }

  createUser(user: Omit<User, "id">): User {
    const id = generateUUID();
    const newUser = { ...user, id };
    this.users[id] = newUser;
    return newUser;
  }

  updateUser(id: string, updates: User): User {
    const foundUser = this.users[id];
    const updatedUser = { ...foundUser, ...updates };
    this.users[id] = updatedUser;
    return updatedUser;
  }
  deleteUser(id: string) {
    delete this.users[id];
    return this.users;
  }
}
