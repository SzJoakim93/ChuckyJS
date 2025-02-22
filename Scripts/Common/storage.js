function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  function saveData(key, value) {
    if (localStorage) {
      localStorage.setItem(key, value);
    } else {
      setCookie(key, value);
    }
  }

  function loadData(key) {
    if (localStorage) {
      return localStorage.getItem(key);
    } else {
      return getCookie(key);
    }
  }

  function clearData(key) {
    if (localStorage) {
      localStorage.removeItem(key);
    } else {
      document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }