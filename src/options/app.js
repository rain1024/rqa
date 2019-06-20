window.app = angular.module("myApp", ['ui.router']);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state({
            url: '/',
            name: 'config',
            controller: 'ConfigCtrl'
        })
});

app.controller("ConfigCtrl", function ($scope) {

    $scope.fetchIssueData = function (appAPI, token) {
        var data = {};

        var scope = this;
        var url1 = appAPI + "projects.json?key=" + token;
        var ajax1 = $.ajax({
            type: "GET",
            url: url1,
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).success(function (result) {
        });

        var url2 = appAPI + "trackers.json?key=" + token;
        var ajax2 = $.ajax({
            type: "GET",
            url: url2,
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).success(function (result) {
        });

        var url3 = appAPI + "issue_statuses.json?key=" + token;
        var ajax3 = $.ajax({
            type: "GET",
            url: url3,
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).success(function (result) {
        });

        var url4 = appAPI + "/enumerations/issue_priorities.json?key=" + token;
        var ajax4 = $.ajax({
            type: "GET",
            url: url4,
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).success(function (result) {
        });

        return $.when(ajax1, ajax2, ajax3, ajax4).done(function (data1, data2, data3, data4) {

            var projects = data1[0]["projects"];
            projects = _.chain(projects).map(function (item) {
                return _.pick(item, "id", "name");
            }).value();

            var trackers = data2[0]["trackers"];
            trackers = _.chain(trackers).map(function (item) {
                return _.pick(item, "id", "name");
            }).value();

            var statuses = data3[0]["issue_statuses"];
            statuses = _.chain(statuses).map(function (item) {
                return _.pick(item, "id", "name");
            }).value();

            var priorities = data4[0]["issue_priorities"];
            priorities = _.chain(priorities).map(function (item) {
                return _.pick(item, "id", "name");
            }).value();

            $scope.projects = projects;
            $scope.trackers = trackers;
            $scope.statuses = statuses;
            $scope.priorities = priorities;

            console.log("Projects:", projects);
            console.log("Trackers:", trackers);
            console.log("Statuses:", statuses);
            console.log("Priorities:", priorities);
        });
    };

    $scope.fetchIssueConfiguration = function () {
        chrome.storage.sync.get(["issueConfiguration"], function (result) {
            if (_.isEmpty(result)) {
            } else {
                var data = result["issueConfiguration"];
                $scope.defaultProject = data["project"];
                $scope.defaultTracker = data["tracker"];
                $scope.defaultStatus = data["status"];
                $scope.defaultPriority = data["priority"];
            }
            $scope.$apply();

        })
    };

    $scope.saveAppConfiguration = function () {
        chrome.storage.sync.set({"appConfiguration": $scope.appConfiguration});
        $scope.showStep2 = true;
        $scope.loadData();
    };

    $scope.loadData = function () {
        $scope.fetchIssueData($scope.appConfiguration.url, $scope.appConfiguration.token).then(function () {
            $scope.fetchIssueConfiguration();
        });
    };

    $scope.resetConfig = function () {
        chrome.storage.sync.remove(["appConfiguration", "issueConfiguration"]);
        $scope.appConfiguration = {};
        $scope.issueConfiguration = {};
         $scope.showStep2 = false;
    };

    $scope.init = function () {
        chrome.storage.sync.get(["appConfiguration"], function (result) {
            if (_.isEmpty(result)) {
                $scope.appConfiguration = {
                    "url": "",
                    "token": ""
                }
            } else {
                $scope.appConfiguration = result["appConfiguration"];
                $scope.showStep2 = true;
                $scope.loadData();
                $scope.$apply();
            }
        });
    }();

    $scope.saveConfiguration = function () {
        $scope.issueConfiguration = {
            "project": $scope.defaultProject,
            "tracker": $scope.defaultTracker,
            "status": $scope.defaultStatus,
            "priority": $scope.defaultPriority
        };
        chrome.storage.sync.set({"issueConfiguration": $scope.issueConfiguration}, function () {
            console.log($scope.issueConfiguration);
        });
    };
});