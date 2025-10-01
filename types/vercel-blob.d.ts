declare module '@vercel/blob' {
  export function put(
    path: string,
    data: any,
    options?: { access?: 'public' | 'private'; contentType?: string }
  ): Promise<{ url: string }>
}


