opera.isReady(function() {
  (function() {
    var storage = widget.preferences;
    var browserLang = window.navigator.language;
    var homeLang = storage.getItem( 'homeLang' ) ||
        ( NAME_MAP[ browserLang ] ? browserLang : 'en' );
    
    var scandiSuffixes = {
      "da": "dk",
      "sv": "se",
      "no": "no"
    };

    var TranslateButton = function() {
      var isOEX = opera.contexts && opera.contexts.toolbar ? true : false;
      var translateButtonProperties = {
        disabled: false,
        title: "Translate this page",
        icon: "/icons/19x19.png"
      };
      var translateButton = isOEX ? opera.contexts.toolbar.createItem(translateButtonProperties) : null;

      return {
        show: function(source, language) {
          if(isOEX) {
            translateButton.addEventListener('click', function(evt) {
              /*var selectedTab = opera.extension.tabs.getSelected();
              if(selectedTab !== source) return;*/
              source.postMessage({
                action: 'showTranslateBar',
                data: {
                  homeLang: homeLang,
                  pageLang: language,
                  autoTranslate: storage.getItem('autoTranslate') || '0'
                }
              });
              opera.contexts.toolbar.removeItem(translateButton);
            }, false);
            opera.contexts.toolbar.addItem(translateButton);
          } else {
            chrome.pageAction.onClicked.addListener(function(tab) {
              if(tab.id !== source.tabId) return;
              try {
                source.postMessage({
                  action: 'showTranslateBar',
                  data: {
                    homeLang: homeLang,
                    pageLang: language,
                    autoTranslate: storage.getItem('autoTranslate') || '0'
                  }
                });
              } catch(e) {}
              chrome.pageAction.hide(source.tabId);
            });
            chrome.pageAction.show(source.tabId);
          }
        }
      }
    };
    var translateButton = new TranslateButton();

    var actions = {
      detectLanguage: function(data, source) {
        if (data.protocol === 'https:' && storage.getItem('https') === '1') {
          return;
        }
        guessLanguage.detect(data.text, function(language) {
          language = language || browserLang;

          // Manual fix for Scandic domains since the language detector often mixes them up
          if (scandiSuffixes[language]) {
            for (var suffix in scandiSuffixes) {
              if (data.host.indexOf("." + scandiSuffixes[suffix]) ==
                    data.host.length - ((scandiSuffixes[suffix] + "").length + 1)) {
                language = suffix;
                break;
              }
            }
          }

          var langPref = storage.getItem(language) || 'always';
          if (language !== homeLang) {

            if(storage.getItem('autoPrompt') == '1') { // show manual tranalation button

              translateButton.show(source, language);

            } else { // do auto translation

              if (langPref !== 'never' && language !== 'unknown') {

                source.postMessage({
                  action: 'showTranslateBar',
                  data: {
                    homeLang: homeLang,
                    pageLang: language,
                    autoTranslate: storage.getItem('autoTranslate') || '0'
                  }
                });

              }

            }

          }
        });
      },
      resetPreferences: function(data, source) {
        for(var item in storage) {
          if(item !== 'initialized') {
             storage.removeItem(item);
          }
        }
        source.postMessage({
          action: 'preferencesReset'
        });
        homeLang = NAME_MAP[browserLang] ? browserLang : 'en';
      },
      blanketPreferences: function(data, source) {
        for (var lang in NAME_MAP) {
          storage.setItem(lang, data.value);
        }
        source.postMessage({
          action: 'preferencesReset'
        });
      },
      setHomeLang: function ( data, source ) {
        if(data === "system") {
          homeLang = NAME_MAP[ browserLang ] ? browserLang : 'en';
          storage.removeItem('homeLang');
        } else {
          homeLang = data;
          storage.setItem( 'homeLang', data );
        }
      },
      disableLang: function ( data, source) {
        storage.setItem(data.lang, 'never');
      }
    };
    window.addEventListener('load', function() {
      
      // Open the options page on first run
      if(storage.getItem('initialized') !== '1') {
        opera.extension.tabs.create({url: '/options.html?firstRun', focused: true});
        storage.setItem('initialized', '1');
      }
      
      opera.extension.addEventListener('message', function(msg) {
        if(actions[msg.data.action]) {
          actions[msg.data.action](msg.data.data, msg.source);
        } else {
          opera.postError("No background action: " + msg.data.action);
        }
      }, false);
    }, false);
  }());
});
