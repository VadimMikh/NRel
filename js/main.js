function app() {
    // Declaring Class
    function Apdex() {
        this.enterPoint = document.getElementById('access-point');
        this.url = './host-app-data.json';
        this.tempObj = {};
        this.hosts = [];
        this.devidedObjects = [];
        this.readyObject = [];
    }

    // Creating constructor
    Apdex.prototype = {
        constructor: Apdex,

        // Initialization method <object>
        getTopAppsByHost: function () {
            var xhr = new XMLHttpRequest(),
                that = this;
            xhr.open('GET', this.url, true);
            xhr.send();

            return xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    that.enterPoint.innerHTML = '<div class="not_found">Data not found</div>'
                } else {
                    that.tempObj = JSON.parse(xhr.responseText);
                    that._defineHosts();
                }
            };
            this.enterPoint.innerHTML = 'Loading...';
        },

        // Defining all hosts <string[]>
        _defineHosts: function () {
            var that = this,
                arr = this.tempObj;
            arr.forEach(function (item) {
                var hosts = item.host;
                for (var i = 0; i <= hosts.length; i++) {
                    if (that.hosts.indexOf(hosts[i]) === -1 && hosts[i] !== undefined) that.hosts.push(hosts[i]);
                }
            });
            this._devideHost(arr, this.hosts);
        },

        // Creating new objects by for every host <object[]>
        _devideHost: function (arr, hosts) {
            var hostList = hosts,
                objArray = [];

            for (var i = 1; i < hostList.length; i++) {
                var name = hostList[i];
                var obj = {
                    hostName: name,
                    items: []
                };
                objArray.push(obj);
            }

            objArray.forEach(function (item) {
                var name = item.hostName;
                arr.forEach(function (itemIns) {
                    var hosts = itemIns.host;
                    if (hosts.indexOf(name) !== -1) {
                        item.items.push(itemIns);
                    }
                });
            });
            this.devidedObjects = objArray;
            this._sortObjects();
        },

        // Sorting inner objects by apdex rating <object[]>
        _sortObjects: function () {
            var res = this.devidedObjects;
            res.forEach(function (item) {
                var items = item.items;
                function sortItems(a, b) {
                    return b.apdex - a.apdex;
                }
                items.sort(sortItems);
            });
            this.readyObject = res;
            console.log(this.readyObject);
            this.write();
        },

        // Creating DOM-elements
        write: function () {
            var objects = this.readyObject,
                div = document.createElement('div');


            div.classList.add('wrapper');
            this.enterPoint.innerHTML = '';
            this.enterPoint.appendChild(div);

            objects.forEach(function (item) {
                var item = item,
                    hosts = item.items,
                    divInner = document.createElement('div'),
                    ul = document.createElement('ul'),
                    h3 = document.createElement('h3');

                div.appendChild(divInner);
                divInner.appendChild(h3);
                h3.classList.add('host-heading');
                h3.innerHTML = item.hostName;
                divInner.classList.add('host');
                ul.classList.add('apps-list');
                divInner.appendChild(ul);

                for (var i = 0; i < 25; i++) {
                    var version = hosts[i].version,
                        li = document.createElement('li'),
                        span = document.createElement('span'),
                        spanLev = document.createElement('span');

                    ul.appendChild(li);
                    li.appendChild(spanLev);
                    li.appendChild(span);
                    spanLev.classList.add('rate');
                    spanLev.innerHTML = hosts[i].apdex;
                    span.innerHTML = hosts[i].name;

                    function showVersion(version) {
                        alert('Version is ' + version);
                    }

                    li.addEventListener('click', showVersion.bind(this, version), false);
                }
          });

        },

        // Method fo remove app
        removeAppFromHosts: function (obj) {
            var r = confirm("You realy want delete?");
            if (r === true) {
                var tembObjs = this.tempObj;
                var newObjs = tembObjs.filter(function (item) {
                    return item !== obj;
                });
                this.tempObj = newObjs;
                this._devideHost();
            }
        },

        // Method for add app
        addAppToHosts: function (obj) {
            var tembObjs = this.tempObj;
            tembObjs.push(obj);
            this._devideHost();
        }

    };
    var adpex = new Apdex();
    adpex.getTopAppsByHost();

    // Creating event for change view
    (function () {

        var checkbox = document.getElementById('list-type');

        function changeView() {
            var html = document.querySelector('html');
            if (this.checked === true) {
                html.classList.add('list-style');
            } else {
                html.classList.remove('list-style');
            }
        }

        checkbox.addEventListener('change', changeView);
    })();
}
window.addEventListener('load', app);