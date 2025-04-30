declare module "urlcat" {
    export default function urlcat(
      base: string,
      params?: Record<string, any>
    ): string;
  }
  