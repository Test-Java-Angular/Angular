import { mecHttpInterceptor } from './mec-http-interceptor';

describe('mecHttpInterceptor', () => {
  it('agrega la url base a la petición', (done) => {
    const req = {
      url: '/warehouses',
      clone: function(props: any) {
        return { ...this, ...props };
      }
    };
    const next = jasmine.createSpy().and.callFake((passedReq) => {
      expect(passedReq.url).toContain(process.env.API_URL);
      done();
    });
    mecHttpInterceptor(req as any, next);
  });
});