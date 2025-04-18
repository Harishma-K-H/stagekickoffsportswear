export const numberToWords = (num: number): string => {
  const units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';

    if (n < 10) return units[n];

    if (n < 20) return teens[n - 10];

    if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
    }

    return (
      units[Math.floor(n / 100)] +
      ' Hundred' +
      (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '')
    );
  };

  if (num === 0) return 'Zero';

  let inr = Math.floor(num);
  const decimal = Math.round((num % 1) * 100);

  let result = '';

  if (inr > 999999) {
    result += convertLessThanThousand(Math.floor(inr / 1000000)) + ' Million ';
    inr %= 1000000;
  }

  if (inr > 99999) {
    result += convertLessThanThousand(Math.floor(inr / 100000)) + ' Lakh ';
    inr %= 100000;
  }

  if (inr > 999) {
    result += convertLessThanThousand(Math.floor(inr / 1000)) + ' Thousand ';
    inr %= 1000;
  }

  result += convertLessThanThousand(inr);

  result = 'Indian Rupee ' + result.trim() + ' Only';

  if (decimal > 0) {
    result += ' and ' + convertLessThanThousand(decimal) + ' Paise';
  }

  return result;
};
