interface PathsType {
  signIn: string;
  Admin: {
    dashboard: string;
    items: string;
    customers: string;
    invoices: string;
    orders: string;
  };
  Staff: {
    dashboard: string;
    customers: string;
    orders: {
      index: string;
      new: string;
      edit: (orderId?: string) => string;
    };
    invoices: string;
  };

  error: string;
  unauthorized: string;
}

const Paths: PathsType = {
  signIn: '/signin',

  Admin: {
    dashboard: '/admin/dashboard',
    items: '/admin/items',
    customers: '/admin/customers',
    invoices: '/admin/invoices',
    orders: '/admin/orders',
  },
  Staff: {
    dashboard: '/branch/dashboard',
    customers: '/branch/customers',
    orders: {
      index: '/branch/orders',
      new: '/branch/orders/new',
      edit: (orderId = ':orderId') => `/branch/orders/${orderId}/edit`,
    },
    invoices: '/branch/invoices',
  },

  error: '*',
  unauthorized: '/unauthorized',
};

export default Paths;
