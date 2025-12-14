export function getUserSub(req: { user: any }): string {
  return req.user?.sub;
}
