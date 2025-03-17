interface PathsType {
  signIn: string;
  Admin: {
    dashboard: string;
  };
  Staff: {
    dashboard: string;
    customers: string;
    orders: {
      index: string;
      new: string;
    };
    invoices: string;
    settings: string;
  };

  error: string;
  unauthorized: string;
}

const Paths: PathsType = {
  signIn: '/signin',

  Admin: {
    dashboard: '/admin/dashboard',
  },
  Staff: {
    dashboard: '/staff/dashboard',
    customers: '/staff/customers',
    orders: {
      index: '/staff/orders',
      new: '/staff/orders/new'
    },
    invoices: '/staff/invoices',
    settings: '/staff/settings',
  },

  error: '*',
  unauthorized: '/unauthorized',
};

export default Paths;
