app.controller('MainController', ['$scope', 'auth', 'api', function ($scope, auth, api) {

    $scope.logInlogOutText = "Loading...";
    $scope.selectedFolder = null;

    const logIn = async function () {
        await auth.logIn();
    }

    const logOut = async function () {
        await auth.logOut();
        $scope.isAuthenticated = await auth.isAuthenticated();
    }

    $scope.logInlogOut = async function () {
        if ($scope.isAuthenticated) {
            await logOut();
        }
        else {
            await logIn();
        }
    }

    const updateLogInLogOut = async function () {
        if ($scope.isAuthenticated)
            $scope.logInlogOutText = "Log Out";
        else
            $scope.logInlogOutText = "Log In";

        $scope.$apply();
    }

    $scope.load = async function () {

        const query = window.location.search;

        await auth.configureClient();

        $scope.isAuthenticated = await auth.isAuthenticated();

        if (query.includes("code=") && query.includes("state=")) {
            // Process the login state
            await auth.handleRedirectCallback();

            $scope.isAuthenticated = await auth.isAuthenticated();

            // Use replaceState to redirect the user away and remove the querystring parameters
            window.history.replaceState({}, document.title, "/index.html");





        }

        await updateLogInLogOut();
        await updateUI();
    }

    const updateUI = async function () {

        await api.getFolders().then(function (d) {
            $scope.folders = d;
            $scope.$apply();
        });
    }

    $scope.selectFolder = async function (item) {
        $scope.selectedFolder = item.folderId;

        await api.getFolderTasks(item.folderId).then(function (d) {
            $scope.tasks = d;
            if (d.length === 0)
                alert('No tasks for the selected folder');
            $scope.$apply();
        });
    }

    $scope.addTask = async function () {
        if ($scope.selectedFolder !== null) {
            await api.addTask($scope.selectedFolder, $scope.newTaskDescription).then(function (d) {
                $scope.tasks.push({ status: false, description: $scope.newTaskDescription, folderId: $scope.selectedFolder, taskId: d.taskId });
                $scope.newTaskDescription = '';
                if (d.length === 0)
                    alert('No tasks for the selected folder');
                $scope.$apply();
            });

        }
        else
            alert("Please select a folder");
    }

    $scope.deleteTask = async function (item, index) {
        await api.deleteTask(item.taskId).then(function (d) {
            $scope.tasks.splice(index, 1);
            $scope.$apply();
        })

    }

    $scope.addFolder = async function () {
        await api.addFolder($scope.folderName).then(function (d) {
        });
        $scope.folderName = '';
        await updateUI();
    }

    $scope.deleteFolder = async function (item) {
        await api.deleteFolder(item.folderId).then(function (d) {
        });
        if (item.folderId == $scope.selectedFolder) {
            $scope.selectedFolder = null;
            $scope.tasks = null;
        }

        await updateUI();
    }

    $scope.updateTask = async function (item, index) {
        let update = prompt("Editing Task: " + item.description, item.description);
        if (update != null && update != "") {
            await api.updateTask(item.taskId, item.status, update).then(function (d) {
                $scope.tasks[index].description = update;
                $scope.$apply();
            });
        }
    }

    $scope.updateTaskStatus = async function (item, index) {
        await api.updateTask(item.taskId, !item.status, item.description).then(function (d) {
            $scope.tasks[index].status = !item.status;
            $scope.$apply();
        });
    }
}])