"use strict";
/* Public Supabase URL and publishable key only. Email OTP login and signup
   are enabled after confirmed Gmail SMTP OTP delivery and owner login.
   Do not place service role, SMTP, or other secret keys in this file. */
window.PSY_AUTH_CONFIG = Object.freeze({
  url: "https://uwouubzabqpuujuovala.supabase.co",
  publishableKey: "sb_publishable_V-_zk9X0rzxhWcm3JBwx5w_2tXoWvYe",
  registrationEnabled: true,
  // Enable only after the server-side /supabase-bridge/__health succeeds
  // on the live Timeweb host. Supabase's URL and storage key stay unchanged.
  apiBridgeEnabled: false,
  apiFetch: (resource, init) => {
    const nativeFetch = window.fetch.bind(window);
    const config = window.PSY_AUTH_CONFIG;
    if (!config?.apiBridgeEnabled) return nativeFetch(resource, init);
    let source;
    try {
      source = new URL(typeof resource === "string" ? resource : resource.url);
    } catch (_) {
      return nativeFetch(resource, init);
    }
    if (source.origin !== new URL(config.url).origin) return nativeFetch(resource, init);
    const supported = /^\/(auth|rest|storage|functions|graphql)\/v1(?:\/|$)/.test(source.pathname);
    if (!supported) return nativeFetch(resource, init);
    const bridge = location.origin + "/supabase-bridge" + source.pathname + source.search;
    if (typeof resource === "string") return nativeFetch(bridge, init);
    return nativeFetch(new Request(bridge, resource), init);
  }
});
