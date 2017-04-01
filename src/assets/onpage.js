(function(where_load, where_place, type, file, method_name, action, element) {
    action = where_place.createElement(type),
        element = document.getElementsByTagName(type)[0];
    action.type = 'text/javascript';
    action.async = false;
    action.src=file;
    element.parentNode.insertBefore(action, element);
    action.onload = function() {
        method_name = where_load['triptracking'];
        where_load.method_name.setup('dominio', 'account_id', 'form_id');
    }
})(window, document, 'script', 'http://www.tripdigital.com.br/demos/triptracking/triptracking.js', 'triptracking');

