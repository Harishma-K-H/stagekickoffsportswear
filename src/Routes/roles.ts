interface UserRoleType {
  Staff: string;
  Admin: string;
}

const UserRoles: UserRoleType = {
  Staff: import.meta.env.VITE_STAFF_ROLE,
  Admin: import.meta.env.VITE_ADMIN_ROLE,
};

export default UserRoles;
