interface PathsType {
  signIn: string;
  Admin: {
    dashboard: string;
    items: string;
    customers: {
      index: string;
      details: (id?: string | number) => string;
    };
    invoices: string;
    orders: string;
    reports: {
      invoiceReports: string;
    };
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
    reports: {
      invoiceReports: string;
    };
  };

  error: string;
  unauthorized: string;
}

const Paths: PathsType = {
  signIn: '/signin',

  Admin: {
    dashboard: '/admin/dashboard',
    items: '/admin/items',
    customers: {
      index: '/admin/customers',
      details: (id = ':id') => `/admin/customers/${id}/details`,
    },
    invoices: '/admin/invoices',
    orders: '/admin/orders',
    reports: {
      invoiceReports: '/admin/reports/invoice-reports',
    },
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
    reports: {
      invoiceReports: '/staff/reports/invoice-reports',
    },
  },

  error: '*',
  unauthorized: '/unauthorized',
};

export default Paths;
