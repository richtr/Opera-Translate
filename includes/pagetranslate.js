opera.isReady(function() {
  (function(window, undefined) {

    if (window.location !== window.parent.location) {
      return;
    }

    var document = window.document;
    var invalidElements = {
      'APPLET': 1,
      'AREA': 1,
      'BASE': 1,
      'BR': 1,
      'COL': 1,
      'B': 1,
      'HR': 1,
      'IMG': 1,
      'INPUT': 1,
      'IFRAME': 1,
      'ISINDEX': 1,
      'LINK': 1,
      'NOFRAMES': 1,
      'NOSCRIPT': 1,
      'META': 1,
      'OBJECT': 1,
      'PARAM': 1,
      'SCRIPT': 1,
      'STYLE': 1,
      'SELECT': 1
    };

    function isValidContentType() {
      var pageMime = (document.contentType || "text/html").split("/");
      if (pageMime[1] !== 'html' && pageMime[1] !== 'xml') return false;
      return true;
    }

    function getRootNode() {
      var host = window.location.host;
      switch (host) {
      case 'twitter.com':
        return document.querySelector(".js-tweet-text");
        break;
      case 'github.com':
        return document.querySelector(".announce");
        break;
      case 'bitbucket.org':
        return document.querySelector("#wiki");
        break;
      }
      return null;
    }

    function getIterator(root) {
      var NodeFilter = window.NodeFilter,
          Node = window.Node,
          target = root || document.body;
      return document.createNodeIterator(target, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (/^\s*$/.test(node.textContent) || node.parentNode.nodeType !== Node.ELEMENT_NODE || node.isChunked) {
            return NodeFilter.FILTER_REJECT;
          }
          while ((node = node.parentNode) !== target) {
            var tag = node ? node.nodeName : 'SCRIPT';
            if (invalidElements[tag]) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);
    }

    function getAnalysisText(target) {
      var iterator = getIterator(target),
          textnode, analysisText = "";
      while ((textnode = iterator.nextNode())) {
        analysisText += textnode.data + ". ";
        if (analysisText.length >= 4096) {
          break;
        }
      }
      return analysisText;
    }

    function cleanUpExistingTranslateBars() {
      var tracesFound = false;
      // Remove existing Google Translate scripts (if any)
      var translateScriptEls = document.querySelectorAll('script[src*="//translate.google.com/"]');
      for (var i = 0; i < translateScriptEls.length; ++i) {
        tracesFound = true;
        translateScriptEls[i].parentNode.removeChild(translateScriptEls[i]);
      }
      // Remove existing Google Translate elements (if any)
      var translateEls = document.querySelectorAll('*[class~="skiptranslate"]');
      for (var i = 0; i < translateEls.length; ++i) {
        tracesFound = true;
        translateEls[i].parentNode.removeChild(translateEls[i]);
      }
      // <body> style re-adjustment
      if(tracesFound) {
        var bodyEl = document.querySelector('BODY');
        var topVal = parseInt(bodyEl.style.top || 0, 10) - 40; // remove '40px'
        bodyEl.style.top = (topVal > 0 ? topVal : 0) + "px";
      }
    }

    function loadNewTranslateBar(homeLanguage, pageLanguage, autoTranslate) {

      cleanUpExistingTranslateBars();

      var head = document.querySelector('HEAD');
      var body = document.querySelector('BODY');
      var autoTranslateStr = autoTranslate === '1' ? "true" : "false";
      var uid = Math.floor(Math.random() * 1e16);

      var extensionScript;
      extensionScript = document.createElement('script');
      extensionScript.type = "text/javascript";
      extensionScript.className = "skiptranslate"; // set for removal on translation cancellation
      extensionScript.textContent =
        ["function googleTranslateElementInit" + uid + "() {",
         '  var elem = new google.translate.TranslateElement({',
         '    pageLanguage: "' + pageLanguage + '", ',
         '    layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,',
         '    autoDisplay: false,',
         '    floatPosition: 0',
         '  });',
         '  elem.onTurnOffLanguageClick = function() {',
         '    var event = document.createEvent("Event");',
         '    event.initEvent("te_disable_lang", true, true);',
         '    document.body.dispatchEvent(event);',
         '  };',
         '  elem.showBanner(' + autoTranslateStr + ');',
         '}'
        ].join('\n');
      body.appendChild(extensionScript);

      document.body.addEventListener('te_disable_lang', function(e) {
        opera.extension.postMessage({
          action: 'disableLang',
          data: {
            lang: pageLanguage
          }
        });
      }, false);

      var translateElementScript = document.createElement('script');
      translateElementScript.type = "text/javascript"
      translateElementScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' + uid + '&hl=' + homeLanguage;
      body.appendChild(translateElementScript);
    }

    opera.extension.addEventListener('message', function(message) {
      var data = message.data.data;
      switch (message.data.action) {
      case 'showTranslateBar':
        loadNewTranslateBar(data.homeLang, data.pageLang, data.autoTranslate);
        break;
      }
    }, false);

    document.addEventListener('DOMContentLoaded', function() {
      if(window.location.hostname === "translate.google.com") return;
      if (!isValidContentType()) return;
      var rootTranslateNode = getRootNode();
      var analysisText = getAnalysisText(rootTranslateNode);
      if (!rootTranslateNode) {
        if (!analysisText || analysisText.length < 1000) return;
      }
      opera.extension.postMessage({
        action: 'detectLanguage',
        data: {
          text: analysisText,
          protocol: window.location.protocol,
          host: window.location.hostname
        }
      });
    }, false);

  }(window));

});
