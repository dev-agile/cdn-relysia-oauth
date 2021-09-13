let relysiaAuthWin;

// eslint-disable-next-line no-unused-vars
function RelysiaOAuth (onSuccess, onError, clientKey, clientSecret) {
    if (!onSuccess || !onError || !clientKey || !clientSecret) {
        throw new Error('RelysiaOAuth : missing required params');
    }
    const serverUrl = 'https://relysia-pevyuqi8i-kohze.vercel.app';

    const onAuthResp = async (resp) => {
        if (resp.data.error) {
          onError(resp.data);
        } else {
          try {
            const details = await fetchData(resp.data.accessCode);
            onSuccess(details);
          } catch (error) {
            onError(error);
          }
        }
        relysiaAuthWin.close();
    };

    const fetchData = async (accessCode) => {
        const oAuthData = {
          clientKey,
          code: accessCode,
          clientSecret,
        };
    
        const oAuthRes = await fetch(
          `https://wallet.vaionex.com/v1/oauth/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(oAuthData),
          }
        );
        const jsonOauthRes = await oAuthRes.json();
        return jsonOauthRes;
    }

    const signIn = () => {
        const ssoUrl = `${serverUrl}/auth/login?clientKey=${clientKey}`;
        const SSO_WINDOW_NAME = "auth_window";
    
        const left = (window.screen.width/2)-(800/2);
        const top = (window.screen.height/2)-(800/2);
    
        relysiaAuthWin = window.open(ssoUrl, SSO_WINDOW_NAME, `toolbar=yes,scrollbars=yes,resizable=yes,top=${top},left=${left},width=800,height=800`);
        if (window.addEventListener) {
            window.addEventListener("message", onAuthResp, false);
        }
    };
    signIn();
}
