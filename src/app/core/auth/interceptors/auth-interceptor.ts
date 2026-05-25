import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('socialToken');

    if (token) {
        req = req.clone({
            setHeaders: {
                token: token
            }
        });
    }

    return next(req);
};