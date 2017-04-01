var triptracking = {
    domain_name: "",
    ac_id: "",
    trafic_information: {},

    fb_settings: {
        apiKey: "AIzaSyBGQzoa71pbK86BcrYhIhAvLsgSuOlPY9M",
        authDomain: "triptracking-9a432.firebaseapp.com",
        databaseURL: "https://triptracking-9a432.firebaseio.com",
        storageBucket: "triptracking-9a432.appspot.com",
        messagingSenderId: "778722054156"
    },

    form_validation_errors: [],

    setup: function (ac_id, form_id) {
        var self = this;
        self.domain_name = window.location.host;
        self.ac_id = ac_id;
        firebase.initializeApp(self.fb_settings);

        var date = new Date();
        var fr_date = date.getUTCFullYear().toString() + ((date.getUTCMonth() < 9) ? '0' + (date.getUTCMonth() + 1).toString() : (date.getUTCMonth() + 1).toString()) + ((date.getUTCDate() < 10) ? '0' + date.getUTCDate().toString() : date.getUTCDate().toString());
        var session = this.crumbleCookie()['FirstSession'];

        if (typeof session == 'undefined') {
            this.writeLogic('FirstSession');
        } else {
            this.writeLogic('ReturningSession');
        }

        if (form_id) {
            this.addAttributesToForm(form_id);
        }


        self.getAllForms();
    },


    // Adicionar attributos triptracking to forms
    addAttributesToForm: function (form_id) {
        forms = document.getElementsByClassName('triptracking');
        for (i = 0; i < forms.length; i++) {
            forms[i].setAttribute('data-triptracking-id', form_id);
        }
    },


    /*
    Pega todos os formulários da página de contiverem
    a class triptracking e cria um atributo data-triptracking-id.
    */
    getAllForms: function () {
        var self = this;
        $("form.triptracking").each(function (form) {
            var triptracking_id = $(this).attr('data-triptracking-id');
            var $form = $(this);
            $(this).find('input[type=submit]').on('click', function (e) {
                var button = $(this);
                button.attr('disabled', true);
                var current_form_values = $form.serializeArray();
                e.preventDefault();
                self.onSubmited(triptracking_id, current_form_values).then(function (value) {
                    if (value == true) {
                        $form.submit();
                        setTimeout(function () {
                            var location = $form.find('input[name=redirect_to]').val();
                            if (location != null) {
                                window.location.href = location;
                            }
                        }, 1000);

                    } else {
                        button.attr('disabled', false);
                        return false;
                    }
                })
            });
        })
    },


    /*
    Chamado quando o botão do formulário for clicado
    @triptracking_id = Id do formulário à ser pesquisado no db
    @current_for_values = Campos do formulário já serializados
    */
    onSubmited: function (triptracking_id, current_form_values) {
        var self = this;
        return self.getAllPermissibleFields(triptracking_id).then(function (formSnapshot) {
            var $formFields = formSnapshot;
            if (self.validateForm($formFields, current_form_values)) {
                return self.createPerson(current_form_values, triptracking_id).then(function (value) {
                    return true;
                })
            } else {
                return false;
            }
        })
    },



    /*
    Valida se os campos do formulário são permissíveis
    conforme a função getAllPermissibleFields e depois valida a
    presensa de dados
    @formSnapshot = campos do formulário permitidos vindos do db
    @elm = todos os campos do formulário da página do site
    */
    validateForm: function (formSnapshot, elm) {
        var self = this;
        var err_count = 0;

        var input_names = [];
        formSnapshot.forEach(function (snap) {
            input_names.push(snap.val().name);
        });

        elm.forEach(function (elms) {
            var has_input = input_names.filter(function (input) {
                return input === elms["name"];
            })
            if (has_input.length < 1) {
                if (elms["name"].indexOf('_wp') < 0) {
                    if (elms["name"].indexOf('redirect_to') < 0) {
                        err_count += 1;
                    }
                }
            } else {
                if (elms["value"].length < 1) {
                    console.log("In the value: " + elms["name"] + " ==> " + elms["value"]);
                    err_count += 1;
                }
            }
        });

        if (err_count > 0) {
            return false;
        } else {
            return true;
        }
    },

    /*
    Cria uma nova pessoa no banco de dados se essa não existir;
    @form_data = Todos os campos do formulário já serializados
    @form_id = id do formulário compátivel com um id do db;
    */
    createPerson: function (form_data, form_id) {
        var self = this;
        var person_data = {};
        form_data.forEach(function (data) {
            if (data["name"].indexOf('person') > -1) {
                if (data["name"].indexOf('nome') > -1) {
                    person_data[data["name"].replace('name', 'nome')] = data["value"];
                } else {
                    person_data[data["name"]] = data["value"];
                }
            }
        })



        var personRef = firebase.database().ref().child('/people/');
        return personRef.orderByChild("email").equalTo(person_data["person_email"]).limitToFirst(1).once('value').then(function (snap) {
            if (snap.numChildren() > 0) {
                snap.forEach(function (person) {
                    self.createLead(person.key, form_data, form_id).then(function (value) {
                        return value;
                    });
                })
            } else {
                var object_stringify = JSON.stringify(person_data);
                Object.keys(person_data).forEach(function (key) {
                    object_stringify = object_stringify.replace(key, key.replace('person_', ''));
                });
                person_data = JSON.parse(object_stringify);
                var newPersonKey = personRef.push().key;
                personRef.child(newPersonKey).update(person_data);
                self.createLead(newPersonKey, form_data, form_id).then(function (value) {
                    return value;
                })
            }
        });
    },

    /*
    Montagem e criação do lead

    @personKey = id da pessoa para o lead;
    @form_data = todos os campos do formulário serializados
    @formKey = id do formulário encontrado no db
    */
    createLead: function (personKey, form_data, formKey) {
        var self = this;
        var lead_data = {};
        lead_data["data"] = {};
        form_data.forEach(function (data) {
            if (data["name"].indexOf('person') < 0) {
                if (data["name"].indexOf('_wp') < 0) {
                    if (data["name"].indexOf('redirect_to') < 0) {
                        lead_data["data"][data["name"]] = data["value"];
                    }
                }
            }
        });

        lead_data["personKey"] = personKey;
        lead_data["formKey"] = formKey;
        lead_data["status"] = 0;

        self.getTrafficSource('ReturningSession', window.location.href);
        lead_data["data"]["analytics"] = { url: window.location.href, page_title: document.title };
        lead_data["data"]["analytics"]["trafic_info"] = self.trafic_information;

        var leadRef = firebase.database().ref().child('/leads/' + self.ac_id);
        return leadRef.push(lead_data).then(function (response) {
            return true;
        });
    },

    /* 
    Busca todos os campos permitidos do formulário selecionado
    @form_id = Id do formulário buscado no db;
    */
    getAllPermissibleFields: function (form_id) {
        var self = this;
        return firebase.database().ref().child('/formFields/' + form_id).once('value');
    },


    crumbleCookie: function (a) {
        for (var d = document.cookie.split(";"), c = {}, b = 0; b < d.length; b++) {
            var e = d[b].substring(0, d[b].indexOf("=")).trim(),
                i = d[b].substring(d[b].indexOf("=") + 1, d[b].length).trim();
            c[e] = i
        }
        if (a) return c[a] ? c[a] : null;
        return c
    },



    bakeCookie: function (a, d, c, b, e, i) {
        var j = new Date;
        j.setTime(j.getTime());
        c && (c *= 864E5);
        j = new Date(j.getTime() + c);
        document.cookie = a + "=" + escape(d) + (c ? ";expires=" + j.toGMTString() : "") + (b ? ";path=" + b : "") + (e ? ";domain=" + e : "") + (i ? ";secure" : "")
    },


    writeLogic: function (n) {
        var a = this.getTrafficSource(n, this.domain_name); //Insert your domain here

        a = a.replace(/\|{2,}/g, "|");
        a = a.replace(/^\|/, "");
        a = unescape(a);

        this.bakeCookie(n, a, 182, "/", "", "")
    },

    getParam: function (s, q) {
        try {
            var match = s.match('[?&]' + q + '=([^&]+)');
            return match ? match[1] : '';
            //        return s.match(RegExp('(^|&)'+q+'=([^&]*)'))[2];
        } catch (e) {
            return '';
        }
    },

    calculateTrafficSource: function () {
        var source = '',
            medium = '',
            campaign = '',
            term = '',
            content = '';
        var search_engines = [
            ['bing', 'q'],
            ['google', 'q'],
            ['yahoo', 'q'],
            ['baidu', 'q'],
            ['yandex', 'q'],
            ['ask', 'q']
        ]; //List of search engines
        var ref = document.referrer;
        ref = ref.substr(ref.indexOf('//') + 2);
        ref_domain = ref;
        ref_path = '/';
        ref_search = '';

        var url_search = document.location.search;

        if (url_search.indexOf('utm_source') > -1) {
            source = this.getParam(url_search, 'utm_source');
            medium = this.getParam(url_search, 'utm_medium');
            campaign = this.getParam(url_search, 'utm_campaign');
            term = this.getParam(url_search, 'utm_term');
            content = this.getParam(url_search, 'utm_content');
        } else if (this.getParam(url_search, 'gclid')) {
            source = 'google';
            medium = 'cpc';
            campaign = '(not set)';
        } else if (ref) {

            if (ref.indexOf('/') > -1) {
                ref_domain = ref.substr(0, ref.indexOf('/'));
                ref_path = ref.substr(ref.indexOf('/'));
                if (ref_path.indexOf('?') > -1) {
                    ref_search = ref_path.substr(ref_path.indexOf('?') + 1);
                    ref_path = ref_path.substr(0, ref_path.indexOf('?'));
                }
            }
            medium = 'referral';
            source = ref_domain;

            for (var i = 0; i < search_engines.length; i++) {
                if (ref_domain.indexOf(search_engines[i][0]) > -1) {
                    medium = 'organic';
                    source = search_engines[i][0];
                    term = this.getParam(ref_search, search_engines[i][1]) || '(not provided)';
                    break;
                }
            }
        }

        return {
            'source': source,
            'medium': medium,
            'campaign': campaign,
            'term': term,
            'content': content
        };
    },

    getTrafficSource: function (cookieName, hostname) {
        var trafficSources = this.calculateTrafficSource();
        var source = trafficSources.source.length === 0 ? 'direct' : trafficSources.source;
        var medium = trafficSources.medium.length === 0 ? 'none' : trafficSources.medium;
        var campaign = trafficSources.campaign.length === 0 ? 'direct' : trafficSources.campaign;
        // exception
        if (medium === 'referral') {
            campaign = '';
        }
        var rightNow = new Date();
        var value = 'source=' + source +
            '&medium=' + medium +
            '&campaign=' + campaign +
            '&term=' + trafficSources.term +
            '&content=' + trafficSources.content +
            '&date=' + rightNow.toISOString().slice(0, 10).replace(/-/g, "");

        this.trafic_information = {
            source: source,
            medium: medium,
            campaign: campaign,
            term: trafficSources.term,
            content: trafficSources.content,
        }
        return value;
    },
}