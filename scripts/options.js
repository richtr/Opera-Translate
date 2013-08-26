opera.isReady(function() {
  var attributeNameMap = window["attributeNameMap"] = {
    'className': 'className',
    'for': 'htmlFor',
    html: 'innerHTML',
    text: 'textContent'
  };
  var CustomDOMElement = window["CustomDOMElement"] = {
    create: function(tag, props, children) {
      var el = document.createElement(tag);
      if (props) {
        CustomDOMElement.setAttributes(el, props);
      }
      if (children) {
        for (var i = 0, l = children.length; i < l; i += 1) {
          el.appendChild(children[i]);
        }
      }
      return el;
    },
    setAttributes: function(el, props) {
      for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
          var name = attributeNameMap[prop],
              value = props[prop];
          if (value) {
            if (name) {
              el[name] = value;
            } else {
              el.setAttribute(prop, value);
            }
          }
        }
      }
    }
  };
  window.addEventListener('DOMContentLoaded', function() {
    var storage = widget.preferences;

    function optionChanged(e) {
      var element = e.currentTarget;
      var name = element.id;
      var value = element.value;
      storage.setItem(name, value);
    }
    if (storage.getItem('autoPrompt') === '1') {
      document.getElementById('autoPromptOff').checked = 'checked';
    } else {
      document.getElementById('autoPromptOn').checked = 'checked';
    }
    if (storage.getItem('autoTranslate') === '1') {
      document.getElementById('autoTranslateOn').checked = 'checked';
    } else {
      document.getElementById('autoTranslateOff').checked = 'checked';
    }
    if (storage.getItem('https') === '1') {
      document.getElementById('httpsOff').checked = 'checked';
    } else {
      document.getElementById('httpsOn').checked = 'checked';
    }
    var optList = document.getElementById('optionsList');
    var homeLangSelect = document.getElementById( 'homeLang' ),
        browserLang = window.navigator.language,
        homeLang = storage.getItem( 'homeLang' ) ||
                    ( NAME_MAP[ browserLang ] ? browserLang : 'en' );
                    
    var headEl = document.getElementsByTagName('head')[0];
                    
    // Add localization file
    var i18nLangScript = document.createElement('script');
    i18nLangScript.type = "text/javascript";
    i18nLangScript.setAttribute("charset", "UTF-8");
    i18nLangScript.src = "/locales/" + homeLang + "/messages.js";

    i18nLangScript.onload = i18nLangScript.onerror = function() {

      var i18nScript = document.createElement('script');
      i18nScript.type = "text/javascript";
      i18nScript.setAttribute("charset", "UTF-8");
      i18nScript.src = "/scripts/i18n.js";

      i18nScript.onload = function() {
        
        var inlineOptsScript = document.createElement('script');
        inlineOptsScript.type = "text/javascript";
        inlineOptsScript.setAttribute("charset", "UTF-8");
        inlineOptsScript.src = "/scripts/options.inline.js";
        inlineOptsScript.onload = function() {
          // Display page
          document.body.style.display = "block";
        }
        headEl.appendChild(inlineOptsScript);
        
        var homeLangOptions = document.createDocumentFragment();
        var optListOptions = document.createDocumentFragment();

        homeLangOptions.appendChild( CustomDOMElement.create( 'option', {
          text: "System Default - " + (NAME_MAP[ browserLang ] ? NAME_MAP[ browserLang ] : 'English'),
          value: "system",
          selected: storage.getItem( 'homeLang' ) === null ? 'selected' : null
        }) );

        for (var lang in NAME_MAP) {
          var pref = storage.getItem(lang) || 'always',
              language = NAME_MAP[lang];

          homeLangOptions.appendChild( CustomDOMElement.create( 'option', {
            text: language,
            value: lang,
            selected: homeLang === lang && storage.getItem( 'homeLang' ) !== null ? 'selected' : null
          }) );

          var optionsSelect, langSettings = CustomDOMElement.create('fieldset', null, [CustomDOMElement.create('label', {
            text: language,
            className: 'optionlabel'
          })]);
          if (homeLang == lang) {
            optionsSelect = CustomDOMElement.create('span', {
              style: 'padding:0px 20px;'
            }, [CustomDOMElement.create('a', {
              className: 'optionnote',
              text: 'Default Language',
              href: '#homeLang'
            })]);
          } else {
            optionsSelect = CustomDOMElement.create('select', {
              id: lang
            }, [CustomDOMElement.create('option', {
              text: i18nlib.translate('translateAlwaysOption'),
              value: 'always',
              selected: (pref === 'always') ? 'selected' : null
            }), CustomDOMElement.create('option', {
              text: i18nlib.translate('translateNeverOption'),
              value: 'never',
              selected: (pref === 'never') ? 'selected' : null
            })]);
            optionsSelect.addEventListener('change', optionChanged, true);
          }
          langSettings.appendChild(optionsSelect);
          optListOptions.appendChild(langSettings);
        }
        homeLangSelect.appendChild( homeLangOptions );
        optList.appendChild(optListOptions);

        homeLangSelect.addEventListener( 'change', function() {
          opera.extension.postMessage({
            action: 'setHomeLang',
            data: homeLangSelect.value
          });
          window.setTimeout(function() {
            document.location.reload(true);
          }, 100);
        }, false );
        
      };
      
      headEl.appendChild(i18nScript);
      
    };
    
    headEl.appendChild(i18nLangScript);
    
    document.getElementById('clearPreferences').addEventListener('click', function() {
      opera.extension.postMessage({
        action: 'resetPreferences'
      });
    }, false);
    document.getElementById('blanketPreferences').addEventListener('click', function() {
      opera.extension.postMessage({
        action: 'blanketPreferences',
        data: {
          value: 'always'
        }
      });
    }, false);
    document.getElementById('blanketPreferencesOff').addEventListener('click', function() {
      opera.extension.postMessage({
        action: 'blanketPreferences',
        data: {
          value: 'never'
        }
      });
    }, false);
    document.getElementById('autoPromptOn').addEventListener('change', function() {
      storage.setItem('autoPrompt', '0');
    }, false);
    document.getElementById('autoPromptOff').addEventListener('change', function() {
      storage.setItem('autoPrompt', '1');
    }, false);
    document.getElementById('autoTranslateOn').addEventListener('change', function() {
      storage.setItem('autoTranslate', '1');
    }, false);
    document.getElementById('autoTranslateOff').addEventListener('change', function() {
      storage.setItem('autoTranslate', '0');
    }, false);
    document.getElementById('httpsOn').addEventListener('change', function() {
      storage.setItem('https', '0');
    }, false);
    document.getElementById('httpsOff').addEventListener('change', function() {
      storage.setItem('https', '1');
    }, false);
    opera.extension.addEventListener('message', function(msg) {
      if (msg.data.action === 'preferencesReset') {
        window.location.reload();
      }
    }, false);
  }, false);
});
