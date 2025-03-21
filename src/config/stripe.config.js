const Stripe = require('stripe');

const stripeConfig = {
  secretKey: 'sk_test_51QxsKfIvit9jmuVvAFDpvpsjqxdkOPvplMAZvDCJlicBrM0xP2N9ZRQbZv8aSWSTBOkCxnpUhYATE2Yw2n109yeO00IbLFwmgB',
  publishableKey: 'pk_test_51QxsKfIvit9jmuVvauj1o92CBtOlp7hPVRixfHwWhw1dWcWdobyd7LfrGvgbJvuaPkRTm6VVvm7wscm0Jqp2Kqk700nvhdweWO',
  defaultCurrency: 'vnd' // VND is our default currency
};

// VND is a zero-decimal currency in Stripe
// For zero-decimal currencies, amounts should not be multiplied by 100
// Zero-decimal currencies: BIF, CLP, DJF, GNF, JPY, KMF, KRW, MGA, PYG, RWF, UGX, VND, VUV, XAF, XOF, XPF
const stripe = new Stripe(stripeConfig.secretKey);

module.exports = {
  stripe,
  stripeConfig
}; 