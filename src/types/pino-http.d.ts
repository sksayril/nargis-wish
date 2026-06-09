declare module 'pino-http' {
  import type { Logger } from 'pino';
  type PinoHttp = (opts?: any) => (req: any, res: any, next?: any) => void;
  const pinoHttp: PinoHttp;
  export default pinoHttp;
}
