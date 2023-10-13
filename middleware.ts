export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/rack/:path*", "/agave/:path/pup", "/mypage/:path*"],
};
