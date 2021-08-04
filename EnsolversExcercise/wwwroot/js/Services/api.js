app.factory('api', ['$http', 'auth', function ($http, auth) {

    const baseUrl = 'https://localhost:44306/api/UserTasks/';

    var myService = {
        addFolder: async function (folderName) {

            var folder = {
                folderName: folderName,
                userId: 1
            }

            var promise = $http.post(baseUrl + 'folders', JSON.stringify(folder), {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response;
            });

            return promise;
        },
        getFolders: async function () {
            var promise = $http.get(baseUrl + 'folders', {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response.data;
            });

            return promise;
        },
        getFolderTasks: async function (id) {
            var promise = $http.get(baseUrl + 'tasks/folder/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response.data;
            });

            return promise;
        },
        deleteTask: async function (id) {
            var promise = $http.delete(baseUrl + 'tasks/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response.data;
            });

            return promise;
        },
        addTask: async function (folderId, description) {

            var task = {
                status: false,
                description: description,
                folderId: folderId
            }

            var promise = $http.post(baseUrl + 'tasks', JSON.stringify(task),{
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response.data;
            });

            return promise;
        },
        updateTask: async function (taskId, status, description) {

            var task = {
                status: status,
                description: description,
                taskId: taskId
            }

            var promise = $http.patch(baseUrl + 'tasks', JSON.stringify(task), {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response.data;
            });

            return promise;
        },
        deleteFolder: async function (folderId) {
            var promise = $http.delete(baseUrl + 'folders/' + folderId, {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response;
            });

            return promise;
        },
        getTasks: async function () {
            var promise = $http.get(baseUrl + 'tasks/folder/5', {
                headers: {
                    'Authorization': 'Bearer ' + await auth.getToken()
                }
            }).then(function (response) {
                return response.data;
            });

            return promise;
        }
    };

    return myService;
}])