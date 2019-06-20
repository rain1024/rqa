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
    var url = info.pageUrl;
    console.log("hihi");
    var subject = tab.title;
    var description = url;
    chrome.storage.sync.get("options", function (options) {
        console.log(options);
    });
    var redmineUrl = "http://undertheseanlp.com:8181/issues.json?key=f9f1f1aab2831a01ccdbeacbb97271ebd04d0d9a";
    var data = {
        "issue": {
            "project_id": 1,
            "subject": subject,
            "priority_id": 2,
            "description": description
        }
    };
    $.ajax({
        type: "POST",
        url: redmineUrl,
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function (data) {
        console.log(data)
    }).fail(function () {
    });
};

chrome.contextMenus.create({
    title: "Add To Redmine",
    contexts: ["all"],  // ContextType
    onclick: addToRedmine // A callback function
});