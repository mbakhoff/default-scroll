'use strict';

(function () {

  console.log('default-scroll activating');
  const scrollEvents = new Set(['scroll', 'mousewheel', 'dommousescroll', 'wheel']);
  let _addEventListener = window.addEventListener;
  let wrapper = function (type, handler) {
    if (type && scrollEvents.has(type.toString().toLowerCase())) {
      console.log('blocked ' + type, handler);
    } else {
      _addEventListener.apply(window, arguments);
    }
  };
  exportFunction(wrapper, window, {defineAs: 'addEventListener'});

})();
