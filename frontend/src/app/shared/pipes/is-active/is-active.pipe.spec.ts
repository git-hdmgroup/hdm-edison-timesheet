import { IsActivePipe } from './is-active.pipe';

describe('UserActivePipe', () => {
  it('create an instance', () => {
    const pipe = new IsActivePipe();
    expect(pipe).toBeTruthy();
  });
});
