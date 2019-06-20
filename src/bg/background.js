// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.pageAction.show(sender.tab.id);
        sendResponse();
    });

var options = {
    "redmineUrl": "http://undertheseanlp.com:8181/issues.json?key=f9f1f1aab2831a01ccdbeacbb97271ebd04d0d9a"
};

chrome.storage.sync.set({"options": options}, function () {
});

chrome.browserAction.onClicked.addListener(function (tab) {
    var newURL = "src/options/index.html";
    chrome.tabs.create({url: newURL});
});

addToRedmine = function (info, tab) {
    chrome.storage.sync.get(["appConfiguration", "issueConfiguration"], function (result) {
        if (!_.isEmpty(result)) {
            if (!_.has(result, "appConfiguration") || !_.has(result, "issueConfiguration")) return;
            var appConfiguration = result["appConfiguration"];
            if (!_.has(appConfiguration, "url") || !_.has(appConfiguration, "token")) return;

            var issueConfiguration = result["issueConfiguration"];
            var apiUrl = appConfiguration["url"] + "issues.json?key=" + appConfiguration["token"];
            var currentUrl = info.pageUrl;
            var subject = tab.title;
            var description = currentUrl;
            var issue = {
                "subject": subject,
                "description": description
            };
            try {
                issue["project_id"] = issueConfiguration["project"]["id"];
            } catch (e) {
                return
            }
            try {
                issue["priority_id"] = issueConfiguration["priority"]["id"];
            } catch (e) {
            }
            try {
                issue["tracker_id"] = issueConfiguration["tracker"]["id"];
            } catch (e) {
            }
            try {
                issue["status_id"] = issueConfiguration["status"]["id"];
            } catch (e) {
            }

            var data = {"issue": issue};
            $.ajax({
                type: "POST",
                url: apiUrl,
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function (data) {
                console.log(data)
            }).fail(function () {
            });
        }
    });

};

chrome.contextMenus.create({
    title: "Add To Redmine",
    contexts: ["all"],  // ContextType
    onclick: addToRedmine // A callback function
});