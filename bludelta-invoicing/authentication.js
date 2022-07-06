module.exports = {
  type: 'custom',
  test: {
    headers: {
      'X-ApiKey': '{{bundle.authData.api_key}}',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    url: 'https://api.bludelta.ai/v1-18/openapi',
  },
  fields: [
    { computed: false, key: 'api_key', required: false, type: 'password' },
  ],
  customConfig: {},
};
