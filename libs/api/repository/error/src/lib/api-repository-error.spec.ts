import { apiRepositoryError } from './api-repository-error';

describe('apiRepositoryError', () => {
  it('should work', () => {
    expect(apiRepositoryError()).toEqual('api-repository-error');
  });
});
