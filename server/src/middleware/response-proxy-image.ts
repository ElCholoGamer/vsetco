import { RequestHandler } from 'express';
import axios, { AxiosError } from 'axios';

function responseProxyImage(): RequestHandler {
    return (req, res, next) => {
        res.proxyImage = url => {
            axios.get(url, { responseType: 'arraybuffer'})
                .then(axiosResponse => {
                    const { data, headers } = axiosResponse;
                    res.contentType(headers['content-type']).send(data);
                })
                .catch((err: AxiosError) => {
                    if(err.stack)console.error(err.stack);

                    res.json({
                        status: 500,
                        message: 'Proxy error.'
                    })
                })
        };

        next();
    }
}

export default responseProxyImage;