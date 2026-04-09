export default {
  async fetch(request: Request): Promise<Response> {
    const txt = "Contact: mailto:security@willbracken.com\nExpires: 2027-04-09T10:00:00z\nPolicy: https://willbracken.com/security-policy";
    return new Response(txt, { headers: { "content-type": "text/plain" } });
  }
};