var mainController = function($scope, $http) {
    $scope.tasks = [];
    $scope.newTaskBody = "";

    var pushTask = function(task) {
        $scope.tasks.push({"id": task.id, "body": task.body, "done": task.done});
    };

    $http({
        method: 'GET',
        url: '/all'
    }).then(function onSuccess(response) {
        angular.forEach(response.data, function(task) {
            pushTask(task);
        });
    });

    $scope.getDoneCount = function() {
        var count = 0;
        angular.forEach($scope.tasks, function(task) {
            count += task.done ? 1 : 0;
        });
        return count;
    };

    $scope.addNew = function() {
        $http({
            method: 'POST',
            url: '/add',
            data: { body: $scope.newTaskBody }
        }).then(function onSuccess(response) {
            var task = response.data;
            pushTask(task);
        });
        $scope.newTaskBody = '';
    };

    $scope.update = function(task) {
        console.log("update id: " + task.id + " done: " + task.done);
        task.done = !task.done;
        $http.post('/update', { id: task.id, done: task.done });
    };

    $scope.deleteDone = function() {
        var oldTasks = $scope.tasks;
        $scope.tasks = [];
        angular.forEach(oldTasks, function(task) {
            if(!task.done) pushTask(task);
        });
        $http.post('/delete/done');
    }

    $scope.isTaskBodyEmpty = function() {
        return $scope.newTaskBody.length == 0;
    }
};

angular.module('myapp', [])
    .controller('MainController', mainController);
