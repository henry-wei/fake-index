function getNetworkContentBy(network) {
  if (!network) return '';
  const sign = network.good ? 'check' : 'exclamation'; // TODO: fix sign

  return `<div class="network">
            <div class="network-status">
              <i class="fas fa-${sign}-circle"></i>
            </div>
            <div>
              <p class="network-name">${network.ssid}</p>
              <p class="network-info">${network.info}</p>
            </div>
          </div>`;
}

function initNetworks() {
  if (!window.webViewResolver) return;
  const wifiSecurity = window.webViewResolver.resolve('wifiSecurity');
  if (!wifiSecurity) return;

  wifiSecurity.getWifiHistory().then((wifiList) => {
    if (!$.isEmptyObject(wifiList)) {
      $('.network-history').collapse('show');
    }
    wifiList.forEach((element) => {
      $('#networks').append(getNetworkContentBy(element));
    });
  });
}

$(() => {
  loadStrings('WifiSecurity');
  RegisterDataAttributes();
  RegisterMetricEvents();

  $('#toggle').change(() => {
    $('#toggle-text').text($('#toggle').is(':checked') ? 'On' : 'Off');
  });
  $('.more-text').hide(); // hide more text

  // set toggle button
  if (!window.webViewResolver) return;
  const wifiSecurity = window.webViewResolver.resolve('wifiSecurity');
  if (!wifiSecurity) return;

  let isEnableWifisecurity = false;
  wifiSecurity.getWifiSecurityUserPreferenceAsync().then((val) => {
    isEnableWifisecurity = val;
    //display wifisecurity info
    $('#toggle').prop('checked', isEnableWifisecurity);

    //get loaction service state and decide whether to show location service userguid
    var locationService = window.webViewResolver.resolve('LocationServiceAgent');
    if (locationService) {
      locationService.getLocationServiceStatus().then((re) => {
        //if location service is off but wifi security is on
        //show message to guider user to enable location service 
        if (re != "1" && isEnableWifisecurity) {
          locationService.callConfirmationDlg("We've noticed that you have disabled your location services for Lenovo Vantage. To use the Lenovo WiFi Security feature, you need to enable location services for Lenovo Vantage and Lenovo WiFi Security.");
        }
      });
    }

    $('#toggle').click(() => {
      wifiSecurity.setWifiSecurityUserPreferenceAsync(!isEnableWifisecurity).then((re) => {
        if (re) {
          isEnableWifisecurity = !isEnableWifisecurity;
        } else {
          $('#toggle').prop('checked', isEnableWifisecurity);
        }
      });
    });
  });

  initNetworks();

  wifiSecurity.isToolbarEnabledAsync().then((enabled) => {
    if (!enabled.valueOf()) $('#toolbar').collapse('show');
  });
});

function showMore() {
  $('.more-text').show();
  $('#show-more').hide();
}

function showLess() {
  $('.more-text').hide();
  $('#show-more').show();
}

function addFakeNetwork() {
  const network = {
    good: Math.random() >= 0.5,
    ssid: 'Lorem Ipsum',
    info: 'What is Lorem Ipsum?',
  };

  $('#networks').append(getNetworkContentBy(network));
}
