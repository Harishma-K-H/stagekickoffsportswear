export interface Data {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  roleValue: number;
  avatar: string;
}

export interface AuthState {
  accessToken: string | null;
  userId: string | null;
  userData: Data | null;
  userRole: string | null;
}
