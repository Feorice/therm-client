module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    indentation: 'tab',
    'number-leading-zero': null,
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': ['width', 'height'],
  },
};
