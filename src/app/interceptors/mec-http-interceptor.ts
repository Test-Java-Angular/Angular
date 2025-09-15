import { HttpInterceptorFn } from '@angular/common/http';

export const mecHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const reqWithHeader = req.clone({
    url: `${process.env.API_URL}${req.url}`
  });
  return next(reqWithHeader);
};
