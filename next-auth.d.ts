declare module "next-auth" {
   interface Seassion {
      user: {
         id: string;
      } & DefaultSeassion["user"]
   }
}