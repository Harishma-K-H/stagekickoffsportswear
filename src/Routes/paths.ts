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
    customers: {
      index: string;
      details: (id?: string | number) => string;
    };
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
    customers: {
      index: '/branch/customers',
      details: (id = ':id') => `/branch/customers/${id}/details`,
    },
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
