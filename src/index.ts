import type { StrategyVerifyCallback } from "remix-auth";
import { OAuth2Profile, OAuth2StrategyVerifyParams } from "remix-auth-oauth2";
import { OAuth2Strategy } from "remix-auth-oauth2";

export interface GithubStrategyOptions {
  domain: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export interface GithubExtraParams extends Record<string, string | number> {
  id_token: string;
  scope: string;
  expires_in: 86_400;
  token_type: "Bearer";
}

export interface GithubProfile extends OAuth2Profile {
  avatar_url: string;
  organizations_url: string;
  repos_ur: string;
}
export class Github<User> extends OAuth2Strategy<
  User,
  GithubProfile,
  GithubExtraParams
> {
  name = "github";

  private userInfoURL: string;

  constructor(
    options: GithubStrategyOptions,
    verify: StrategyVerifyCallback<
      User,
      OAuth2StrategyVerifyParams<GithubProfile, GithubExtraParams>
    >
  ) {
    super(
      {
        authorizationURL: `https://${options.domain}/authorize`,
        tokenURL: `https://${options.domain}/oauth/token`,
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL,
      },
      verify
    );

    this.userInfoURL = `https://${options.domain}/userinfo`;
    this.scope = options.scope || "openid profile email";
  }

  protected authorizationParams() {
    const urlSearchParams: Record<string, string> = {
      scope: this.scope,
    };

    return new URLSearchParams(urlSearchParams);
  }
}
