export default async function login(request, credential): Promise<string> {
  const res = await request
    .post("/v1/auth/login")
    .send(credential)
    .set("Accept", "application/json");
  return res.body.token;
}
