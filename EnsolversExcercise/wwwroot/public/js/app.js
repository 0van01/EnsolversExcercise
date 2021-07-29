var activeFolderId = null;
var activeFolderName = null;
var activeUser = null;
let auth0 = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience,
        scope: config.scope
    });
};

const logIn = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
    await auth0.loginWithRedirect({
        redirect_uri: config.redirectUri
    });
};


const logOut = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
    auth0.logout({
        returnTo: config.redirectUri
    });
};


function loadFolderTableData(items) {
    const table = document.getElementById("myFoldersTableBody");
    $("#myFoldersTableBody tr").remove();
    items.forEach(item => {
        let row = table.insertRow();
        let folderName = row.insertCell(0);
        folderName.innerHTML = item.folderName;
        let folderActions = row.insertCell(1);
        item.folderName = escape(item.folderName)
        folderActions.innerHTML = '<button type="button" class="btn btn-link" onclick="selectFolder(' + item.folderId + ')">Select</button><button type="button" class="btn btn-link" onclick="updateFolder(\'' + item.folderName +'\',\''+item.folderId+'\')">Edit</button><button type = "button" class="btn btn-danger" onclick="deleteFolder(' + item.folderId + ')"> Delete</button > ';
    });
}

function showTables(flag) {
    if (!flag) {
        document.getElementById("myFoldersTable").style.visibility = "hidden";
        document.getElementById("myTasksTable").style.visibility = "hidden";
        document.getElementById("folderTitle").style.visibility = "hidden";
        document.getElementById("folderTasks").style.visibility = "hidden";
    }
    else {
        document.getElementById("myFoldersTable").style.visibility = "visible";
        document.getElementById("myTasksTable").style.visibility = "visible";
        document.getElementById("folderTitle").style.visibility = "visible";
        document.getElementById("folderTasks").style.visibility = "visible";
    }
}

function enableFolderCreation(flag) {
    if (!flag) {
        document.getElementById("newFolderName").style.visibility = "hidden";
        document.getElementById("btn-folder").style.visibility = "hidden";
    }
    else {
        document.getElementById("newFolderName").style.visibility = "visible";
        document.getElementById("btn-folder").style.visibility = "visible";
    }
}

function enableTaskCreation(flag) {
    if (!flag) {
        document.getElementById("newTaskName").style.visibility = "hidden";
        document.getElementById("btn-task").style.visibility = "hidden";
        const title = document.getElementById("folderTasks");
        title.innerHTML = "Tasks";
    }
    else {
        document.getElementById("newTaskName").style.visibility = "visible";
        document.getElementById("btn-task").style.visibility = "visible";
    }
}

const selectFolder = async (folderId) => {

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/folders/'+folderId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {
            activeFolderId = folderId;
            activeFolderName = result.folderName;
            updateUI();
        },
        error: function (error) {
            console.log(error);
        }
    });
    
}

const updateFolder = async (folderName, folderId) => {
    let update = prompt("Editing Folder \"" + unescape(folderName) + "\":", unescape(folderName));
    if (update != null && update != "") {

        var folder = {
            folderName: update,
            folderId: parseInt(folderId, 10)
        }

        const access_token = await auth0.getTokenSilently();

        $.ajax({
            url: '/api/UserTasks/folders',
            type: 'PATCH',
            data: JSON.stringify(folder),
            dataType: "json",
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (result) {
                updateUI();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function loadTaskTableData(items) {
    const table = document.getElementById("myTasksTableBody");
    $("#myTasksTableBody tr").remove();
    items.forEach(item => {
        let row = table.insertRow();
        let taskStatus = row.insertCell(0);
        taskStatus.innerHTML = item.status;
        if (item.status)
            taskStatus.innerHTML = '<input type="checkbox" checked="True" onclick="updateTaskStatus(\'' + item.status + "\',\'" + item.taskId + '\')">';
        else
            taskStatus.innerHTML = '<input type="checkbox" onclick="updateTaskStatus(\'' + item.status + "\',\'" + item.taskId + '\')">';
        let taskDescription = row.insertCell(1);
        taskDescription.innerHTML = item.description;
        let taskActions = row.insertCell(2);
        item.description = escape(item.description)
        taskActions.innerHTML = '<button type="button" class="btn btn-link" onclick="updateTask(\'' +item.status+ "\',\'" + item.description + "\',\'"+ item.taskId + '\')">Edit</button><button type = "button" class="btn btn-danger" onclick="deleteTask(\'' + item.taskId + '\')"> Delete</button > ';
    });
}

const updateTaskStatus = async (status, taskId) => {
    if (status == "false")
        status = true;
    else
        status = false;

    var task = {
        status: status,
        taskId: parseInt(taskId, 10)
    }

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/tasks',
        type: 'PATCH',
        data: JSON.stringify(task),
        dataType: "json",
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {
            updateUI();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

const updateTask = async (status,description,taskId) => {
    let update = prompt("Editing Task \"" + unescape(description) +"\":", unescape(description));
    if (update != null && update != "") {
        if (status == "false")
            status = false;
        else
            status = true;
        var task = {
            status: status,
            description: update,
            taskId: parseInt(taskId, 10)
        }

        const access_token = await auth0.getTokenSilently();

        $.ajax({
            url: '/api/UserTasks/tasks',
            type: 'PATCH',
            data: JSON.stringify(task),
            dataType: "json",
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (result) {
                updateUI();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

window.onload = async () => {
    if(auth0 == null)
    await configureClient();

    const query = window.location.search;

    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0.handleRedirectCallback();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/index.html");
    }

    var isAuthenticated = await auth0.isAuthenticated();

    console.log(isAuthenticated);

    if (isAuthenticated) {
        const user = await auth0.getUser();
        user.sub;
        const access_token = await auth0.getTokenSilently();

        $.ajax({
            url: '/api/UserTasks/users/' + user.sub.replace('auth0|', ''),
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (result) {
                activeUser = result.userId;
                updateUI();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    else {
        $("#myTasksTableBody tr").remove();
        $("#myFoldersTableBody tr").remove();
        enableTaskCreation(false);
        enableFolderCreation(false);
        showTables(false);
    }

    document.getElementById("btn-logOut").disabled = !isAuthenticated;
    document.getElementById("btn-logIn").disabled = isAuthenticated;
}

const addFolder = async () => {
    const input = document.getElementById("newFolderName").value;
    var folder = {
        folderName: input,
        userId: activeUser
    }

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/folders',
        type: 'POST',
        data: JSON.stringify(folder),
        dataType: "json",
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {
            updateUI();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

const addTask = async () => {
    const input = document.getElementById("newTaskName").value;
    var task = {
        status: false,
        description: input,
        folderId: activeFolderId
    }

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/tasks',
        type: 'POST',
        data: JSON.stringify(task),
        dataType: "json",
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {
            updateUI();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

const deleteTask = async (taskId) => {

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/tasks/' + taskId,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {
            updateUI();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

const deleteFolder = async (folderId) => {

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/folders/' + folderId,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {
            if (folderId == activeFolderId) {
                $("#myTasksTableBody tr").remove();
                activeFolderId = null;
            }


            updateUI();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();

    if (!isAuthenticated)
        return;

    const access_token = await auth0.getTokenSilently();

    $.ajax({
        url: '/api/UserTasks/folders',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (result) {

            loadFolderTableData(result);

            if (result.length === 0) {
                enableTaskCreation(false);
                return;
            }
             
            enableTaskCreation(true);
            enableFolderCreation(true);
            showTables(true);

            if (activeFolderId == null) {
                activeFolderId = result[0].folderId;
                activeFolderName = result[0].folderName;
            }

            $.ajax({
                url: 'api/UserTasks/tasks/folder/' + activeFolderId,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (result) {
                    const title = document.getElementById("folderTasks");
                    title.innerHTML = unescape(activeFolderName) + " > Tasks";
                    loadTaskTableData(result);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });


 
};

