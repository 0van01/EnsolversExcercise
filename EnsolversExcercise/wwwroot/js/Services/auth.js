app.factory('auth', ['$http', function ($http) {

    var auth0 = null;

    fetchAuthConfig = async function () {
        return fetch("/auth_config.json")
    }

    return {

        configureClient: async function () {
            const response = await fetchAuthConfig();
            const config = await response.json();

            auth0 = await createAuth0Client({
                domain: config.domain,
                client_id: config.clientId,
                audience: config.audience,
                scope: config.scope
            });
        },

        logIn: async function () {
            const response = await fetchAuthConfig();
            const config = await response.json();
            await auth0.loginWithRedirect({
                redirect_uri: config.redirectUri
            });
        },


        logOut: async function () {
            const response = await fetchAuthConfig();
            const config = await response.json();
            auth0.logout({
                returnTo: config.redirectUri
            });
        },

        isAuthenticated: async function () {
            return await auth0.isAuthenticated();
        },

        handleRedirectCallback: async function () {
            await auth0.handleRedirectCallback();
        },

        getToken: async function () {
            return await auth0.getTokenSilently();
        }

    }
}])