const Stripe = require('stripe');

const stripeConfig = {
  secretKey: 'sk_test_51QxsKfIvit9jmuVvAFDpvpsjqxdkOPvplMAZvDCJlicBrM0xP2N9ZRQbZv8aSWSTBOkCxnpUhYATE2Yw2n109yeO00IbLFwmgB',
  publishableKey: 'pk_test_51QxsKfIvit9jmuVvauj1o92CBtOlp7hPVRixfHwWhw1dWcWdobyd7LfrGvgbJvuaPkRTm6VVvm7wscm0Jqp2Kqk700nvhdweWO'
};

const stripe = new Stripe(stripeConfig.secretKey);

module.exports = {
  stripe,
  stripeConfig
}; 