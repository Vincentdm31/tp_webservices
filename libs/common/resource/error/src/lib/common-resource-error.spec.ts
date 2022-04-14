import { commonResourceError } from './common-resource-error';

describe('commonResourceError', () => {
  it('should work', () => {
    expect(commonResourceError()).toEqual('common-resource-error');
  });
});
