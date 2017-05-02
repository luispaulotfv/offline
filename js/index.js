

var listContainer = document.getElementById("list-container");
var detailContainer = document.getElementById("detail-container");
var helpContainer = document.getElementById("help-container");
var packageList = [];

// Http client async
function HttpClient() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
};

// build html for list
function getListHtml() {
    var myHtml = "";

    for (var i = 0; i < packageList.length; i++) {
        var pack = packageList[i];
        myHtml += '<div onclick="clickDetail(' + "'" + pack.id + "'" + ')">'
        myHtml += '<img src="' + pack.img + '" alt="' + pack.name + '" class="img-responsive center-block">';
        myHtml += '<h5>' + pack.name + '</h5>';
        myHtml += '<div class="text-warning">' + pack.date + '</div>';
        myHtml += '</div>';
        myHtml += '<hr/>';
    }
    return myHtml;
}

// display list on page
function displayList() {
    var myHtml = "";
    
    clearAllContainers();
    if (packageList && packageList.length > 0) {
        myHtml = getListHtml();
        helpContainer.innerHTML = "Click num destino à sua Escolha para ver os detalhes.";
    } else {
        myHtml = '<h4 class="text-warning">Não foram encontrados registos.</h4>';
    }
    listContainer.innerHTML = myHtml;
    scrollTop();
}

// get a package by id
function getPackage(id) {
    for (i = 0; i < packageList.length; i++) {
        var package = packageList[i];
        if (package.id == id) {
            return package;
        }
    }
};

// build html for detail
function getDetailHtml(pack) {
    var myHtml = "";
    if (pack) {
        myHtml = '<div>'
        myHtml += '<img src="' + pack.img + '" alt="' + pack.name + '" class="img-responsive center-block">';
        myHtml += '<hr/>';
        myHtml += '<h4>' + pack.name + '</h4>';
        myHtml += '<div class="text-warning">' + pack.date + '</div>';
        myHtml += '<div><strong>' + pack.id + '</strong></div>';
        myHtml += '<hr/>';
        myHtml += '<div><p>' + pack.description + '</p></div>';
        if (pack.includedServices) {
            myHtml += '<hr/>';
            myHtml += '<h5 class="text-warning">Serviços Incluidos</h5>';
            myHtml += '<div>' + pack.includedServices + '</div><br>'
        }
        myHtml += '<div class="text-danger text-right"><strong>' + Number(pack.price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' €</strong></div>';
        myHtml += '</div>';
    }
    return myHtml;
}

// display package detail
function displayDetail(pack) {
    var myHtml = "";

    clearAllContainers();
    helpContainer.innerHTML = "Click no botão voltar para a lista para regressar à pagina inicial.";
    if (pack) {
        myHtml = getDetailHtml(pack);
    } else {
        myHtml = '<h4 class="text-warning">Não foi encontrado o registo.</h4>';
    }
    myHtml += '<br/>';
    myHtml += '<div class="btn btn-default btn-block" onclick="getList()">Voltar para a lista</div>'
    detailContainer.innerHTML = myHtml;
    scrollTop();
}

// a package was ckicked
function clickDetail(id) {
    displayDetail(getPackage(id));
}

// move win to top
function scrollTop() {
    window.scrollTo(0, 0);
};

// clear help container
function clearHelpContainer() {
    helpContainer.innerHTML = "";
}

// clear list container
function clearListContainer() {
    listContainer.innerHTML = "";
}

// clear detail container
function clearDetailContainer() {
    detailContainer.innerHTML = "";
}

// clear all containers
function clearAllContainers() {
    clearHelpContainer();
    clearListContainer();
    clearDetailContainer();
}

// get list from json
function getList() {
    var requestUrl = 'js/data.json';
    var client = new HttpClient();

    client.get(requestUrl, function(response) {
        if (response && response.length > 0) {
            packageList = JSON.parse(response);
        } else {
            packageList = [];
        }
        displayList();
    });
}

// check for cache updates (if app cache is suported)
function cacheUpdate() {
    if ("applicationCache" in window) {
        var appCache = window.applicationCache;
        appCache.addEventListener('updateready', function(e) {
            if (appCache.status == window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache. Swap it in and reload the page to get the new hotness.
                appCache.swapCache();
                window.location.reload();
            }
        }, false);
    }
}

// initializes page
function startAll() {
    getList();
    cacheUpdate();
}

// start app
startAll();