export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/rack/:path*", "/admin", "/mypage/:path*"],
};
