// Calculate total paid amount and current balance
export const paidAmount = (payment_details: any[]) => {
  return payment_details?.reduce((sum: number, payment: any) => {
    // Skip refund entries
    if (payment?.payment_method === 'REFUND') {
      return sum;
    }

    return sum + parseFloat(payment?.paid_amount || '0');
  }, 0);
};